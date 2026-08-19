# HƯỚNG DẪN ĐƯA "KHTH - THEO DÕI CÔNG VIỆC" LÊN MẠNG (CÓ LINK RIÊNG)

Làm theo đúng thứ tự các bước. Mỗi bước chỉ mất vài phút, tổng cộng khoảng 20-30 phút cho lần đầu. Không cần biết code.

Cần chuẩn bị: 1 tài khoản Google (Gmail bình thường là được), máy tính.

---

## BƯỚC 1: Tạo tài khoản GitHub (để lưu code)

1. Vào **https://github.com** → bấm **Sign up** → đăng ký bằng email
2. Sau khi đăng ký xong, bấm nút **+** ở góc trên phải → **New repository**
3. Đặt tên ví dụ: `khth-theo-doi-cong-viec` → chọn **Public** → bấm **Create repository**
4. Trên trang repository vừa tạo, bấm nút **Add file** → **Upload files**
5. Kéo thả **toàn bộ** các file và thư mục Claude đã gửi (giữ nguyên cấu trúc thư mục `src/`) vào khung tải lên
6. Bấm **Commit changes** ở cuối trang để lưu lại

---

## BƯỚC 2: Tạo cơ sở dữ liệu Firebase (để lưu công việc, mọi người cùng thấy)

1. Vào **https://console.firebase.google.com** → đăng nhập bằng tài khoản Google
2. Bấm **Add project** (Thêm dự án) → đặt tên ví dụ `khth-tasks` → bấm **Continue** vài lần → **Create project**
3. Sau khi tạo xong, ở trang chủ dự án, bấm biểu tượng **`</>`** (Web) để thêm ứng dụng web
4. Đặt tên app (bất kỳ, ví dụ `khth-web`) → bấm **Register app**
5. Firebase sẽ hiện ra một đoạn mã có dạng:
   ```
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "khth-tasks.firebaseapp.com",
     projectId: "khth-tasks",
     storageBucket: "khth-tasks.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```
   **Copy toàn bộ đoạn này lại** (hoặc chụp màn hình) — sẽ dùng ở Bước 3.
6. Ở menu bên trái Firebase, chọn **Build → Firestore Database** → bấm **Create database**
7. Chọn **Start in production mode** → bấm **Next** → chọn khu vực gần nhất (ví dụ `asia-southeast1`) → **Enable**
8. Vào tab **Rules** (Quy tắc) trong Firestore, xoá hết nội dung cũ, dán đoạn sau vào rồi bấm **Publish**:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /khth/{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
   *(Lưu ý: quy tắc này cho phép ai có link cũng đọc/ghi được dữ liệu — phù hợp với việc dùng nội bộ phòng, không cần đăng nhập phức tạp. Nếu sau này cần bảo mật chặt hơn, báo Claude để chỉnh lại.)*

---

## BƯỚC 3: Điền thông tin Firebase vào code

1. Quay lại GitHub, vào file `src/firebase.js` trong repository vừa tạo
2. Bấm biểu tượng cây bút (Edit) ở góc phải file
3. Thay các dòng `"DIEN_..._VAO_DAY"` bằng đúng giá trị Firebase đã copy ở Bước 2, ví dụ:
   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "khth-tasks.firebaseapp.com",
     projectId: "khth-tasks",
     storageBucket: "khth-tasks.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```
4. Bấm **Commit changes** để lưu

---

## BƯỚC 4: Đưa lên mạng bằng Vercel (miễn phí)

1. Vào **https://vercel.com** → bấm **Sign up** → chọn **Continue with GitHub** (đăng nhập bằng tài khoản GitHub vừa tạo)
2. Sau khi vào trang chủ Vercel, bấm **Add New → Project**
3. Tìm và chọn repository `khth-theo-doi-cong-viec` vừa tạo → bấm **Import**
4. Vercel sẽ tự nhận diện đây là dự án Vite/React — không cần chỉnh gì thêm, bấm **Deploy**
5. Đợi khoảng 1-2 phút, khi thấy dòng chữ **"Congratulations!"** là xong
6. Vercel sẽ cấp cho Thu 1 link dạng: `https://khth-theo-doi-cong-viec.vercel.app`
   → **Đây chính là link Thu gửi cho cả phòng dùng**, ai cũng vào được, không cần tài khoản Claude hay GitHub gì cả.

---

## SAU KHI HOÀN TẤT

- Mỗi khi Thu (hoặc Claude) sửa code và cập nhật lại trên GitHub, Vercel sẽ **tự động** build lại và cập nhật link — không cần làm lại từ đầu.
- Nếu sau này cần đổi mã PIN quản lý, thêm/sửa nhân sự, đổi màu... Thu cứ nhắn Claude, Claude sẽ đưa code mới, Thu chỉ cần upload đè lên GitHub (Bước 1.4-1.6) là link tự cập nhật.
- Nếu Thu có người IT hỗ trợ, có thể gửi trọn bộ file + hướng dẫn này để họ làm nhanh hơn.

## NẾU GẶP LỖI

Chụp màn hình lỗi gửi cho Claude, Claude sẽ hướng dẫn xử lý tiếp.
