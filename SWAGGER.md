# Swagger API – MyProject

Tài liệu API (OpenAPI 3.0) và giao diện Swagger UI cho backend MyProject.

## Cách dùng

1. **Chạy backend** (từ thư mục project):
   ```bash
   cd backend && go run .
   ```

2. **Mở Swagger UI trên trình duyệt:**
   - **http://localhost:8080/swagger** hoặc **http://localhost:8080/swagger/**

3. **Lấy file OpenAPI (JSON):**
   - **http://localhost:8080/openapi.json**

## Các nhóm API

| Tag      | Mô tả                          |
|----------|---------------------------------|
| **Auth** | Đăng ký, đăng nhập, profile     |
| **Products** | Sản phẩm, danh mục, featured |
| **Cart** | Giỏ hàng (cần Bearer token)     |
| **System** | Health check                  |

## Gọi API cần đăng nhập (Cart, Profile)

1. Gọi **POST /api/login** với `email` và `password` để lấy `token`.
2. Trên Swagger UI: bấm **Authorize** → nhập `Bearer <token>` (hoặc chỉ `<token>` tùy phiên bản UI).
3. Gọi các endpoint **Cart** hoặc **GET /api/profile**.
