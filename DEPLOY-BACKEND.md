# Đưa Backend (API) + Database lên

**Database** đã dùng **Supabase** (PostgreSQL trên cloud). Bạn chỉ cần **deploy Backend (Go API)** lên **Render**; backend sẽ kết nối tới Supabase qua biến `DATABASE_URL`.

---

## Tổng quan

| Thành phần | Nơi chạy | Ghi chú |
|------------|----------|---------|
| **Database** | **Supabase** (đã có) | Chỉ cần lấy connection string để cấu hình backend |
| **Backend (API)** | **Render** | Deploy code Go, set `DATABASE_URL` + `ALLOWED_ORIGINS` |
| **Frontend** | **Vercel** (đã deploy) | Sau khi có URL backend → thêm `VITE_API_URL` và Redeploy |

---

## Bước 1: Đẩy code lên GitHub (nếu chưa có)

Trong Terminal tại thư mục project:

```bash
cd /Users/khoanguyen/Documents/MyProject
git init
git add .
git commit -m "Add backend for Render deploy"
```

Tạo repo mới trên GitHub: [github.com/new](https://github.com/new), rồi:

```bash
git remote add origin https://github.com/USERNAME/TEN-REPO.git
git branch -M main
git push -u origin main
```

(Thay `USERNAME` và `TEN-REPO` bằng tên GitHub và tên repo của bạn.)

---

## Bước 2: Lấy Connection String từ Supabase (Database)

1. Vào **[Supabase Dashboard](https://supabase.com/dashboard)** → chọn project của bạn.
2. **Settings** (⚙️) → **Database**.
3. Phần **Connection string**:
   - Chọn **URI**.
   - Chọn mode **Session** (hoặc Transaction).
   - Copy chuỗi, ví dụ:
     ```text
     postgresql://postgres.ygmvsmlzpfkznyoayfqy:YOUR-PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
     ```
4. Thay `[YOUR-PASSWORD]` (hoặc `YOUR-PASSWORD`) bằng **Database password** của project (nếu quên: Database Settings → Reset database password).

Giữ chuỗi này để dán vào Render ở bước 4.

---

## Bước 3: Tạo Web Service trên Render (Backend)

1. Vào **[Render](https://render.com)** → đăng nhập (GitHub).
2. **Dashboard** → **New +** → **Web Service**.
3. **Connect a repository** → chọn repo GitHub vừa push (nếu chưa thấy: **Configure account** / cấp quyền Render truy cập GitHub).
4. Sau khi chọn repo, cấu hình:
   - **Name:** `fnb-backend` (hoặc tên bạn thích).
   - **Region:** chọn gần bạn (vd: Singapore).
   - **Root Directory:** `backend` (bắt buộc).
   - **Runtime:** Go.
   - **Build Command:** `go build -o server .`
   - **Start Command:** `./server`
   - **Instance type:** Free.

---

## Bước 4: Cấu hình Environment Variables (Render)

Trong trang tạo/chỉnh sửa Web Service, phần **Environment** (Environment Variables):

1. **Add Environment Variable**
   - **Key:** `DATABASE_URL`
   - **Value:** dán **connection string Supabase** (chuỗi đã copy ở Bước 2, đã thay mật khẩu).

2. **Add Environment Variable**
   - **Key:** `ALLOWED_ORIGINS`
   - **Value:** `https://frontend-dotzun8kb-khoa99989s-projects.vercel.app`  
     (đúng URL Vercel frontend của bạn; nếu có nhiều domain thì cách nhau bởi dấu phẩy, không dấu cách thừa).

**Lưu ý:** Render tự set `PORT`, không cần tạo biến này.

---

## Bước 5: Deploy

1. Bấm **Create Web Service**.
2. Đợi build và deploy xong (vài phút).
3. Copy **URL** của service (vd: `https://fnb-backend-xxxx.onrender.com`).  
   → **API base** cho frontend sẽ là: `https://fnb-backend-xxxx.onrender.com/api` (có `/api` ở cuối).

---

## Bước 6: Cho Frontend gọi đúng API (Vercel)

1. Vào **[Vercel Dashboard](https://vercel.com/dashboard)** → chọn project **frontend**.
2. **Settings** → **Environment Variables**.
3. Thêm (hoặc sửa):
   - **Key:** `VITE_API_URL`
   - **Value:** `https://fnb-backend-xxxx.onrender.com/api` (thay bằng đúng URL Render của bạn, **có** `/api`).
   - **Environment:** Production (và Preview nếu muốn).
4. **Save** → vào **Deployments** → bản deploy mới nhất → **⋮** → **Redeploy**.

Sau khi redeploy xong, frontend sẽ gọi API trên Render; backend đã cho phép CORS từ URL Vercel nhờ `ALLOWED_ORIGINS`.

---

## Kiểm tra nhanh

- **Backend:** Mở `https://fnb-backend-xxxx.onrender.com/health` trên trình duyệt → phải thấy `{"status":"ok",...}`.
- **Frontend:** Mở [https://frontend-dotzun8kb-khoa99989s-projects.vercel.app](https://frontend-dotzun8kb-khoa99989s-projects.vercel.app) → đăng nhập (demo@fnb.com / password123), xem Menu, Cart → mọi thứ lấy từ API + Supabase.

---

## Tóm tắt

1. **Database:** Giữ Supabase, chỉ cần connection string.
2. **Backend:** Deploy lên Render (GitHub → Render Web Service, root `backend`, env `DATABASE_URL` + `ALLOWED_ORIGINS`).
3. **Frontend:** Trong Vercel thêm `VITE_API_URL` = URL backend + `/api`, rồi Redeploy.

Nếu có lỗi khi deploy Render (build/start), kiểm tra **Logs** trong Render Dashboard; thường do thiếu `DATABASE_URL` hoặc sai connection string.
