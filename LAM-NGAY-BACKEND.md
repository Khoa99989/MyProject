# Làm ngay: Đẩy backend + DB lên (kết nối frontend Vercel)

Frontend: **https://frontend-dotzun8kb-khoa99989s-projects.vercel.app**

Làm lần lượt 3 việc dưới đây (chỉ copy/dán và bấm).

---

## 1. Đẩy code lên GitHub

Trong Terminal (tại thư mục project):

```bash
cd /Users/khoanguyen/Documents/MyProject
```

Tạo repo mới trên GitHub: mở **https://github.com/new** → đặt tên repo (vd: `myproject`) → **Create repository** (không tick README).

Rồi chạy (thay `USER` và `REPO` bằng tên GitHub và tên repo của bạn):

```bash
git remote add origin https://github.com/USER/REPO.git
git branch -M main
git push -u origin main
```

---

## 2. Lấy connection string Supabase (Database)

1. Mở **https://supabase.com/dashboard** → chọn project.
2. **Settings** (bên trái) → **Database**.
3. Phần **Connection string** → chọn **URI** → mode **Session** → **Copy**.
4. Trong chuỗi vừa copy, tìm `[YOUR-PASSWORD]` (hoặc tương tự) và **thay bằng mật khẩu database** của project (nếu quên: trong Database Settings có **Reset database password**).

Giữ chuỗi này để dán vào Render ở bước 3.

---

## 3. Tạo Backend trên Render và cấu hình

1. Mở **https://dashboard.render.com** → đăng nhập bằng GitHub.
2. **New +** → **Web Service**.
3. **Connect repository** → chọn repo vừa push (vd: `USER/REPO`).
4. Cấu hình:
   - **Name:** `fnb-backend`
   - **Root Directory:** gõ `backend`
   - **Build Command:** `go build -o server .`
   - **Start Command:** `./server`
   - **Instance type:** Free
5. **Environment Variables** → **Add Environment Variable** (thêm 2 biến):

   | Key | Value |
   |-----|--------|
   | `DATABASE_URL` | *(dán connection string Supabase đã copy ở bước 2)* |
   | `ALLOWED_ORIGINS` | `https://frontend-dotzun8kb-khoa99989s-projects.vercel.app` |

6. Bấm **Create Web Service** → đợi deploy xong (vài phút).
7. Copy **URL** của service (vd: `https://fnb-backend-xxxx.onrender.com`).  
   → URL API = URL đó + `/api` (vd: `https://fnb-backend-xxxx.onrender.com/api`).

---

## 4. Cho frontend gọi API (Vercel)

1. Mở **https://vercel.com/dashboard** → chọn project **frontend**.
2. **Settings** → **Environment Variables**.
3. **Add New**:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://fnb-backend-XXXX.onrender.com/api` *(thay XXXX bằng URL thật của Render từ bước 3.7)*
   - **Environment:** Production (và Preview nếu muốn).
4. **Save**.
5. Vào **Deployments** → bản deploy mới nhất → **⋮** (ba chấm) → **Redeploy**.

---

## Xong

- Mở **https://frontend-dotzun8kb-khoa99989s-projects.vercel.app** → đăng nhập **demo@fnb.com** / **password123** → xem Menu, Cart. Mọi thứ đã nối backend + database.

**Kiểm tra backend:** mở `https://fnb-backend-xxxx.onrender.com/health` (URL của bạn) → phải thấy `{"status":"ok",...}`.
