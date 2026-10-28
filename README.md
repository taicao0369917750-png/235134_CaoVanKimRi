# Hệ Thống Quản Lý Sách Trên Nền Tảng Đám Mây

- **Họ và tên:** Cao Văn Kim Rí
- **Mã số sinh viên:** 235134
- **Học phần:** Điện toán đám mây

---

## 1. Mô tả đề tài
Hệ thống quản lý sách Full-stack chạy trên đám mây, hỗ trợ các thao tác CRUD (Xem, Thêm, Sửa, Xóa, Tìm kiếm sách). Ứng dụng đóng gói bằng Docker và triển khai trực tuyến trên Render.

## 2. Công nghệ sử dụng
- **Frontend:** React (Vite), Axios, CSS
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB Atlas
- **DevOps & Cloud:** Git, GitHub, Docker, Docker Hub, Render

## 3. Cấu trúc dự án
```text
235134_CaoVanKimRi/
├── .gitignore
├── README.md
├── backend/
│   ├── .env
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    └── src/