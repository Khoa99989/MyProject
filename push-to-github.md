# Push code lên GitHub

Remote đã được thêm: `origin` → `https://github.com/khoa99989/MyProject.git`

## Bước 1: Tạo repo trên GitHub

1. Mở **https://github.com/new**
2. **Repository name:** `MyProject` (hoặc tên bạn thích, ví dụ `fnb-app`)
3. Chọn **Private** hoặc **Public**
4. **Không** tick "Add a README file"
5. Bấm **Create repository**

## Bước 2: Nếu bạn đặt tên repo khác hoặc dùng username khác

Chạy (thay USER và REPO bằng đúng của bạn):

```bash
cd /Users/khoanguyen/Documents/MyProject
git remote set-url origin https://github.com/USER/REPO.git
```

## Bước 3: Push code

```bash
cd /Users/khoanguyen/Documents/MyProject
git push -u origin main
```

Nếu GitHub hỏi đăng nhập: dùng **Personal Access Token** thay cho mật khẩu (Settings → Developer settings → Personal access tokens).

---

Sau khi push xong, bạn có thể vào Render → Connect repository → chọn repo vừa push.
