# KHTH - Theo dõi công việc

Web app quản lý và giao việc cho Phòng Kế hoạch Tổng hợp — Bệnh viện Trường Đại học Y Dược Cần Thơ.

## Bắt đầu

Xem file **HUONG-DAN-DEPLOY.md** để đưa web này lên mạng, có link riêng dùng ngay — hướng dẫn từng bước, không cần biết code.

## Cấu trúc dự án

```
├── index.html              # Trang HTML gốc
├── package.json            # Danh sách thư viện cần thiết
├── vite.config.js          # Cấu hình công cụ build
├── src/
│   ├── main.jsx             # Điểm khởi chạy ứng dụng
│   ├── App.jsx               # Toàn bộ giao diện & logic (file chính)
│   ├── firebase.js           # Cấu hình kết nối lưu trữ dữ liệu — CẦN ĐIỀN THÔNG TIN
│   └── index.css             # CSS cơ bản
└── HUONG-DAN-DEPLOY.md      # Hướng dẫn đưa lên mạng, từng bước
```

## Tính năng

- Giao việc theo nhóm công việc (01–08, theo bảng phân công KHTH)
- 2 chế độ: Quản lý (PIN bảo vệ) và Nhân viên (chỉ xem/thao tác việc của mình)
- Nhân viên có thể tự thêm việc được giao miệng, Quản lý theo dõi được
- Tự động ghi thời điểm bắt đầu / hoàn thành thực tế
- Tự động lưu trữ việc hoàn thành quá 90 ngày
- Dữ liệu đồng bộ thời gian thực giữa mọi người dùng (qua Firebase)

## Đổi mã PIN quản lý

Mặc định mã PIN là `2026`. Để đổi, mở file `src/App.jsx`, tìm dòng:
```js
const ADMIN_PIN = '2026';
```
Đổi thành mã PIN Thu muốn, rồi lưu và tải lại lên GitHub (Vercel sẽ tự cập nhật).
