# Kết nối database Supabase – MyProject

Backend có thể chạy với **Supabase (PostgreSQL)** hoặc **SQLite** local. Khi có biến môi trường `DATABASE_URL`, backend sẽ kết nối tới Supabase.

**Project Supabase của bạn:** [ygmvsmlzpfkznyoayfqy](https://supabase.com/dashboard/project/ygmvsmlzpfkznyoayfqy) — [Table Editor](https://supabase.com/dashboard/project/ygmvsmlzpfkznyoayfqy/editor/17507?schema=public) | [Database Settings](https://supabase.com/dashboard/project/ygmvsmlzpfkznyoayfqy/settings/database)

---

## Hiển thị dữ liệu Supabase lên website (nhanh)

1. **Lấy connection string** cho project [ygmvsmlzpfkznyoayfqy](https://supabase.com/dashboard/project/ygmvsmlzpfkznyoayfqy):  
   → [Settings → Database](https://supabase.com/dashboard/project/ygmvsmlzpfkznyoayfqy/settings/database) → **Connection string** → **URI** (mode Session) → copy, thay `[YOUR-PASSWORD]` bằng Database password.

2. **Tạo `backend/.env`:**
   ```bash
   cd backend && cp .env.example .env
   ```
   Mở `.env`, gán:
   ```env
   DATABASE_URL=postgresql://postgres.ygmvsmlzpfkznyoayfqy:YOUR-PASSWORD@aws-0-xxx.pooler.supabase.com:6543/postgres
   ```
   (Đúng chuỗi bạn vừa copy; region có thể khác `aws-0-xxx`.)

3. **Chạy backend** (terminal 1):
   ```bash
   cd backend && go run .
   ```
   Thấy log **"✅ Database: connected to Supabase (PostgreSQL)"** là đã kết nối.

4. **Chạy frontend** (terminal 2):
   ```bash
   cd frontend && npm run dev
   ```

5. **Mở website:** [http://localhost:5173](http://localhost:5173)  
   Frontend gọi `/api` → Vite proxy sang `http://localhost:8080` → backend đọc/ghi Supabase. Dữ liệu (categories, products, user demo) sẽ hiển thị trên web.

## Lấy connection string từ Supabase

1. Mở **[Supabase Dashboard](https://supabase.com/dashboard)** và chọn **organization** / **project** của bạn (ví dụ: [nhxuddrfnbszouufelqn](https://supabase.com/dashboard/org/nhxuddrfnbszouufelqn)).
2. Vào **project** (ứng dụng) cần dùng → **Settings** (⚙️) → **Database**.
3. Phần **Connection string**:
   - Chọn **URI**.
   - Chọn mode **Session** (hoặc Transaction) cho ứng dụng chạy lâu (backend Go).
   - Copy chuỗi dạng:
     ```text
     postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
     ```
4. Thay `[YOUR-PASSWORD]` bằng **Database password** (mật khẩu đã đặt khi tạo project; nếu quên thì đặt lại trong Database Settings).

Tài liệu chính thức: [Supabase – Connection strings](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-string-uri).

## Cấu hình trong MyProject

1. **Tạo file `.env` trong thư mục `backend/`:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Sửa `backend/.env`, gán `DATABASE_URL` bằng connection string vừa copy:**
   ```env
   DATABASE_URL=postgresql://postgres.xxxxx:YOUR-PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

3. **Chạy backend:**
   ```bash
   cd backend
   go mod tidy   # lần đầu hoặc sau khi đổi dependency
   go run .
   ```

Khi khởi động, log sẽ có dòng **"✅ Database: connected to Supabase (PostgreSQL)"** nếu kết nối thành công.

## Không dùng Supabase (chạy local)

Để dùng SQLite local, **không set** `DATABASE_URL` (hoặc xóa/comment dòng đó trong `backend/.env`). Backend sẽ dùng file `fnb.db` trong thư mục `backend/` và log **"✅ Database: using local SQLite (fnb.db)"**.

## Tạo bảng (schema) trong Supabase

Bạn có thể **tạo bảng thủ công** bằng SQL trước khi chạy backend:

1. Vào Supabase Dashboard → project → **SQL Editor**.
2. Mở file `backend/migrations/001_schema.sql` trong repo, copy toàn bộ nội dung.
3. Dán vào SQL Editor → **Run**.

Schema này tạo đúng các bảng: `users`, `categories`, `products`, `cart_items`, `orders`, `order_items` tương ứng với MyProject (GORM models). Sau đó chạy backend với `DATABASE_URL`; nếu bảng đã tồn tại, GORM AutoMigrate sẽ chỉ cập nhật schema nếu cần.

Chi tiết: `backend/migrations/README.md`.

---

## Bảo mật

- **Không commit** file `backend/.env` hoặc bất kỳ file nào chứa `DATABASE_URL` lên Git.
- File `backend/.env.example` không chứa mật khẩu, có thể commit để làm mẫu.
