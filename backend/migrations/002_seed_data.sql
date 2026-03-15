-- MyProject – Insert dữ liệu mẫu (categories, products, demo user)
-- Chạy SAU khi đã chạy 001_schema.sql. Có thể chạy nhiều lần: dùng ON CONFLICT / WHERE NOT EXISTS để tránh trùng.

-- 1. Categories (id 1–4)
INSERT INTO categories (id, name, description, image, created_at)
VALUES
  (1, 'Coffee', 'Premium coffee drinks crafted with the finest beans', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', NOW()),
  (2, 'Tea', 'Exquisite tea selections from around the world', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', NOW()),
  (3, 'Juice & Smoothie', 'Fresh fruit juices and healthy smoothie blends', 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400', NOW()),
  (4, 'Bakery', 'Freshly baked pastries and artisan breads', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', NOW())
ON CONFLICT (id) DO NOTHING;

-- Reset sequence nếu insert với id cố định
SELECT setval('categories_id_seq', (SELECT COALESCE(MAX(id), 1) FROM categories));

-- 2. Products (category_id 1–4)
INSERT INTO products (name, description, price, image, category_id, rating, in_stock, created_at, updated_at)
VALUES
  -- Coffee (category 1)
  ('Espresso Classic', 'Rich and bold single-shot espresso made from 100% Arabica beans. A timeless Italian classic with a thick golden crema.', 3.50, 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400', 1, 4.8, true, NOW(), NOW()),
  ('Caramel Macchiato', 'Freshly steamed milk with vanilla-flavored syrup, marked with espresso and finished with caramel drizzle.', 5.50, 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400', 1, 4.9, true, NOW(), NOW()),
  ('Cold Brew', 'Slow-steeped for 20 hours, our cold brew delivers an ultra-smooth, naturally sweet coffee experience.', 4.50, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', 1, 4.7, true, NOW(), NOW()),
  -- Tea (category 2)
  ('Matcha Latte', 'Premium Japanese matcha whisked with steamed oat milk for a vibrant, earthy latte.', 5.00, 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400', 2, 4.6, true, NOW(), NOW()),
  ('Earl Grey Royal', 'Classic Earl Grey tea infused with bergamot oil, served with a touch of lavender honey.', 4.00, 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400', 2, 4.5, true, NOW(), NOW()),
  ('Oolong Peach', 'Taiwanese oolong tea blended with sweet peach essence and served over ice.', 4.50, 'https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=400', 2, 4.4, true, NOW(), NOW()),
  -- Juice & Smoothie (category 3)
  ('Tropical Mango Smoothie', 'A creamy blend of ripe mangoes, banana, coconut milk, and a hint of lime.', 6.00, 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400', 3, 4.8, true, NOW(), NOW()),
  ('Green Detox Juice', 'A refreshing blend of kale, cucumber, green apple, ginger, and lemon.', 5.50, 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400', 3, 4.3, true, NOW(), NOW()),
  ('Berry Blast Smoothie', 'Mixed berries, Greek yogurt, and acai blended into a antioxidant-rich smoothie.', 6.50, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400', 3, 4.7, true, NOW(), NOW()),
  -- Bakery (category 4)
  ('Butter Croissant', 'Flaky, golden French croissant made with premium European butter, baked fresh daily.', 3.00, 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400', 4, 4.9, true, NOW(), NOW()),
  ('Blueberry Muffin', 'Moist, fluffy muffin bursting with fresh blueberries and topped with a sugar crumble.', 3.50, 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', 4, 4.6, true, NOW(), NOW()),
  ('Chocolate Lava Cake', 'Decadent dark chocolate cake with a warm, molten center. Served with vanilla bean ice cream.', 7.50, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400', 4, 4.9, false, NOW(), NOW());

-- 3. Demo user (email: demo@fnb.com, password: password123)
-- Bcrypt hash của "password123" (cost 10)
INSERT INTO users (name, email, password_hash, created_at, updated_at)
VALUES (
  'Demo User',
  'demo@fnb.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
