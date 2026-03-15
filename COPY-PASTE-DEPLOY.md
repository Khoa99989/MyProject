# Chỉ cần copy/dán — Deploy backend + nối frontend

Đã mở sẵn tab Supabase. Làm lần lượt 3 ô dưới đây: **copy từ đâu** → **dán vào đâu**.

---

## 1. Supabase → lấy chuỗi kết nối

**Trang đang mở:** Supabase → Project → Settings → Database

- Kéo xuống tới **Connection string**.
- Chọn **URI**, mode **Session** → bấm **Copy**.
- Trong chuỗi vừa copy: tìm `[YOUR-PASSWORD]` → **thay bằng mật khẩu database** (nếu quên: cùng trang có **Reset database password**).
- **Chuỗi sau khi thay mật khẩu** = dùng cho bước 2 (Render).

---

## 2. Render → tạo backend

**Mở:** https://dashboard.render.com → đăng nhập GitHub → **New +** → **Web Service**

| Ô cần điền | Copy/Dán gì |
|------------|-------------|
| **Connect repository** | Chọn repo **khoa99989/MyProject** (hoặc tên repo bạn đã push) |
| **Root Directory** | Gõ: `backend` |
| **Build Command** | Gõ: `go build -o server .` |
| **Start Command** | Gõ: `./server` |
| **Environment — Key 1** | `DATABASE_URL` |
| **Environment — Value 1** | *(Dán chuỗi Supabase từ bước 1)* |
| **Environment — Key 2** | `ALLOWED_ORIGINS` |
| **Environment — Value 2** | `https://frontend-dotzun8kb-khoa99989s-projects.vercel.app` |

Sau đó bấm **Create Web Service** → đợi deploy xong → **copy URL** (vd: `https://fnb-backend-xxxx.onrender.com`).

---

## 3. Vercel → cho frontend gọi API

**Mở:** https://vercel.com/dashboard → chọn project **frontend** → **Settings** → **Environment Variables**

| Ô | Gì |
|---|-----|
| **Key** | `VITE_API_URL` |
| **Value** | `https://XXXXXXXX.onrender.com/api` ← **thay XXXXXXXX bằng URL Render từ bước 2** (vd: `https://fnb-backend-abc123.onrender.com/api`) |

Bấm **Save** → **Deployments** → bản mới nhất → **⋮** → **Redeploy**.

---

## Xong

Mở: https://frontend-dotzun8kb-khoa99989s-projects.vercel.app → đăng nhập **demo@fnb.com** / **password123**.
