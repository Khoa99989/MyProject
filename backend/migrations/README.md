# Migrations – MyProject

Schema SQL tương ứng với các bảng backend (GORM models).

## Bảng tạo bởi schema

| Bảng          | Mô tả                          |
|---------------|---------------------------------|
| `users`       | Người dùng (name, email, password_hash) |
| `categories`  | Danh mục (Coffee, Tea, Juice, Bakery)   |
| `products`    | Sản phẩm (name, price, category_id…)   |
| `cart_items`  | Giỏ hàng (user_id, product_id, quantity) |
| `orders`      | Đơn hàng (user_id, total, status)       |
| `order_items` | Chi tiết đơn (order_id, product_id, quantity, price) |

## Insert dữ liệu mẫu

Sau khi tạo bảng, chạy **`002_seed_data.sql`** trong SQL Editor để insert:

- **4 categories:** Coffee, Tea, Juice & Smoothie, Bakery  
- **12 products:** 3 món mỗi category (Espresso, Matcha, Smoothie, Croissant, …)  
- **1 demo user:** `demo@fnb.com` / mật khẩu `password123`

## Cách chạy

### Cách 1: Supabase SQL Editor

1. Mở [Supabase Dashboard](https://supabase.com/dashboard) → chọn project → **SQL Editor**.
2. New query → dán nội dung file `001_schema.sql` → **Run**.

### Cách 2: Backend tự tạo (đã có sẵn)

Khi chạy `go run .` với `DATABASE_URL` trỏ tới Supabase, GORM **AutoMigrate** sẽ tự tạo/cập nhật bảng theo models. Chỉ cần chạy file SQL trên nếu bạn muốn tạo bảng thủ công trước (ví dụ không chạy Go app).

### Cách 3: psql

```bash
psql "$DATABASE_URL" -f backend/migrations/001_schema.sql
```
