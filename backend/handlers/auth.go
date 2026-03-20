package handlers

import (
	"errors"
	"fnb-backend/models"
	"fnb-backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ─── Handler ────────────────────────────────────────────────────────────────────

// AuthHandler is a thin HTTP controller that delegates business logic to AuthService.
type AuthHandler struct {
	service *services.AuthService
}

// NewAuthHandler creates a new AuthHandler with the given AuthService
func NewAuthHandler(svc *services.AuthService) *AuthHandler {
	return &AuthHandler{service: svc}
}

// ─── Request / Response DTOs ────────────────────────────────────────────────────

// RegisterRequest is the JSON body for registration
type RegisterRequest struct {
	Name     string `json:"name" binding:"required,min=2"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Lang     string `json:"lang"`
}

// LoginRequest is the JSON body for login
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// AuthResponse is the JSON response after successful auth
type AuthResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

// UserResponse is a safe user representation (no password hash)
type UserResponse struct {
	ID    uint   `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

// toUserResponse converts a models.User to a safe UserResponse
func toUserResponse(u models.User) UserResponse {
	return UserResponse{
		ID:    u.ID,
		Name:  u.Name,
		Email: u.Email,
	}
}

// mapServiceError maps a service-layer error to the appropriate HTTP status code and message
func mapServiceError(err error) (int, string) {
	switch {
	case errors.Is(err, services.ErrEmailAlreadyExists):
		return http.StatusConflict, "Email already registered"
	case errors.Is(err, services.ErrInvalidCredentials):
		return http.StatusUnauthorized, "Invalid email or password"
	case errors.Is(err, services.ErrUserNotFound):
		return http.StatusNotFound, "User not found"
	default:
		return http.StatusInternalServerError, "An internal error occurred"
	}
}

// ─── Endpoints ──────────────────────────────────────────────────────────────────

// Register handles POST /api/register
// It validates the request, delegates to AuthService, and returns the result.
func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	result, err := h.service.RegisterUser(services.RegisterInput{
		Name:     req.Name,
		Email:    req.Email,
		Password: req.Password,
		Lang:     req.Lang,
	})
	if err != nil {
		status, msg := mapServiceError(err)
		c.JSON(status, gin.H{"error": msg})
		return
	}

	c.JSON(http.StatusCreated, AuthResponse{
		Token: result.Token,
		User:  toUserResponse(result.User),
	})
}

// Login handles POST /api/login
// It validates the request, delegates to AuthService, and returns the result.
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	result, err := h.service.LoginUser(req.Email, req.Password)
	if err != nil {
		status, msg := mapServiceError(err)
		c.JSON(status, gin.H{"error": msg})
		return
	}

	c.JSON(http.StatusOK, AuthResponse{
		Token: result.Token,
		User:  toUserResponse(result.User),
	})
}

// GetProfile handles GET /api/profile
// Returns the authenticated user's profile.
func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var user models.User
	if result := h.service.DB().First(&user, userID); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, toUserResponse(user))
}
