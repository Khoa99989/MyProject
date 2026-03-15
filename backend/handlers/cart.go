package handlers

import (
	"fnb-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CartHandler struct {
	DB *gorm.DB
}

func NewCartHandler(db *gorm.DB) *CartHandler {
	return &CartHandler{DB: db}
}

// AddToCartRequest is the JSON body for adding items to cart
type AddToCartRequest struct {
	ProductID uint `json:"product_id" binding:"required"`
	Quantity  int  `json:"quantity" binding:"required,min=1"`
}

// GetCart returns all items in the user's cart
func (h *CartHandler) GetCart(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var items []models.CartItem
	if result := h.DB.Preload("Product").Preload("Product.Category").Where("user_id = ?", userID).Find(&items); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cart"})
		return
	}

	// Calculate total
	var total float64
	for _, item := range items {
		total += item.Product.Price * float64(item.Quantity)
	}

	c.JSON(http.StatusOK, gin.H{
		"items": items,
		"total": total,
		"count": len(items),
	})
}

// AddToCart adds a product to the user's cart (or updates quantity if already exists)
func (h *CartHandler) AddToCart(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var req AddToCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	// Check product exists and is in stock
	var product models.Product
	if result := h.DB.First(&product, req.ProductID); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	if !product.InStock {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product is out of stock"})
		return
	}

	// Check if item already in cart
	var existingItem models.CartItem
	result := h.DB.Where("user_id = ? AND product_id = ?", userID, req.ProductID).First(&existingItem)

	if result.Error == nil {
		// Update quantity
		existingItem.Quantity += req.Quantity
		h.DB.Save(&existingItem)
		c.JSON(http.StatusOK, gin.H{"message": "Cart updated", "item": existingItem})
		return
	}

	// Create new cart item
	uid, ok := userID.(uint)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user session"})
		return
	}
	item := models.CartItem{
		UserID:    uid,
		ProductID: req.ProductID,
		Quantity:  req.Quantity,
	}

	if result := h.DB.Create(&item); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add to cart"})
		return
	}

	// Reload with product info
	h.DB.Preload("Product").First(&item, item.ID)

	c.JSON(http.StatusCreated, gin.H{"message": "Added to cart", "item": item})
}

// UpdateCartItem updates the quantity of a cart item
func (h *CartHandler) UpdateCartItem(c *gin.Context) {
	userID, _ := c.Get("user_id")
	itemID := c.Param("id")

	var req struct {
		Quantity int `json:"quantity" binding:"required,min=1"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var item models.CartItem
	if result := h.DB.Where("id = ? AND user_id = ?", itemID, userID).First(&item); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	item.Quantity = req.Quantity
	h.DB.Save(&item)

	c.JSON(http.StatusOK, gin.H{"message": "Cart updated", "item": item})
}

// RemoveFromCart removes a product from the user's cart
func (h *CartHandler) RemoveFromCart(c *gin.Context) {
	userID, _ := c.Get("user_id")
	itemID := c.Param("id")

	result := h.DB.Where("id = ? AND user_id = ?", itemID, userID).Delete(&models.CartItem{})
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Item removed from cart"})
}

// ClearCart removes all items from the user's cart
func (h *CartHandler) ClearCart(c *gin.Context) {
	userID, _ := c.Get("user_id")

	h.DB.Where("user_id = ?", userID).Delete(&models.CartItem{})
	c.JSON(http.StatusOK, gin.H{"message": "Cart cleared"})
}
