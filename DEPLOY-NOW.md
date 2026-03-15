# Đưa website lên domain free – làm ngay

**Frontend đã deploy:** [https://frontend-dotzun8kb-khoa99989s-projects.vercel.app](https://frontend-dotzun8kb-khoa99989s-projects.vercel.app) (Vercel)

Chạy lần lượt theo thứ tự dưới đây (trong **Terminal** trên máy bạn, không trong sandbox).

---

## Bước 1: Deploy Backend lên Render (cần GitHub)

1. **Đưa code lên GitHub**
   - Mở Terminal tại thư mục dự án:
     ```bash
     cd /Users/khoanguyen/Documents/MyProject
     git init
     git add .
     git commit -m "Prepare deploy"
     ```
   - Tạo repo mới trên [github.com](https://github.com/new) (private hoặc public).
   - Chạy (thay `USER` và `REPO` bằng tên GitHub của bạn và tên repo):
     ```bash
     git remote add origin https://github.com/USER/REPO.git
     git branch -M main
     git push -u origin main
     ```

2. **Tạo Web Service trên Render**
   - Vào [render.com](https://render.com) → đăng nhập → **New +** → **Web Service**.
   - Kết nối repo GitHub vừa push, chọn repo.
   - Render có thể tự nhận **render.yaml** (root directory = `backend`). Nếu không:
     - **Root Directory**: `backend`
     - **Build Command**: `go build -o server .`
     - **Start Command**: `./server`
   - **Environment Variables** (bắt buộc):
     - `DATABASE_URL` = connection string Supabase (copy từ Supabase Dashboard, xem `SUPABASE.md`).
     - `ALLOWED_ORIGINS` = để trống lúc này (sẽ thêm sau khi có URL frontend).
   - **Create Web Service** → đợi deploy xong.
   - Copy **URL backend** (vd: `https://fnb-backend-xxxx.onrender.com`).

---

## Bước 2: Deploy Frontend lên Vercel

1. **Cài Vercel CLI và đăng nhập** (chạy trong Terminal):
   ```bash
   npm i -g vercel
   vercel login
   ```
   Làm theo hướng dẫn đăng nhập (email hoặc GitHub).

2. **Deploy từ thư mục frontend** (thay `URL_BACKEND` bằng URL Render từ Bước 1, **không** có `/api` ở cuối — script sẽ thêm):
   ```bash
   cd /Users/khoanguyen/Documents/MyProject/frontend
   VITE_API_URL="https://fnb-backend-xxxx.onrender.com/api" vercel --prod
   ```
   Hoặc không set env lúc deploy, rồi vào [vercel.com/dashboard](https://vercel.com/dashboard) → Project → **Settings** → **Environment Variables** → thêm:
   - Name: `VITE_API_URL`
   - Value: `https://fnb-backend-xxxx.onrender.com/api`
   Sau đó **Redeploy** project.

3. **Lấy URL frontend** (vd: `https://fnb-frontend-xxx.vercel.app`).

---

## Bước 3: Cập nhật CORS (Backend)

- Vào [Render Dashboard](https://dashboard.render.com) → chọn service **Backend** → **Environment**.
- Thêm hoặc sửa:
  - Key: `ALLOWED_ORIGINS`
  - Value: `https://frontend-dotzun8kb-khoa99989s-projects.vercel.app` (URL Vercel frontend của bạn; có thể thêm nhiều origin cách nhau bởi dấu phẩy).
- **Save Changes** → Render sẽ tự redeploy.

---

## Xong

- **Website (frontend):** [https://frontend-dotzun8kb-khoa99989s-projects.vercel.app](https://frontend-dotzun8kb-khoa99989s-projects.vercel.app)
- **API (backend):** `https://xxx.onrender.com` (sau khi deploy Render)

Nếu bạn deploy backend + database: xem **[DEPLOY-BACKEND.md](DEPLOY-BACKEND.md)** — hướng dẫn đưa API lên Render và kết nối Supabase, sau đó cấu hình `VITE_API_URL` + `ALLOWED_ORIGINS`.
