package main

import (
	"embed"
	"fnb-backend/handlers"
	"fnb-backend/middleware"
	"fnb-backend/models"
	"fnb-backend/seed"
	"io/fs"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

//go:embed openapi.json swagger.html
var swaggerFS embed.FS

func main() {
	// Load .env from backend directory (optional; when running from backend/)
	_ = godotenv.Load(".env")

	// --- Database: Supabase (PostgreSQL) or SQLite ---
	var db *gorm.DB
	var err error

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL != "" {
		// Connect to Supabase / PostgreSQL
		db, err = gorm.Open(postgres.Open(dbURL), &gorm.Config{})
		if err != nil {
			log.Fatal("Failed to connect to Supabase/PostgreSQL:", err)
		}
		log.Println("✅ Database: connected to Supabase (PostgreSQL)")
	} else {
		// Fallback: local SQLite
		db, err = gorm.Open(sqlite.Open("fnb.db"), &gorm.Config{})
		if err != nil {
			log.Fatal("Failed to connect to database:", err)
		}
		log.Println("✅ Database: using local SQLite (fnb.db)")
	}

	// Auto-migrate models
	if err := db.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Product{},
		&models.CartItem{},
		&models.Order{},
		&models.OrderItem{},
	); err != nil {
		log.Fatal("Failed to auto-migrate database:", err)
	}

	// Seed demo data
	seed.SeedDatabase(db)

	// --- Handlers ---
	authHandler := handlers.NewAuthHandler(db)
	productHandler := handlers.NewProductHandler(db)
	cartHandler := handlers.NewCartHandler(db)

	// --- Router ---
	r := gin.Default()

	// CORS — allow frontend origin (local + production + ALLOWED_ORIGINS khi deploy)
	origins := []string{
		"http://localhost:5173", "http://localhost:5174", "http://localhost:5175",
		"http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:5174",
		"https://frontend-dotzun8kb-khoa99989s-projects.vercel.app",
	}
	if o := os.Getenv("ALLOWED_ORIGINS"); o != "" {
		for _, s := range strings.Split(o, ",") {
			if s = strings.TrimSpace(s); s != "" {
				origins = append(origins, s)
			}
		}
	}
	r.Use(cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// --- Swagger / OpenAPI ---
	r.GET("/openapi.json", func(c *gin.Context) {
		data, err := fs.ReadFile(swaggerFS, "openapi.json")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load OpenAPI spec"})
			return
		}
		c.Header("Content-Type", "application/json")
		c.Data(http.StatusOK, "application/json", data)
	})
	serveSwagger := func(c *gin.Context) {
		data, err := fs.ReadFile(swaggerFS, "swagger.html")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load Swagger UI"})
			return
		}
		c.Data(http.StatusOK, "text/html; charset=utf-8", data)
	}
	r.GET("/swagger", serveSwagger)
	r.GET("/swagger/", serveSwagger)

	// --- Public Routes ---
	api := r.Group("/api")
	{
		// Auth
		api.POST("/register", authHandler.Register)
		api.POST("/login", authHandler.Login)

		// Products (public)
		api.GET("/products", productHandler.GetProducts)
		api.GET("/products/featured", productHandler.GetFeaturedProducts)
		api.GET("/products/:id", productHandler.GetProduct)
		api.GET("/categories", productHandler.GetCategories)
	}

	// --- Protected Routes ---
	protected := api.Group("")
	protected.Use(middleware.AuthMiddleware())
	{
		// Profile
		protected.GET("/profile", authHandler.GetProfile)

		// Cart
		protected.GET("/cart", cartHandler.GetCart)
		protected.POST("/cart", cartHandler.AddToCart)
		protected.PUT("/cart/:id", cartHandler.UpdateCartItem)
		protected.DELETE("/cart/:id", cartHandler.RemoveFromCart)
		protected.DELETE("/cart", cartHandler.ClearCart)
	}

	// --- Health Check ---
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "service": "fnb-backend"})
	})

	// --- Start Server ---
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	addr := ":" + port
	log.Println("🚀 F&B Backend running on", "http://localhost"+addr)
	log.Println("📖 Swagger UI: http://localhost" + addr + "/swagger")
	if err := r.Run(addr); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
