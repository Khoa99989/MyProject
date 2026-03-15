package handlers

import (
	"fnb-backend/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ProductHandler struct {
	DB *gorm.DB
}

func NewProductHandler(db *gorm.DB) *ProductHandler {
	return &ProductHandler{DB: db}
}

// GetProducts returns a list of products, optionally filtered by category or search query
func (h *ProductHandler) GetProducts(c *gin.Context) {
	var products []models.Product
	query := h.DB.Preload("Category")

	// Filter by category
	if categoryID := c.Query("category"); categoryID != "" {
		query = query.Where("category_id = ?", categoryID)
	}

	// Search by name
	if search := c.Query("search"); search != "" {
		query = query.Where("name LIKE ? OR description LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	// Filter by in_stock
	if inStock := c.Query("in_stock"); inStock == "true" {
		query = query.Where("in_stock = ?", true)
	}

	// Pagination
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}
	offset := (page - 1) * limit

	// Get total count
	var total int64
	query.Model(&models.Product{}).Count(&total)

	// Fetch products
	if result := query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&products); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"products": products,
		"total":    total,
		"page":     page,
		"limit":    limit,
	})
}

// GetProduct returns a single product by ID
func (h *ProductHandler) GetProduct(c *gin.Context) {
	id := c.Param("id")

	var product models.Product
	if result := h.DB.Preload("Category").First(&product, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, product)
}

// GetCategories returns all categories
func (h *ProductHandler) GetCategories(c *gin.Context) {
	var categories []models.Category

	if result := h.DB.Find(&categories); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}

	c.JSON(http.StatusOK, categories)
}

// GetFeaturedProducts returns top-rated products
func (h *ProductHandler) GetFeaturedProducts(c *gin.Context) {
	var products []models.Product

	if result := h.DB.Preload("Category").Where("in_stock = ?", true).Order("rating DESC").Limit(6).Find(&products); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch featured products"})
		return
	}

	c.JSON(http.StatusOK, products)
}
