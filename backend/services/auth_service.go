package services

import (
	"errors"
	"fnb-backend/middleware"
	"fnb-backend/models"
	"log"
	"regexp"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// ─── Custom Errors ──────────────────────────────────────────────────────────────

var (
	ErrEmailAlreadyExists = errors.New("email already registered")
	ErrInvalidInput       = errors.New("invalid input")
	ErrHashPassword       = errors.New("failed to hash password")
	ErrCreateUser         = errors.New("failed to create user in database")
	ErrGenerateToken      = errors.New("failed to generate authentication token")
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrUserNotFound       = errors.New("user not found")
)

// emailRegex is a simple email format check
var emailRegex = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)

// ─── DTOs ───────────────────────────────────────────────────────────────────────

// RegisterInput holds sanitized registration data from the handler
type RegisterInput struct {
	Name     string
	Email    string
	Password string
	Lang     string
}

// AuthResult is returned after successful registration or login
type AuthResult struct {
	Token string
	User  models.User
}

// WelcomeEmailFunc is a callback signature for sending welcome emails.
// This avoids a circular dependency between services and handlers packages.
type WelcomeEmailFunc func(name, email, lang string)

// ─── Service ────────────────────────────────────────────────────────────────────

// AuthService encapsulates all authentication business logic,
// separated from HTTP concerns for testability and clean architecture.
type AuthService struct {
	db               *gorm.DB
	sendWelcomeEmail WelcomeEmailFunc
}

// NewAuthService creates a new AuthService instance.
// welcomeEmailFn is called asynchronously after successful registration.
func NewAuthService(db *gorm.DB, welcomeEmailFn WelcomeEmailFunc) *AuthService {
	return &AuthService{
		db:               db,
		sendWelcomeEmail: welcomeEmailFn,
	}
}

// DB returns the underlying database connection (for handlers that need direct access)
func (s *AuthService) DB() *gorm.DB {
	return s.db
}

// ─── Registration ───────────────────────────────────────────────────────────────

// RegisterUser handles the complete user registration flow:
//  1. Sanitize input (trim whitespace, lowercase email)
//  2. Check for duplicate email
//  3. Hash password with bcrypt
//  4. Insert user into database within a transaction
//  5. Send welcome email asynchronously
//  6. Generate JWT token
//
// Returns AuthResult on success, or a specific error for the handler to map to HTTP status.
func (s *AuthService) RegisterUser(input RegisterInput) (*AuthResult, error) {
	// Step 1: Sanitize input
	input.Name = strings.TrimSpace(input.Name)
	input.Email = strings.ToLower(strings.TrimSpace(input.Email))
	if input.Lang == "" {
		input.Lang = "en"
	}

	// Step 1b: Validate sanitized input
	if len(input.Name) < 2 {
		log.Printf("[AUTH] Registration failed: name too short after trim")
		return nil, ErrInvalidInput
	}
	if !emailRegex.MatchString(input.Email) {
		log.Printf("[AUTH] Registration failed: invalid email format after trim")
		return nil, ErrInvalidInput
	}

	log.Printf("[AUTH] Registration attempt: email=%s", input.Email)

	// Step 2: Check if email already exists
	var existing models.User
	if err := s.db.Where("email = ?", input.Email).First(&existing).Error; err == nil {
		log.Printf("[AUTH] Registration failed: email=%s already exists", input.Email)
		return nil, ErrEmailAlreadyExists
	}

	// Step 3: Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("[AUTH] Registration failed: password hash error: %v", err)
		return nil, ErrHashPassword
	}

	// Step 4: Create user inside a database transaction for atomicity
	user := models.User{
		Name:         input.Name,
		Email:        input.Email,
		PasswordHash: string(hashedPassword),
	}

	err = s.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&user).Error; err != nil {
			log.Printf("[AUTH] Registration failed: db insert error: %v", err)
			return err
		}
		log.Printf("[AUTH] User inserted into database: id=%d, email=%s", user.ID, user.Email)
		return nil
	})
	if err != nil {
		return nil, ErrCreateUser
	}

	// Step 5: Send welcome email asynchronously (fire-and-forget)
	if s.sendWelcomeEmail != nil {
		go func() {
			log.Printf("[AUTH] Sending welcome email: email=%s, lang=%s", user.Email, input.Lang)
			s.sendWelcomeEmail(user.Name, user.Email, input.Lang)
		}()
	}

	// Step 6: Generate JWT token
	token, err := generateJWT(user)
	if err != nil {
		log.Printf("[AUTH] Registration failed: token generation error: %v", err)
		return nil, ErrGenerateToken
	}

	log.Printf("[AUTH] Registration complete: id=%d, email=%s", user.ID, user.Email)

	return &AuthResult{Token: token, User: user}, nil
}

// ─── Login ──────────────────────────────────────────────────────────────────────

// LoginUser authenticates a user by email and password.
// Returns AuthResult on success, or ErrInvalidCredentials on failure.
func (s *AuthService) LoginUser(email, password string) (*AuthResult, error) {
	email = strings.ToLower(strings.TrimSpace(email))

	log.Printf("[AUTH] Login attempt: email=%s", email)

	// Find user by email
	var user models.User
	if err := s.db.Where("email = ?", email).First(&user).Error; err != nil {
		log.Printf("[AUTH] Login failed: email=%s not found", email)
		return nil, ErrInvalidCredentials
	}

	// Compare password hash
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		log.Printf("[AUTH] Login failed: invalid password for email=%s", email)
		return nil, ErrInvalidCredentials
	}

	// Generate JWT token
	token, err := generateJWT(user)
	if err != nil {
		log.Printf("[AUTH] Login failed: token generation error: %v", err)
		return nil, ErrGenerateToken
	}

	log.Printf("[AUTH] Login successful: id=%d, email=%s", user.ID, user.Email)

	return &AuthResult{Token: token, User: user}, nil
}

// ─── Token Generation ───────────────────────────────────────────────────────────

// generateJWT creates a signed JWT for the given user
func generateJWT(user models.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
		"iat":     time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(middleware.JWTSecret)
}
