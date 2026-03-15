# Deploy website lên domain miễn phí

Dự án gồm **Frontend (Vite)** + **Backend (Go)** + **Supabase**. Các nền tảng dưới đây đều cho **subdomain miễn phí** (không cần mua domain).

---

## Gợi ý: Domain free “ổn” nhất

| Thành phần | Nền tảng | Domain mẫu (free) |
|------------|----------|--------------------|
| **Frontend** | **Vercel** hoặc **Netlify** | `myproject.vercel.app` / `myproject.netlify.app` |
| **Backend** | **Render** | `myproject-api.onrender.com` |
| **Database** | **Supabase** (đã dùng) | Đã có sẵn |

- **Vercel / Netlify**: rất ổn cho static/SPA, SSL tự động, CDN, free tier rộng.
- **Render**: free tier cho Go backend; service có thể “ngủ” sau ~15 phút không dùng, lần gọi đầu có thể chậm vài giây.
- **Cloudflare Pages** (`*.pages.dev`): cũng rất tốt nếu bạn muốn dùng Cloudflare.

---

## 1. Deploy Backend (Go) lên Render

1. Đăng ký / đăng nhập [Render](https://render.com).
2. **New** → **Web Service**.
3. Kết nối repo Git (GitHub/GitLab). Chọn repo của bạn.
4. Cấu hình:
   - **Root Directory**: `backend`
   - **Runtime**: Go
   - **Build Command**: `go build -o server .`
   - **Start Command**: `./server`
5. **Environment** (Environment Variables):
   - `DATABASE_URL`: connection string Supabase (xem `SUPABASE.md`).
   - `ALLOWED_ORIGINS`: URL frontend (sẽ thêm sau), ví dụ:  
     `https://myproject.vercel.app`  
     (nhiều origin cách nhau bằng dấu phẩy, không dấu cách thừa).
   - `PORT`: Render tự set, không cần tạo.
6. **Create Web Service**. Đợi deploy xong.
7. Lấy URL backend, ví dụ: `https://myproject-api.onrender.com`  
   → API base cho frontend sẽ là: `https://myproject-api.onrender.com/api`.

**Lưu ý:** Nếu chưa deploy frontend, tạm để trống `ALLOWED_ORIGINS` hoặc thêm sau khi có URL Vercel/Netlify.

---

## 2. Deploy Frontend (Vite) lên Vercel

1. Đăng ký / đăng nhập [Vercel](https://vercel.com).
2. **Add New** → **Project** → import repo Git.
3. Cấu hình:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables** (cho production):
   - `VITE_API_URL` = `https://myproject-api.onrender.com/api`  
     (thay bằng đúng URL backend Render của bạn).
5. Deploy. Bạn sẽ có URL dạng: `https://myproject.vercel.app`.

**Cập nhật CORS backend:** Vào Render → Service backend → **Environment** → thêm hoặc sửa `ALLOWED_ORIGINS` = `https://myproject.vercel.app` (đúng URL Vercel vừa tạo). Save để redeploy.

---

## 3. (Thay thế) Deploy Frontend lên Netlify

1. Đăng ký [Netlify](https://netlify.com) → **Add new site** → **Import an existing project** (Git).
2. Cấu hình:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
3. **Environment variables**:
   - `VITE_API_URL` = `https://myproject-api.onrender.com/api`
4. Deploy. URL dạng: `https://tên-site.netlify.app`.

Sau đó cập nhật `ALLOWED_ORIGINS` trên Render để thêm URL Netlify này.

---

## 4. (Tùy chọn) Frontend trên Cloudflare Pages

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Chọn repo, **Root directory**: `frontend`.
3. **Build**: Build command `npm run build`, Output directory `dist`.
4. **Environment variables**: thêm `VITE_API_URL` = `https://myproject-api.onrender.com/api` (Variables → Add variable).
5. Deploy. URL: `https://<tên-project>.pages.dev`.

Cập nhật `ALLOWED_ORIGINS` trên Render để thêm URL `https://<tên-project>.pages.dev`.

---

## Tóm tắt biến môi trường

| Nơi | Biến | Ý nghĩa |
|-----|------|--------|
| **Render (backend)** | `DATABASE_URL` | Connection string Supabase |
| **Render (backend)** | `ALLOWED_ORIGINS` | URL frontend (Vercel/Netlify/Pages), cách nhau bởi dấu phẩy |
| **Vercel/Netlify/Pages (frontend)** | `VITE_API_URL` | `https://<backend-url>/api` (không có slash cuối cũng được, code đã nối path) |

---

## Domain free “ổn” – kết luận

- **Frontend**: **Vercel** (`*.vercel.app`) hoặc **Netlify** (`*.netlify.app`) – cả hai đều ổn, dễ dùng.
- **Backend**: **Render** (`*.onrender.com`) – phù hợp Go, free tier đủ cho demo; nhớ set `ALLOWED_ORIGINS` và `DATABASE_URL`.
- **Database**: Giữ **Supabase** như hiện tại.

Sau khi deploy xong, bạn có 2 link: một cho website (frontend), một cho API (backend), đều dùng domain/subdomain miễn phí.
