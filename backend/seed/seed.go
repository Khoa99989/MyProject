package seed

import (
	"fnb-backend/models"
	"log"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// SeedDatabase populates the database with demo F&B data
func SeedDatabase(db *gorm.DB) {
	// Check if already seeded
	var count int64
	db.Model(&models.Product{}).Count(&count)
	if count > 0 {
		log.Println("Database already seeded, skipping...")
		return
	}

	log.Println("🌱 Seeding database with F&B demo data...")

	// --- Categories ---
	categories := []models.Category{
		{Name: "Coffee", Description: "Premium coffee drinks crafted with the finest beans", Image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400"},
		{Name: "Tea", Description: "Exquisite tea selections from around the world", Image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400"},
		{Name: "Juice & Smoothie", Description: "Fresh fruit juices and healthy smoothie blends", Image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400"},
		{Name: "Bakery", Description: "Freshly baked pastries and artisan breads", Image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400"},
	}

	for i := range categories {
		db.Create(&categories[i])
	}

	// --- Products ---
	products := []models.Product{
		// Coffee
		{Name: "Espresso Classic", Description: "Rich and bold single-shot espresso made from 100% Arabica beans. A timeless Italian classic with a thick golden crema.", Price: 3.50, Image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400", CategoryID: categories[0].ID, Rating: 4.8, InStock: true},
		{Name: "Caramel Macchiato", Description: "Freshly steamed milk with vanilla-flavored syrup, marked with espresso and finished with caramel drizzle.", Price: 5.50, Image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400", CategoryID: categories[0].ID, Rating: 4.9, InStock: true},
		{Name: "Cold Brew", Description: "Slow-steeped for 20 hours, our cold brew delivers an ultra-smooth, naturally sweet coffee experience.", Price: 4.50, Image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400", CategoryID: categories[0].ID, Rating: 4.7, InStock: true},

		// Tea
		{Name: "Matcha Latte", Description: "Premium Japanese matcha whisked with steamed oat milk for a vibrant, earthy latte.", Price: 5.00, Image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400", CategoryID: categories[1].ID, Rating: 4.6, InStock: true},
		{Name: "Earl Grey Royal", Description: "Classic Earl Grey tea infused with bergamot oil, served with a touch of lavender honey.", Price: 4.00, Image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400", CategoryID: categories[1].ID, Rating: 4.5, InStock: true},
		{Name: "Oolong Peach", Description: "Taiwanese oolong tea blended with sweet peach essence and served over ice.", Price: 4.50, Image: "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=400", CategoryID: categories[1].ID, Rating: 4.4, InStock: true},

		// Juice & Smoothie
		{Name: "Tropical Mango Smoothie", Description: "A creamy blend of ripe mangoes, banana, coconut milk, and a hint of lime.", Price: 6.00, Image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400", CategoryID: categories[2].ID, Rating: 4.8, InStock: true},
		{Name: "Green Detox Juice", Description: "A refreshing blend of kale, cucumber, green apple, ginger, and lemon.", Price: 5.50, Image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400", CategoryID: categories[2].ID, Rating: 4.3, InStock: true},
		{Name: "Berry Blast Smoothie", Description: "Mixed berries, Greek yogurt, and acai blended into a antioxidant-rich smoothie.", Price: 6.50, Image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400", CategoryID: categories[2].ID, Rating: 4.7, InStock: true},

		// Bakery
		{Name: "Butter Croissant", Description: "Flaky, golden French croissant made with premium European butter, baked fresh daily.", Price: 3.00, Image: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400", CategoryID: categories[3].ID, Rating: 4.9, InStock: true},
		{Name: "Blueberry Muffin", Description: "Moist, fluffy muffin bursting with fresh blueberries and topped with a sugar crumble.", Price: 3.50, Image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400", CategoryID: categories[3].ID, Rating: 4.6, InStock: true},
		{Name: "Chocolate Lava Cake", Description: "Decadent dark chocolate cake with a warm, molten center. Served with vanilla bean ice cream.", Price: 7.50, Image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400", CategoryID: categories[3].ID, Rating: 4.9, InStock: false},
	}

	for i := range products {
		db.Create(&products[i])
	}

	// --- Demo User ---
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	demoUser := models.User{
		Name:         "Demo User",
		Email:        "demo@fnb.com",
		PasswordHash: string(hashedPassword),
	}
	db.Create(&demoUser)

	log.Println("✅ Database seeded successfully!")
	log.Printf("   → %d categories, %d products, 1 demo user (demo@fnb.com / password123)\n", len(categories), len(products))
}
