import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Plus, X, ChevronDown, Search, Trash2, Pencil, Check, ListTodo, CircleDot, CheckCircle2, AlertCircle, ShieldCheck, User, LogOut, PlayCircle, Archive, ArchiveRestore, Bell, Table2, Calendar, Mail, ChevronLeft, ChevronRight, LayoutGrid, ClipboardList, ChevronRight as ChevronRightSmall, KeyRound } from 'lucide-react';
const HOSPITAL_LOGO_BASE64 = "data:image/jpeg;base64,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";

// ---------- Danh mục nhóm công việc gốc (theo Dự thảo phân công 1908) ----------
const NHOM_CV = [
  { ma: '01', ten: 'Quản lý chuyên môn' },
  { ma: '02', ten: 'Kế hoạch – Thống kê – Báo cáo' },
  { ma: '03', ten: 'Hồ sơ bệnh án – Y chứng – Ấn phẩm – Hành chính chuyên môn' },
  { ma: '04', ten: 'Quản lý khám chữa bệnh BHYT' },
  { ma: '05', ten: 'Đào tạo – Quản lý người học – Chuyển giao kỹ thuật' },
  { ma: '06', ten: 'Nghiên cứu khoa học – Thử nghiệm lâm sàng – Đạo đức nghiên cứu' },
  { ma: '07', ten: 'Hợp tác – Hội nghị – Hội thảo' },
  { ma: '08', ten: 'Chuyển đổi số – Các mô hình chuyên môn mới' },
];

// ---------- Danh mục 41 công việc cụ thể (theo Dự thảo phân công 1908) ----------
// Quản lý xem nội dung ở đây, bấm "Giao việc" để giao ngay cho nhân viên.
// ---------- Danh mục công việc P.KHTH — dữ liệu ban đầu (Quản lý có thể thêm/sửa trên hệ thống) ----------
const SEED_CATALOG = [
  { id: 'cat-1.1', ma: '1.1', nhom: '01', ten: 'Danh mục kỹ thuật', noiDung: 'Quản lý DMKT; cập nhật tên kỹ thuật theo quy định; tiếp nhận đăng ký kỹ thuật mới; lập hồ sơ đăng ký kỹ thuật mới; theo dõi cập nhật danh mục theo quy định hiện hành', phuTrach: 'ThS. Lê Huyền Trân', phoiHop: 'BS. Dương Thị Anh Thư, BSCKI. Lại Khôi Nguyên, CN. Nguyễn Ngọc Thơ' },
  { id: 'cat-1.2', ma: '1.2', nhom: '01', ten: 'Phác đồ điều trị', noiDung: 'Quản lý hệ thống phác đồ; tiếp nhận đề xuất; rà soát, cập nhật; tổ chức thông qua HĐKHKT; cập nhật định kỳ', phuTrach: 'BS. Dương Thị Anh Thư', phoiHop: 'ThS. Lê Huyền Trân, BSCKI. Kim Ngọc Khánh Vinh, BSCKI. Lại Khôi Nguyên' },
  { id: 'cat-1.3', ma: '1.3', nhom: '01', ten: 'Quy trình kỹ thuật', noiDung: 'Quản lý quy trình kỹ thuật; tiếp nhận đề xuất mới/sửa đổi; rà soát; trình HĐKHKT; cập nhật định kỳ', phuTrach: 'ThS. Lê Huyền Trân', phoiHop: 'BS. Dương Thị Anh Thư, BS. Nguyễn Minh Nhựt, CN. Nguyễn Ngọc Thơ' },
  { id: 'cat-1.4', ma: '1.4', nhom: '01', ten: 'Phẫu thuật – thủ thuật', noiDung: 'Quản lý danh mục; tiếp nhận đăng ký PTTT của bác sĩ; tổng hợp; tổ chức thông qua HĐKHKT; lưu hồ sơ', phuTrach: 'ThS. Lê Huyền Trân', phoiHop: 'BS. Dương Thị Anh Thư, BSCKI. Kim Ngọc Khánh Vinh' },
  { id: 'cat-1.5', ma: '1.5', nhom: '01', ten: 'Hồ sơ hành nghề chuyên môn', noiDung: 'Quản lý, theo dõi và lưu trữ chứng chỉ hành nghề/các chứng chỉ liên quan', phuTrach: 'ĐD.CKI. Nguyễn Thị Ngọc Bảo', phoiHop: 'ThS. Lê Huyền Trân' },
  { id: 'cat-1.6', ma: '1.6', nhom: '01', ten: 'Quản lý chất lượng thuộc phạm vi KHTH', noiDung: 'Theo dõi các tiêu chí được phân công; chỉ số chất lượng; phối hợp cải tiến; tổng hợp kết quả', phuTrach: 'BS. Nguyễn Minh Nhựt', phoiHop: 'ThS. Lê Huyền Trân, BS. Dương Thị Anh Thư, CN. Nguyễn Quách Ngọc Trâm' },
  { id: 'cat-1.7', ma: '1.7', nhom: '01', ten: 'Quy trình chuyên môn', noiDung: 'Xây dựng Quy trình chuyên môn; Kiểm tra thực hiện quy trình chuyên môn; kiểm tra đột xuất HSBA; tổng hợp tồn tại; đề xuất khắc phục; báo cáo', phuTrach: 'BS. Dương Thị Anh Thư', phoiHop: 'ThS. Lê Huyền Trân, ĐD.CKI. Nguyễn Thị Ngọc Bảo, CN. Trần Thị Huệ' },
  { id: 'cat-1.8', ma: '1.8', nhom: '01', ten: 'Xếp cấp chuyên môn', noiDung: 'Quản lý hồ sơ; rà soát điều kiện; theo dõi cập nhật; lưu hồ sơ', phuTrach: 'ThS. Lê Huyền Trân', phoiHop: 'BS. Dương Thị Anh Thư, CN. Nguyễn Ngọc Thơ' },
  { id: 'cat-1.9', ma: '1.9', nhom: '01', ten: 'Tiếp dân – phản ánh chuyên môn', noiDung: 'Tiếp nhận thông tin; rà soát nội dung và quy định; phối hợp xác minh; báo cáo lãnh đạo; theo dõi xử lý', phuTrach: 'BS. Dương Thị Anh Thư', phoiHop: 'BS. Nguyễn Minh Nhựt, ThS. Lê Huyền Trân' },
  { id: 'cat-1.10', ma: '1.10', nhom: '01', ten: 'KCB nhân đạo', noiDung: 'Lập kế hoạch; hồ sơ xin phép; tổ chức; báo cáo; lưu trữ', phuTrach: 'ThS. Nguyễn Quang Đạt', phoiHop: 'BSCKI. Kim Ngọc Khánh Vinh, BS. Dương Thị Anh Thư' },
  { id: 'cat-1.11', ma: '1.11', nhom: '01', ten: 'Khám sức khỏe – KSK lái xe', noiDung: 'Quản lý hồ sơ; theo dõi hoạt động; cập nhật dữ liệu theo quy định; báo cáo', phuTrach: 'CN. Nguyễn Ngọc Thơ', phoiHop: 'BSCKI. Lại Khôi Nguyên, BS. Dương Thị Anh Thư' },
  { id: 'cat-1.12', ma: '1.12', nhom: '01', ten: 'Hợp đồng gửi mẫu', noiDung: 'Tiếp nhận nhu cầu; xây dựng hợp đồng; theo dõi thực hiện; quản lý, lưu trữ hợp đồng', phuTrach: 'BS. Dương Thị Anh Thư', phoiHop: 'BSCKI. Kim Ngọc Khánh Vinh, ThS. Nguyễn Quang Đạt' },
  { id: 'cat-2.1', ma: '2.1', nhom: '02', ten: 'Kế hoạch hoạt động, Theo dõi thực hiện kế hoạch', noiDung: 'Kế hoạch năm; quý; tháng; kế hoạch theo đợt/chuyên đề; kế hoạch của Phòng; kế hoạch cấp Bệnh viện. Theo dõi tiến độ; nhắc việc; tổng hợp kết quả; báo cáo khó khăn/tồn tại', phuTrach: 'ĐD.CKI. Nguyễn Thị Ngọc Bảo', phoiHop: 'ThS. Nguyễn Quang Đạt, BS. Dương Thị Anh Thư' },
  { id: 'cat-2.2', ma: '2.2', nhom: '02', ten: 'Thống kê hoạt động bệnh viện, Báo cáo định kỳ', noiDung: 'Thu thập số liệu; kiểm tra; tổng hợp; phân tích; quản lý dữ liệu. Báo cáo tuần/tháng/quý/6 tháng/năm theo yêu cầu về Sở Y tế', phuTrach: 'ThS. Lê Huyền Trân', phoiHop: 'BS. Nguyễn Minh Nhựt' },
  { id: 'cat-2.3', ma: '2.3', nhom: '02', ten: 'Báo cáo bệnh truyền nhiễm – bệnh không lây', noiDung: 'Tổng hợp; kiểm tra; báo cáo; lưu trữ số liệu', phuTrach: 'BS. Nguyễn Minh Nhựt', phoiHop: 'CN. Nguyễn Ngọc Thơ' },
  { id: 'cat-3.1', ma: '3.1', nhom: '03', ten: 'Y chứng', noiDung: 'Tiếp nhận yêu cầu; lấy HSBA; liên hệ đơn vị chuyên môn; kiểm tra; trình ký; trả kết quả; lưu hồ sơ', phuTrach: 'ĐD.CKI. Nguyễn Thị Ngọc Bảo', phoiHop: 'CN. Trần Thị Huệ, CN. Nguyễn Ngọc Thơ' },
  { id: 'cat-3.2', ma: '3.2', nhom: '03', ten: 'Ấn phẩm', noiDung: 'Quản lý ấn phẩm; quản lý cấp phát;', phuTrach: 'ĐD.CKI. Nguyễn Thị Ngọc Bảo', phoiHop: 'CN. Nguyễn Ngọc Thơ' },
  { id: 'cat-3.3', ma: '3.3', nhom: '03', ten: 'Hồ sơ bệnh án giấy', noiDung: 'Tiếp nhận HSBA; kiểm tra; phân loại; lưu trữ; quản lý kho; khai thác HSBA; tổ chức hủy HSBA; lưu hồ sơ hủy', phuTrach: 'CN. Trần Thị Huệ', phoiHop: 'CN. Nguyễn Ngọc Thơ' },
  { id: 'cat-3.4', ma: '3.4', nhom: '03', ten: 'Văn thư – hành chính nội bộ Phòng', noiDung: 'Văn thư; Lịch trực', phuTrach: 'ĐD.CKI. Nguyễn Thị Ngọc Bảo', phoiHop: 'ThS. Nguyễn Quang Đạt' },
  { id: 'cat-3.5', ma: '3.5', nhom: '03', ten: 'KPI - Thi đua khen thưởng. Quản lý 5S phòng', noiDung: 'Quản lý KPI, Thi đua khen thưởng. Kiểm tra, đánh giá, quản lý 5S phòng.', phuTrach: 'BS. Dương Thị Anh Thư', phoiHop: 'ThS. Lê Huyền Trân, ĐD.CKI. Nguyễn Thị Ngọc Bảo, BS. Nguyễn Minh Nhựt' },
  { id: 'cat-3.6', ma: '3.6', nhom: '03', ten: 'Chấm công, VPP', noiDung: 'chấm công; lưu tài liệu chuyên môn; văn phòng phẩm; tài sản; phân loại viên chứC', phuTrach: 'CN. Nguyễn Ngọc Thơ', phoiHop: 'ThS. Nguyễn Quang Đạt' },
  { id: 'cat-4.1', ma: '4.1', nhom: '04', ten: 'Cập nhật biểu mâũ - Tập huấn - Văn bản pháp quy BHYT', noiDung: 'Theo dõi văn bản mới; cập nhật; phân tích ảnh hưởng; triển khai/tập huấn', phuTrach: 'BS. Dương Thị Anh Thư', phoiHop: 'ThS. Lê Huyền Trân, BS. Nguyễn Minh Nhựt' },
  { id: 'cat-4.2', ma: '4.2', nhom: '04', ten: 'Giám định – thẩm định – thanh tra BHYT', noiDung: 'Giám sát việc thực hiện quy định; phát hiện lỗi; hướng dẫn khắc phục. Lập kế hoạch tiếp đoàn; chuẩn bị hồ sơ; điều phối giải trình; tổng hợp nội dung; theo dõi khắc phục; lưu biên bản. Tổng hợp lỗi; phân loại; giao đơn vị giải trình; theo dõi kết quả; báo cáo lãnh đạo', phuTrach: 'ThS. Lê Huyền Trân', phoiHop: 'BS. Dương Thị Anh Thư, BS. Nguyễn Minh Nhựt, CN. Nguyễn Ngọc Thơ' },
  { id: 'cat-4.3', ma: '4.3', nhom: '04', ten: 'Hợp đồng KCB BHYT', noiDung: 'Chuẩn bị hồ sơ và phụ lục; cập nhật danh mục; quản lý hợp đồng; lưu trữ. Giám sát xuất toán giám định BHYT trực tuyến', phuTrach: 'ThS. Lê Huyền Trân', phoiHop: 'BS. Nguyễn Minh Nhựt, BSCKI. Lại Khôi Nguyên' },
  { id: 'cat-4.4', ma: '4.4', nhom: '04', ten: 'Dữ liệu KCB BHYT', noiDung: 'người hành nghề; tăng giảm người hành nghề; dữ liệu trên cổng giám định', phuTrach: 'ĐD.CKI. Nguyễn Thị Ngọc Bảo', phoiHop: 'ThS. Lê Huyền Trân, BSCKI. Lại Khôi Nguyên' },
  { id: 'cat-5.1', ma: '5.1', nhom: '05', ten: 'Đào tạo ngắn hạn, thực hành lâm sàng', noiDung: 'Xây dựng kế hoạch; chương trình; tổ chức lớp; tiếp nhận hồ sơ; hợp đồng; quản lý học viên; kiểm tra; báo cáo; lưu hồ sơ', phuTrach: 'CN. Nguyễn Quách Ngọc Trâm', phoiHop: 'BS. Dương Thị Anh Thư, ThS. Lê Huyền Trân, ThS. Nguyễn Quang Đạt' },
  { id: 'cat-5.2', ma: '5.2', nhom: '05', ten: 'Quản lý sinh viên/học viên của Trường', noiDung: 'Tiếp nhận; phân bổ; theo dõi; quản lý SV/HV Việt Nam; người học nước ngoài; quản lý hội trường;', phuTrach: 'CN. Nguyễn Quách Ngọc Trâm', phoiHop: 'ThS. Nguyễn Quang Đạt' },
  { id: 'cat-5.3', ma: '5.3', nhom: '05', ten: 'Tiếp nhận chuyển giao kỹ thuật', noiDung: 'Hồ sơ đăng ký; liên hệ đơn vị chuyển giao; xây dựng hợp đồng; tổ chức tiếp nhận; theo dõi; báo cáo; lưu trữ. Xây dựng hồ sơ; hợp đồng; triển khai; theo dõi; đánh giá; cấp chứng nhận; báo cáo', phuTrach: 'BS. Dương Thị Anh Thư', phoiHop: 'BSCKI. Lại Khôi Nguyên, BS. Nguyễn Minh Nhựt, CN. Nguyễn Ngọc Thơ' },
  { id: 'cat-5.4', ma: '5.4', nhom: '05', ten: 'Hợp tác chuyên môn y tế', noiDung: 'Tiếp nhận đề xuất; xây dựng hợp đồng nguyên tắc; theo dõi thời hạn; quản lý thực hiện; lưu trữ', phuTrach: 'BS. Dương Thị Anh Thư', phoiHop: 'BSCKI. Kim Ngọc Khánh Vinh, BS. Nguyễn Minh Nhựt, BSCKI. Lại Khôi Nguyên' },
  { id: 'cat-6.1', ma: '6.1', nhom: '06', ten: 'Nghiên cứu khoa học', noiDung: 'Kế hoạch NCKH; thông báo; tiếp nhận đề tài; hồ sơ lấy mẫu; hội đồng; xác nhận lấy mẫu; nghiệm thu; quản lý hồ sơ', phuTrach: 'CN. Nguyễn Quách Ngọc Trâm', phoiHop: 'ThS. Nguyễn Quang Đạt, BSCKI. Kim Ngọc Khánh Vinh, BSCKI. Lại Khôi Nguyên' },
  { id: 'cat-6.2', ma: '6.2', nhom: '06', ten: 'Thử nghiệm lâm sàng', noiDung: 'Hồ sơ gửi cơ quan quản lý; tiếp nhận hồ sơ; triển khai; theo dõi; báo cáo; lưu trữ', phuTrach: 'CN. Nguyễn Quách Ngọc Trâm', phoiHop: 'ThS. Nguyễn Quang Đạt' },
  { id: 'cat-6.3', ma: '6.3', nhom: '06', ten: 'Đạo đức trong nghiên cứu y sinh học', noiDung: 'Tiếp nhận; rà soát hồ sơ; chuẩn bị tài liệu Hội đồng; lịch họp; tổ chức họp; biên bản; văn thư; lưu trữ', phuTrach: 'CN. Nguyễn Quách Ngọc Trâm', phoiHop: 'ThS. Nguyễn Quang Đạt' },
  { id: 'cat-7.1', ma: '7.1', nhom: '07', ten: 'Hợp tác quốc tế', noiDung: 'Kế hoạch; hồ sơ pháp lý; đoàn vào; đoàn ra; tổ chức hoạt động; hợp đồng hợp tác; báo cáo; lưu trữ', phuTrach: 'ThS. Nguyễn Quang Đạt', phoiHop: 'BSCKI. Kim Ngọc Khánh Vinh' },
  { id: 'cat-7.2', ma: '7.2', nhom: '07', ten: 'Hội nghị – hội thảo khoa học. Sinh hoạt chuyên môn. Bình bệnh án', noiDung: 'Tiếp nhận đề xuất; lập kế hoạch; hồ sơ pháp lý; tổ chức; điều phối; báo cáo; lưu trữ', phuTrach: 'BS. Dương Thị Anh Thư', phoiHop: 'ThS. Nguyễn Quang Đạt, CN. Nguyễn Quách Ngọc Trâm, BSCKI. Kim Ngọc Khánh Vinh' },
  { id: 'cat-8.1', ma: '8.1', nhom: '08', ten: 'Hồ sơ bệnh án điện tử – EMR', noiDung: 'Xây dựng quy trình; biểu mẫu; triển khai; theo dõi; kiểm tra; rà soát; tổng hợp lỗi; báo cáo; lưu trữ', phuTrach: 'BS. Dương Thị Anh Thư', phoiHop: 'ThS. Lê Huyền Trân, CN. Trần Thị Huệ, BSCKI. Lại Khôi Nguyên' },
  { id: 'cat-8.2', ma: '8.2', nhom: '08', ten: 'Khám chữa bệnh từ xa, ERAS (nếu có), Mô hình/chương trình chuyên môn mới', noiDung: 'Lập kế hoạch; tổ chức; theo dõi; báo cáo; lưu hồ sơ', phuTrach: 'BS. Dương Thị Anh Thư', phoiHop: 'BS. Nguyễn Minh Nhựt, ThS. Nguyễn Quang Đạt' },
];

const MUC_UU_TIEN = ['Cao', 'Trung bình', 'Thấp'];
const TRANG_THAI = ['Chưa bắt đầu', 'Đang xử lý', 'Đã hoàn thành'];
const ARCHIVE_DAYS = 90;

// ---------- Bảng màu — xanh dương & đỏ đô, lấy cảm hứng từ huy hiệu bệnh viện ----------
const NAVY = '#1B3A6B';
const NAVY_DEEP = '#122548';
const SKY = '#2C6FB0';
const SKY_DEEP = '#1F5A93';
const GOLD = '#F0B429';
const RED = '#A32638';
const BG = '#F6F5F1';

const COLOR_UUTIEN = { 'Cao': '#A32638', 'Trung bình': '#C89B3C', 'Thấp': '#9AA5B1' };
const COLOR_TRANGTHAI = { 'Đã hoàn thành': '#1E7A5C', 'Đang xử lý': '#1B6FA8', 'Chưa bắt đầu': '#D7D2C4' };

const ADMIN_PIN = '2026';

// Mỗi nhân viên có 1 mã PIN riêng (4 số) để đăng nhập đúng tên mình,
// và 1 email để nhận nhắc việc qua thư điện tử.
// Thu điền lại email thật của từng người vào đây (hiện đang là email giả để demo).
const NHAN_SU = [
  { name: 'ThS. Lê Thanh Tâm', pin: '1111', email: 'lttam.bv@ctump.edu.vn' },
  { name: 'ThS. Võ Tấn Cường', pin: '2222', email: 'vtcuong.bv@ctump.edu.vn' },
  { name: 'BS. Dương Thị Anh Thư', pin: '3333', email: 'dtathu.bv@ctump.edu.vn' },
  { name: 'ThS. Lê Huyền Trân', pin: '4444', email: 'lhtran.bv@ctump.edu.vn' },
  { name: 'ĐD.CKI. Nguyễn Thị Ngọc Bảo', pin: '5555', email: 'ntnbao.bv@ctump.edu.vn' },
  { name: 'BS. Nguyễn Minh Nhựt', pin: '6666', email: 'nmnhut.bv@ctump.edu.vn' },
  { name: 'CN. Nguyễn Ngọc Thơ', pin: '7777', email: 'nntho.bv@ctump.edu.vn' },
  { name: 'CN. Trần Thị Huệ', pin: '8888', email: 'tthue.bv@ctump.edu.vn' },
  { name: 'BSCKI. Kim Ngọc Khánh Vinh', pin: '9999', email: 'knkvinh.bv@ctump.edu.vn' },
  { name: 'BSCKI. Lại Khôi Nguyên', pin: '1212', email: 'lknguyen.bv@ctump.edu.vn' },
  { name: 'ThS. Nguyễn Quang Đạt', pin: '3434', email: 'nqdat.bv@ctump.edu.vn' },
  { name: 'CN. Nguyễn Quách Ngọc Trâm', pin: '5656', email: 'nqntram.bv@ctump.edu.vn' },
];
const NHAN_SU_NAMES = NHAN_SU.map(n => n.name);

const SEED_TASKS = [];

function uid() { return 'id' + Math.random().toString(36).slice(2, 10); }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function nowISO() { return new Date().toISOString().slice(0, 16); }

function daysLeft(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0,0,0,0);
  return Math.round((d - now) / 86400000);
}
function daysSince(iso) {
  if (!iso) return 0;
  const d = new Date(iso);
  const now = new Date();
  return Math.floor((now - d) / 86400000);
}
function fmtDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const hh = String(d.getHours()).padStart(2,'0');
  const mi = String(d.getMinutes()).padStart(2,'0');
  return `${hh}:${mi} ${dd}/${mm}`;
}

// Ghi nhớ lần cuối mỗi nhân viên xem thông báo (lưu theo trình duyệt/thiết bị đang dùng)
function getLastSeen(staffName) {
  try { return localStorage.getItem('khth:lastSeen:' + staffName) || null; }
  catch (e) { return null; }
}
function setLastSeen(staffName, iso) {
  try { localStorage.setItem('khth:lastSeen:' + staffName, iso); }
  catch (e) { /* ignore */ }
}

// (imports thay thế bằng window.storage bên dưới)

// Lưu & đồng bộ dữ liệu qua Firebase Firestore (thay cho window.storage của Claude)
// Mọi người mở cùng link sẽ thấy dữ liệu cập nhật theo thời gian thực.
async function saveTasks(tasks) {
  try { await window.storage.set('khth:tasks', JSON.stringify(tasks), true); }
  catch (e) { console.error('save failed', e); }
}

// Lưu toàn bộ Danh mục công việc P.KHTH (Quản lý có thể thêm mới / sửa nội dung / sửa người phụ trách)
async function saveCatalog(list) {
  try { await window.storage.set('khth:catalog', JSON.stringify(list), true); }
  catch (e) { console.error('save failed', e); }
}

// Lưu mã PIN nhân viên tự đổi (ghi đè PIN mặc định trong NHAN_SU)
async function loadStaffPinsOnce() {
  try {
    const res = await window.storage.get('khth:staffPins', true);
    if (res && res.value) return JSON.parse(res.value);
  } catch (e) { /* not found */ }
  return {};
}
async function saveStaffPin(name, pin) {
  try {
    const current = await loadStaffPinsOnce();
    await window.storage.set('khth:staffPins', JSON.stringify({ ...current, [name]: pin }), true);
    return true;
  } catch (e) {
    console.error('save pin failed', e);
    return false;
  }
}

// Gửi email nhắc việc qua EmailJS. Trả về true/false để báo thành công/thất bại.
async function sendReminderEmail(task) {
  return { ok: false, reason: 'Tính năng này chỉ hoạt động trên bản web đã deploy (Vercel), không dùng được trong bản xem trước Claude.' };
}

// Email của Quản lý — nhận thông báo khi có đề xuất "Chờ giao việc" mới
const ADMIN_NOTIFY_EMAIL = 'ltvu@ctump.edu.vn';

async function sendPendingNotificationEmail(task) {
  return { ok: false };
}


export default function App() {
  const [tasks, setTasks] = useState(null);
  const [role, setRole] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [filterNhom, setFilterNhom] = useState('all');
  const [filterPhuTrach, setFilterPhuTrach] = useState('all');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [showArchive, setShowArchive] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAdminPendingAlert, setShowAdminPendingAlert] = useState(false);
  const [viewMode, setViewMode] = useState('board'); // 'board' | 'table' | 'calendar'
  const [calendarMonth, setCalendarMonth] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [selectedDay, setSelectedDay] = useState(null);
  const [emailSending, setEmailSending] = useState(null); // id của task đang gửi email
  const [catalogPrefill, setCatalogPrefill] = useState(null); // điền sẵn khi giao việc từ danh mục
  const [formDeXuat, setFormDeXuat] = useState(false); // true = nhân viên đang mở form "Chờ giao việc"
  const [catalog, setCatalog] = useState(null); // Danh mục công việc P.KHTH — Quản lý thêm/sửa được
  const [staffPins, setStaffPins] = useState({}); // PIN nhân viên đã tự đổi (ghi đè mặc định)
  const [showChangePin, setShowChangePin] = useState(false);
  const [staffShowCatalog, setStaffShowCatalog] = useState(false); // nhân viên xem Danh mục công việc (chỉ đọc)
  const [autoShown, setAutoShown] = useState(false);

  useEffect(() => {
    (async () => {
      const loaded = await loadTasks();
      if (loaded) setTasks(loaded);
      else { setTasks(SEED_TASKS); saveTasks(SEED_TASKS); }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await window.storage.get('khth:catalog', true).catch(()=>null);
      const loaded = res && res.value ? JSON.parse(res.value) : null;
      if (loaded) setCatalog(loaded);
      else { setCatalog(SEED_CATALOG); saveCatalog(SEED_CATALOG); }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const loaded = await loadStaffPinsOnce();
      setStaffPins(loaded);
    })();
  }, []);

  const upsertCatalogItem = (item) => {
    if (!catalog) return;
    let next;
    if (item.id && catalog.some(c => c.id === item.id)) {
      next = catalog.map(c => c.id === item.id ? { ...c, ...item } : c);
      showToast('Đã cập nhật nội dung công việc');
    } else {
      next = [...catalog, { ...item, id: 'cat-' + uid() }];
      showToast('Đã thêm nội dung công việc mới');
    }
    setCatalog(next);
    saveCatalog(next);
  };

  const deleteCatalogItem = (id) => {
    if (!catalog) return;
    setCatalog(prev => {
      const next = prev.filter(c => c.id !== id);
      saveCatalog(next);
      return next;
    });
    showToast('Đã xoá nội dung công việc');
  };

  const handleChangePin = async (currentPin, newPin) => {
    const effective = staffPins[staffName] || NHAN_SU.find(n => n.name === staffName)?.pin;
    if (currentPin !== effective) return { ok: false, reason: 'Mã PIN hiện tại không đúng' };
    if (!/^\d{4,6}$/.test(newPin)) return { ok: false, reason: 'Mã PIN mới phải là 4-6 chữ số' };
    const success = await saveStaffPin(staffName, newPin);
    if (success) {
      setStaffPins(prev => ({ ...prev, [staffName]: newPin }));
      return { ok: true };
    }
    return { ok: false, reason: 'Lưu thất bại, thử lại sau' };
  };

  const persist = useCallback((next) => { setTasks(next); saveTasks(next); }, []);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const isAdmin = role === 'admin';
  const staffName = role && role.type === 'staff' ? role.name : null;

  const upsertTask = (task) => {
    if (!tasks) return;
    let next;
    if (editingId) {
      const original = tasks.find(t => t.id === editingId);
      const wasPending = original?.choGiaoViec;
      const merged = wasPending
        ? { ...original, ...task, choGiaoViec: false, taoBoi: 'admin' }
        : { ...original, ...task };
      next = tasks.map(t => t.id === editingId ? merged : t);
      showToast(wasPending ? 'Đã giao việc' : 'Đã cập nhật công việc');
      if (wasPending && isAdmin) {
        sendReminderEmail(merged).then(result => {
          if (result.ok) showToast(`Đã gửi email báo việc mới tới ${merged.phuTrach}`);
        });
      }
    } else {
      const taoBoi = isAdmin ? 'admin' : staffName;
      const newTask = { ...task, id: uid(), batDauLuc: null, hoanThanhLuc: null, taoBoi, createdAt: nowISO() };
      next = [...tasks, newTask];
      showToast(isAdmin ? 'Đã giao việc mới' : (task.choGiaoViec ? 'Đã gửi đề xuất, chờ Quản lý giao việc' : 'Đã thêm việc'));
      // Tự động gửi email nhắc việc ngay khi Quản lý giao việc mới cho nhân viên
      if (isAdmin) {
        sendReminderEmail(newTask).then(result => {
          if (result.ok) showToast(`Đã gửi email báo việc mới tới ${newTask.phuTrach}`);
        });
      }
      // Tự động gửi email báo cho Quản lý khi nhân viên gửi đề xuất "Chờ giao việc"
      if (!isAdmin && newTask.choGiaoViec) {
        sendPendingNotificationEmail(newTask);
      }
    }
    persist(next);
    setShowForm(false);
    setEditingId(null);
  };

  const deleteTask = (id) => {
    if (!tasks) return;
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    if (!isAdmin && t.taoBoi !== staffName) return;
    persist(tasks.filter(t => t.id !== id));
    showToast('Đã xoá công việc');
  };

  const setStatus = (id, trangThai) => {
    if (!tasks) return;
    const now = nowISO();
    persist(tasks.map(t => {
      if (t.id !== id) return t;
      const patch = { trangThai };
      if (trangThai === 'Đang xử lý' && !t.batDauLuc) patch.batDauLuc = now;
      if (trangThai === 'Đã hoàn thành') patch.hoanThanhLuc = now;
      if (trangThai === 'Chưa bắt đầu') { patch.batDauLuc = null; patch.hoanThanhLuc = null; }
      return { ...t, ...patch };
    }));
    showToast(trangThai === 'Đang xử lý' ? 'Đã bắt đầu công việc' : trangThai === 'Đã hoàn thành' ? 'Đã hoàn thành công việc' : 'Đã cập nhật trạng thái');
  };

  const handleSendReminder = async (task) => {
    setEmailSending(task.id);
    const result = await sendReminderEmail(task);
    setEmailSending(null);
    showToast(result.ok ? `Đã gửi nhắc việc qua email tới ${task.phuTrach}` : result.reason);
  };

  const phuTrachList = useMemo(() => {
    if (!tasks) return NHAN_SU_NAMES;
    const fromTasks = tasks.map(t => t.phuTrach).filter(Boolean);
    return [...new Set([...NHAN_SU_NAMES, ...fromTasks])];
  }, [tasks]);

  // Tách việc đang hoạt động và việc đã lưu trữ (hoàn thành > 90 ngày)
  const { activeTasks, archivedTasks } = useMemo(() => {
    if (!tasks) return { activeTasks: [], archivedTasks: [] };
    const active = [], archived = [];
    for (const t of tasks) {
      const isOld = t.trangThai === 'Đã hoàn thành' && t.hoanThanhLuc && daysSince(t.hoanThanhLuc) >= ARCHIVE_DAYS;
      if (isOld) archived.push(t); else active.push(t);
    }
    return { activeTasks: active, archivedTasks: archived };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    const pool = showArchive ? archivedTasks : activeTasks;
    if (staffName) return pool.filter(t => t.phuTrach === staffName);
    // Quản lý không thấy việc "riêng tư" hoặc việc đang "Chờ giao việc" (xem ở mục riêng) trong các bảng thông thường
    return pool.filter(t => !t.riengTu && !t.choGiaoViec);
  }, [activeTasks, archivedTasks, staffName, showArchive]);

  const filtered = useMemo(() => {
    return visibleTasks.filter(t => {
      if (filterNhom !== 'all' && t.nhom !== filterNhom) return false;
      if (!staffName && filterPhuTrach !== 'all' && t.phuTrach !== filterPhuTrach) return false;
      if (!staffName && filterFrom && t.hanHoanThanh < filterFrom) return false;
      if (!staffName && filterTo && t.hanHoanThanh > filterTo) return false;
      if (search && !t.ten.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [visibleTasks, filterNhom, filterPhuTrach, filterFrom, filterTo, search, staffName]);

  const stats = useMemo(() => {
    const byPriority = MUC_UU_TIEN.map(p => ({ name: p, value: filtered.filter(t => t.uuTien === p).length }));
    const byStatus = TRANG_THAI.map(s => ({ name: s, value: filtered.filter(t => t.trangThai === s).length }));
    const total = filtered.length;
    const overdue = filtered.filter(t => t.trangThai !== 'Đã hoàn thành' && daysLeft(t.hanHoanThanh) < 0).length;
    return { byPriority, byStatus, total, overdue };
  }, [filtered]);

  // Thông báo cho nhân viên: việc mới được giao (kể từ lần xem gần nhất) + việc sắp/đã tới hạn
  const notifications = useMemo(() => {
    if (!staffName || !tasks) return { newTasks: [], dueTasks: [] };
    const lastSeen = getLastSeen(staffName);
    const mine = tasks.filter(t => t.phuTrach === staffName);
    const newTasks = lastSeen
      ? mine.filter(t => t.taoBoi === 'admin' && t.createdAt && t.createdAt > lastSeen)
      : [];
    const dueTasks = mine.filter(t => t.trangThai !== 'Đã hoàn thành' && daysLeft(t.hanHoanThanh) <= 1);
    return { newTasks, dueTasks };
  }, [tasks, staffName]);

  const notificationCount = notifications.newTasks.length + notifications.dueTasks.length;

  // Thông báo cho Quản lý: đề xuất "Chờ giao việc" mới kể từ lần đăng nhập gần nhất
  const adminPendingNotifications = useMemo(() => {
    if (!isAdmin || !tasks) return [];
    const lastSeen = getLastSeen('admin');
    const pending = tasks.filter(t => t.choGiaoViec);
    return lastSeen ? pending.filter(t => t.createdAt && t.createdAt > lastSeen) : [];
  }, [tasks, isAdmin]);

  useEffect(() => {
    if (staffName) {
      // Đánh dấu đã xem tại thời điểm đăng nhập lần này (áp dụng cho lần thông báo tiếp theo)
      const lastSeen = getLastSeen(staffName);
      if (!lastSeen) setLastSeen(staffName, nowISO());
    } else if (isAdmin) {
      const lastSeen = getLastSeen('admin');
      if (!lastSeen) setLastSeen('admin', nowISO());
    } else {
      setAutoShown(false);
    }
  }, [staffName, isAdmin]);

  // Tự động bật cảnh báo giữa màn hình ngay khi nhân viên đăng nhập, nếu có thông báo
  useEffect(() => {
    if (staffName && tasks && !autoShown) {
      setAutoShown(true);
      if (notificationCount > 0) setShowNotifications(true);
    }
  }, [staffName, tasks, autoShown, notificationCount]);

  // Tự động bật cảnh báo cho Quản lý nếu có đề xuất "Chờ giao việc" mới
  useEffect(() => {
    if (isAdmin && tasks && !autoShown) {
      setAutoShown(true);
      if (adminPendingNotifications.length > 0) setShowAdminPendingAlert(true);
    }
  }, [isAdmin, tasks, autoShown, adminPendingNotifications]);

  const maxBar = Math.max(1, ...stats.byPriority.map(p => p.value));

  if (!tasks) {
    return (
      <div style={{minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:BG, fontFamily:'Georgia, serif', color:SKY_DEEP, gap:10}}>
        <span>Đang tải dữ liệu…</span>
      </div>
    );
  }

  if (!role) {
    return <RoleGate onAdmin={() => setShowLogin(true)} onStaff={(name) => setRole({ type: 'staff', name })}
      staffList={phuTrachList} showLogin={showLogin} onCancelLogin={() => setShowLogin(false)}
      staffPins={staffPins}
      onAdminLogin={() => { setRole('admin'); setShowLogin(false); }} />;
  }

  return (
    <div style={{minHeight:'100vh', background:BG, fontFamily:"'Inter', -apple-system, sans-serif", color:'#20242B', paddingBottom: 60}}>
      <style>{`
        * { box-sizing: border-box; }
        .card { background:#fff; border:1px solid #E7E3D8; border-radius:14px; }
        .btn { cursor:pointer; border:none; font-family:inherit; transition:all .15s ease; }
        .btn:active { transform: scale(0.97); }
        select, input, textarea { font-family:inherit; }
        ::-webkit-scrollbar { height:6px; width:6px; }
        ::-webkit-scrollbar-thumb { background:#D7D2C4; border-radius:4px; }
        @keyframes slideUp { from { opacity:0; transform:translateY(12px);} to {opacity:1; transform:translateY(0);} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .khth-sidebar { width:176px; }
        .khth-sidebar-label { display:inline; }
        @media (max-width: 620px) {
          .khth-sidebar { width:52px; }
          .khth-sidebar-label { display:none; }
          .khth-sidebar-btn { justify-content:center !important; padding:10px 6px !important; }
        }
        @media (max-width: 720px) {
          .khth-calendar-wrap { flex-direction:column !important; }
          .khth-calendar-left { width:100% !important; max-width:400px; margin:0 auto; }
        }
      `}</style>

      {/* Header */}
      <div style={{background:`linear-gradient(135deg, ${SKY} 0%, ${SKY_DEEP} 100%)`, padding:'20px 18px 22px', position:'sticky', top:0, zIndex:10, boxShadow:'0 2px 12px rgba(31,90,147,0.18)'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, maxWidth:920, margin:'0 auto'}}>
          <div style={{minWidth:0}}>
            <div style={{fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'#fff', fontWeight:700}}>Bệnh viện Trường Đại học Y Dược Cần Thơ</div>
            <div style={{fontSize:10.5, color:'rgba(255,255,255,0.8)', marginTop:1}}>Phòng Kế hoạch Tổng hợp</div>
            <h1 style={{margin:'3px 0 0', fontSize:17, fontWeight:800, fontFamily:'Georgia, serif', color:'#fff', letterSpacing:'0.01em', textTransform:'uppercase'}}>Bộ công cụ theo dõi công việc</h1>
          </div>
        </div>

        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, maxWidth:920, margin:'14px auto 0'}}>
          <div style={{display:'flex', alignItems:'center', gap:6, fontSize:11.5, color:'rgba(255,255,255,0.85)', fontWeight:600, background:'rgba(255,255,255,0.1)', padding:'5px 11px', borderRadius:20}}>
            {isAdmin ? <ShieldCheck size={13}/> : <User size={13}/>}
            {isAdmin ? 'Chế độ Quản lý' : staffName}
          </div>
          <div style={{display:'flex', gap:8}}>
            {isAdmin && (
              <button className="btn" onClick={() => { setEditingId(null); setFormDeXuat(false); setShowForm(true); }}
                style={{display:'flex', alignItems:'center', gap:6, background:GOLD, color:NAVY_DEEP, padding:'9px 14px', borderRadius:9, fontWeight:700, fontSize:13}}>
                <Plus size={15}/> Giao việc
              </button>
            )}
            {staffName && (
              <>
                <button className="btn" onClick={() => { setEditingId(null); setFormDeXuat(false); setShowForm(true); }}
                  style={{display:'flex', alignItems:'center', gap:6, background:GOLD, color:NAVY_DEEP, padding:'9px 12px', borderRadius:9, fontWeight:700, fontSize:12.5}}>
                  <Plus size={14}/> Thêm việc
                </button>
                <button className="btn" onClick={() => { setEditingId(null); setFormDeXuat(true); setShowForm(true); }}
                  style={{display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.15)', color:'#fff', padding:'9px 12px', borderRadius:9, fontWeight:700, fontSize:12.5, border:'1px solid rgba(255,255,255,0.3)'}}>
                  <AlertCircle size={14}/> Chờ giao việc
                </button>
              </>
            )}
            {isAdmin && tasks.length > 0 && (
              <button className="btn" onClick={() => {
                  if (window.confirm(`Xoá toàn bộ ${tasks.length} công việc hiện có? Hành động này không thể hoàn tác.`)) {
                    persist([]);
                    showToast('Đã xoá toàn bộ dữ liệu');
                  }
                }} title="Xoá toàn bộ dữ liệu"
                style={{background:'rgba(255,255,255,0.12)', color:'#fff', width:34, height:34, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                <Trash2 size={15}/>
              </button>
            )}
            {isAdmin && (
              <button className="btn" onClick={() => { setLastSeen('admin', nowISO()); setViewMode('pending'); setShowArchive(false); }} title="Đề xuất chờ giao việc"
                style={{position:'relative', background:'rgba(255,255,255,0.12)', color:'#fff', width:34, height:34, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                <Bell size={15}/>
                {tasks.filter(t=>t.choGiaoViec).length > 0 && (
                  <span style={{position:'absolute', top:-4, right:-4, background:RED, color:'#fff', fontSize:9.5, fontWeight:700, minWidth:16, height:16, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 3px', border:'2px solid ' + SKY_DEEP}}>
                    {tasks.filter(t=>t.choGiaoViec).length}
                  </span>
                )}
              </button>
            )}
            {staffName && (
              <button className="btn" onClick={() => setShowNotifications(true)} title="Thông báo"
                style={{position:'relative', background:'rgba(255,255,255,0.12)', color:'#fff', width:34, height:34, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                <Bell size={15}/>
                {notificationCount > 0 && (
                  <span style={{position:'absolute', top:-4, right:-4, background:RED, color:'#fff', fontSize:9.5, fontWeight:700, minWidth:16, height:16, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 3px', border:'2px solid ' + SKY_DEEP}}>
                    {notificationCount}
                  </span>
                )}
              </button>
            )}
            {staffName && (
              <button className="btn" onClick={() => setShowChangePin(true)} title="Đổi mã PIN"
                style={{background:'rgba(255,255,255,0.12)', color:'#fff', width:34, height:34, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                <KeyRound size={15}/>
              </button>
            )}
            <button className="btn" onClick={() => setRole(null)} title="Đổi chế độ"
              style={{background:'rgba(255,255,255,0.12)', color:'#fff', width:34, height:34, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
              <LogOut size={15}/>
            </button>
          </div>
        </div>
      </div>

      <div style={{padding:'18px 16px', maxWidth: isAdmin ? 1080 : 920, margin:'0 auto', display:'flex', gap:16, alignItems:'flex-start'}}>

        {isAdmin && (
          <AdminSidebar
            current={showArchive ? 'archive' : viewMode}
            archiveCount={archivedTasks.length}
            pendingCount={tasks.filter(t => t.choGiaoViec).length}
            onSelect={(key) => {
              if (key === 'archive') { setShowArchive(true); }
              else { setShowArchive(false); setViewMode(key); }
            }}
          />
        )}

        <div style={{flex:1, minWidth:0}}>

        {/* Tabs: Đang hoạt động / Lưu trữ / DM công việc P.KHTH — chỉ hiện cho nhân viên, Quản lý dùng thanh dọc bên trái */}
        {!isAdmin && (
          <div style={{display:'flex', gap:6, marginBottom:16, background:'#EEEAE0', padding:4, borderRadius:11, width:'fit-content', flexWrap:'wrap'}}>
            <button className="btn" onClick={()=>{setShowArchive(false); setStaffShowCatalog(false);}}
              style={{display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:8, fontSize:12.5, fontWeight:700,
                background: (!showArchive && !staffShowCatalog) ? '#fff' : 'transparent', color: (!showArchive && !staffShowCatalog) ? NAVY : '#8a8072', boxShadow: (!showArchive && !staffShowCatalog) ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'}}>
              <ListTodo size={14}/> Đang hoạt động
            </button>
            <button className="btn" onClick={()=>{setShowArchive(true); setStaffShowCatalog(false);}}
              style={{display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:8, fontSize:12.5, fontWeight:700,
                background: showArchive ? '#fff' : 'transparent', color: showArchive ? NAVY : '#8a8072', boxShadow: showArchive ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'}}>
              <Archive size={14}/> Lưu trữ ({archivedTasks.filter(t=>!staffName || t.phuTrach===staffName).length})
            </button>
            <button className="btn" onClick={()=>setStaffShowCatalog(true)}
              style={{display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:8, fontSize:12.5, fontWeight:700,
                background: staffShowCatalog ? '#fff' : 'transparent', color: staffShowCatalog ? NAVY : '#8a8072', boxShadow: staffShowCatalog ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'}}>
              <ClipboardList size={14}/> DM công việc P.KHTH
            </button>
          </div>
        )}

        {!isAdmin && staffShowCatalog ? (
          <CatalogView catalog={catalog} isAdmin={false}/>
        ) : (
        <>
        {showArchive && (
          <div style={{background:'#EEF3F0', color:'#1E7A5C', fontSize:12, padding:'9px 12px', borderRadius:9, marginBottom:16, lineHeight:1.4}}>
            Việc đã hoàn thành hơn {ARCHIVE_DAYS} ngày được tự động chuyển vào đây để bảng chính gọn hơn. Dữ liệu vẫn được giữ đầy đủ.
          </div>
        )}

        {/* Summary strip */}
        <div style={{display:'flex', gap:10, marginBottom:16, overflowX:'auto'}}>
          <StatChip icon={<ListTodo size={15}/>} label="Tổng việc" value={stats.total} color={NAVY}/>
          <StatChip icon={<CircleDot size={15}/>} label="Đang xử lý" value={stats.byStatus[1].value} color="#1B6FA8"/>
          <StatChip icon={<CheckCircle2 size={15}/>} label="Hoàn thành" value={stats.byStatus[2].value} color="#1E7A5C"/>
          <StatChip icon={<AlertCircle size={15}/>} label="Trễ hạn" value={stats.overdue} color={RED}/>
        </div>

        {/* Filters */}
        <div style={{display:'flex', gap:8, marginBottom:16, flexWrap:'wrap'}}>
          <div style={{position:'relative', flex:'1 1 160px'}}>
            <Search size={15} style={{position:'absolute', left:10, top:10, color:'#A89B85'}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm việc..."
              style={{width:'100%', padding:'8px 10px 8px 32px', borderRadius:9, border:'1px solid #E3DACB', fontSize:13.5, background:'#fff'}}/>
          </div>
          <SelectBox value={filterNhom} onChange={setFilterNhom} options={[{ma:'all', ten:'Tất cả nhóm'}, ...NHOM_CV]} getLabel={o=>o.ma==='all'?o.ten:`${o.ma} · ${o.ten}`} getValue={o=>o.ma} minWidth={140}/>
          {!staffName && (
            <SelectBox value={filterPhuTrach} onChange={setFilterPhuTrach} options={[{v:'all', l:'Tất cả người phụ trách'}, ...phuTrachList.map(p=>({v:p,l:p}))]} getLabel={o=>o.l} getValue={o=>o.v} minWidth={140}/>
          )}
        </div>

        {!staffName && (
          <div style={{display:'flex', gap:8, marginBottom:16, flexWrap:'wrap', alignItems:'center'}}>
            <span style={{fontSize:12, color:'#8a8072', fontWeight:600, flexShrink:0}}>Khoảng thời gian:</span>
            <input type="date" value={filterFrom} onChange={e=>setFilterFrom(e.target.value)}
              style={{padding:'7px 10px', borderRadius:9, border:'1px solid #E3DACB', fontSize:12.5, background:'#fff'}}/>
            <span style={{fontSize:12, color:'#A89B85'}}>đến</span>
            <input type="date" value={filterTo} onChange={e=>setFilterTo(e.target.value)}
              style={{padding:'7px 10px', borderRadius:9, border:'1px solid #E3DACB', fontSize:12.5, background:'#fff'}}/>
            {(filterFrom || filterTo) && (
              <button className="btn" onClick={()=>{setFilterFrom(''); setFilterTo('');}}
                style={{fontSize:11.5, color:RED, background:'transparent', padding:'4px 8px'}}>Xoá lọc</button>
            )}
          </div>
        )}

        {/* Charts */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16}}>
          <div className="card" style={{padding:14}}>
            <div style={{fontSize:11.5, fontWeight:700, color:'#6b6258', marginBottom:12, letterSpacing:'0.04em'}}>SỐ VIỆC THEO ƯU TIÊN</div>
            <div style={{display:'flex', alignItems:'flex-end', gap:10, height:100}}>
              {stats.byPriority.map(p => (
                <div key={p.name} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6}}>
                  <div style={{fontSize:13, fontWeight:700}}>{p.value}</div>
                  <div style={{width:'100%', maxWidth:34, height: Math.max(4, (p.value/maxBar)*66), background: COLOR_UUTIEN[p.name], borderRadius:'5px 5px 2px 2px'}}/>
                  <div style={{fontSize:10, color:'#8a8072', textAlign:'center'}}>{p.name}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{padding:14}}>
            <div style={{fontSize:11.5, fontWeight:700, color:'#6b6258', marginBottom:4, letterSpacing:'0.04em'}}>TRẠNG THÁI CÔNG VIỆC</div>
            <div style={{height:100, position:'relative'}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.byStatus} dataKey="value" nameKey="name" innerRadius={28} outerRadius={44} paddingAngle={2} stroke="none">
                    {stats.byStatus.map((s,i) => <Cell key={i} fill={COLOR_TRANGTHAI[s.name]}/>)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                <div style={{fontSize:15, fontWeight:800, color:NAVY}}>{stats.total}</div>
              </div>
            </div>
            <div style={{display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center', marginTop:2}}>
              {stats.byStatus.map(s => (
                <div key={s.name} style={{display:'flex', alignItems:'center', gap:4, fontSize:9.5, color:'#6b6258'}}>
                  <div style={{width:7, height:7, borderRadius:'50%', background:COLOR_TRANGTHAI[s.name]}}/>{s.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task lists */}
        {showArchive ? (
          <ArchiveList tasks={filtered} isAdmin={isAdmin} staffName={staffName} onDelete={deleteTask}/>
        ) : isAdmin && viewMode === 'table' ? (
          <TaskTable tasks={filtered} onEdit={(t)=>{setEditingId(t.id); setShowForm(true);}} onDelete={deleteTask}
            onSendReminder={handleSendReminder} emailSending={emailSending}/>
        ) : isAdmin && viewMode === 'calendar' ? (
          <TaskCalendar tasks={filtered} month={calendarMonth} onMonthChange={setCalendarMonth}
            selectedDay={selectedDay} onSelectDay={setSelectedDay}
            onEdit={(t)=>{setEditingId(t.id); setShowForm(true);}} onDelete={deleteTask}
            onSendReminder={handleSendReminder} emailSending={emailSending}/>
        ) : isAdmin && viewMode === 'catalog' ? (
          <CatalogView catalog={catalog} isAdmin={true} onUpsert={upsertCatalogItem} onDelete={deleteCatalogItem}/>
        ) : isAdmin && viewMode === 'pending' ? (
          <PendingView tasks={tasks.filter(t => t.choGiaoViec)}
            onAssign={(item) => { setEditingId(item.id); setShowForm(true); }}
            onDelete={deleteTask}/>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:14}}>
            <TaskColumn title="Chưa bắt đầu" color="#9AA5B1" bg="#F1F0EB" tasks={filtered.filter(t=>t.trangThai==='Chưa bắt đầu')}
              isAdmin={isAdmin} staffName={staffName} onEdit={(t)=>{setEditingId(t.id); setShowForm(true);}} onDelete={deleteTask}
              onAdvance={(id)=>setStatus(id,'Đang xử lý')} advanceLabel="Bắt đầu" advanceIcon={<PlayCircle size={14}/>}
              onSendReminder={handleSendReminder} emailSending={emailSending}/>
            <TaskColumn title="Đang xử lý" color="#1B6FA8" bg="#EAF2F7" tasks={filtered.filter(t=>t.trangThai==='Đang xử lý')}
              isAdmin={isAdmin} staffName={staffName} onEdit={(t)=>{setEditingId(t.id); setShowForm(true);}} onDelete={deleteTask}
              onAdvance={(id)=>setStatus(id,'Đã hoàn thành')} advanceLabel="Hoàn thành" advanceIcon={<Check size={14}/>}
              onSendReminder={handleSendReminder} emailSending={emailSending}/>
            <TaskColumn title="Đã hoàn thành" color="#1E7A5C" bg="#E9F3EE" tasks={filtered.filter(t=>t.trangThai==='Đã hoàn thành')}
              isAdmin={isAdmin} staffName={staffName} onEdit={(t)=>{setEditingId(t.id); setShowForm(true);}} onDelete={deleteTask}
              onSendReminder={handleSendReminder} emailSending={emailSending}/>
          </div>
        )}
        </>
        )}
        </div>
      </div>

      {showForm && (isAdmin || staffName) && (
        <TaskForm
          initial={editingId ? tasks.find(t=>t.id===editingId) : null}
          prefill={catalogPrefill}
          phuTrachList={phuTrachList}
          isAdmin={isAdmin}
          staffName={staffName}
          deXuatMode={formDeXuat}
          onCancel={() => { setShowForm(false); setEditingId(null); setCatalogPrefill(null); setFormDeXuat(false); }}
          onSave={(task) => { upsertTask(task); setCatalogPrefill(null); setFormDeXuat(false); }}
        />
      )}

      {showNotifications && staffName && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => {
            setLastSeen(staffName, nowISO());
            setShowNotifications(false);
          }}
        />
      )}

      {showAdminPendingAlert && isAdmin && (
        <AdminPendingAlert
          items={adminPendingNotifications}
          onViewNow={() => {
            setLastSeen('admin', nowISO());
            setShowAdminPendingAlert(false);
            setViewMode('pending');
            setShowArchive(false);
          }}
          onClose={() => {
            setLastSeen('admin', nowISO());
            setShowAdminPendingAlert(false);
          }}
        />
      )}

      {showChangePin && staffName && (
        <ChangePinModal
          onCancel={() => setShowChangePin(false)}
          onSubmit={async (oldPin, newPin) => {
            const result = await handleChangePin(oldPin, newPin);
            if (result.ok) {
              showToast('Đã đổi mã PIN thành công');
              setShowChangePin(false);
            }
            return result;
          }}
        />
      )}

      {toast && (
        <div style={{position:'fixed', bottom:20, left:'50%', transform:'translateX(-50%)', background:NAVY_DEEP, color:'#fff', padding:'10px 18px', borderRadius:10, fontSize:13.5, animation:'fadeIn .2s ease', boxShadow:'0 6px 20px rgba(0,0,0,0.25)', zIndex:50}}>
          {toast}
        </div>
      )}
    </div>
  );
}

function greetingByHour() {
  const h = new Date().getHours();
  if (h < 11) return 'Chúc ngày mới tốt lành!';
  if (h < 14) return 'Chúc buổi trưa vui vẻ!';
  if (h < 18) return 'Chúc buổi chiều làm việc hiệu quả!';
  return 'Chúc buổi tối an lành!';
}

function NotificationPanel({ notifications, onClose }) {
  const { newTasks, dueTasks } = notifications;
  const hasAny = newTasks.length > 0 || dueTasks.length > 0;
  const pad2 = (n) => String(n).padStart(2, '0');
  const summary = newTasks.length > 0 && dueTasks.length > 0
    ? `Hôm nay bạn có ${pad2(newTasks.length)} việc mới được giao và ${pad2(dueTasks.length)} việc đến hạn.`
    : newTasks.length > 0
      ? `Hôm nay bạn có ${pad2(newTasks.length)} việc mới được giao.`
      : dueTasks.length > 0
        ? `Hôm nay bạn có ${pad2(dueTasks.length)} việc đến hạn.`
        : 'Bạn chưa có thông báo mới nào.';
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(18,37,72,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:45, animation:'fadeIn .15s ease', padding:24}}
      onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:'#fff', width:'100%', maxWidth:420, borderRadius:18, padding:'22px', boxShadow:'0 20px 60px rgba(0,0,0,0.35)', animation:'slideUp .2s ease', maxHeight:'80vh', overflowY:'auto'}}>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', marginBottom:16}}>
          <div style={{width:52, height:52, borderRadius:'50%', background: hasAny ? '#FBEAEA' : '#EAF2F7', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10}}>
            <Bell size={24} color={hasAny ? RED : SKY_DEEP}/>
          </div>
          <h2 style={{margin:0, fontSize:16.5, fontWeight:800, fontFamily:'Georgia, serif', color:NAVY}}>
            {greetingByHour()}
          </h2>
          <p style={{margin:'6px 0 0', fontSize:13, color:'#6b6258', lineHeight:1.4}}>{summary}</p>
        </div>

        {!hasAny && (
          <div style={{textAlign:'center', padding:'8px 0 20px', color:'#A89B85', fontSize:13}}>Không có thông báo mới</div>
        )}

        {newTasks.length > 0 && (
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11.5, fontWeight:700, color:'#8a8072', marginBottom:8, letterSpacing:'0.03em'}}>VIỆC MỚI ĐƯỢC GIAO</div>
            {newTasks.map(t => (
              <div key={t.id} style={{padding:'10px 12px', background:'#EAF2F7', borderRadius:10, marginBottom:8}}>
                <div style={{fontSize:13.5, fontWeight:600, color:'#20242B'}}>{t.ten}</div>
                <div style={{fontSize:11, color:'#1B6FA8', marginTop:3}}>Hạn: {t.hanHoanThanh}</div>
              </div>
            ))}
          </div>
        )}

        {dueTasks.length > 0 && (
          <div style={{marginBottom:hasAny ? 6 : 0}}>
            <div style={{fontSize:11.5, fontWeight:700, color:'#8a8072', marginBottom:8, letterSpacing:'0.03em'}}>SẮP / ĐÃ ĐẾN HẠN</div>
            {dueTasks.map(t => {
              const dl = daysLeft(t.hanHoanThanh);
              const label = dl < 0 ? `Trễ ${Math.abs(dl)} ngày` : dl === 0 ? 'Đến hạn hôm nay' : 'Đến hạn ngày mai';
              return (
                <div key={t.id} style={{padding:'10px 12px', background:'#FBEAEA', borderRadius:10, marginBottom:8}}>
                  <div style={{fontSize:13.5, fontWeight:600, color:'#20242B'}}>{t.ten}</div>
                  <div style={{fontSize:11, color:RED, marginTop:3, fontWeight:600}}>{label}</div>
                </div>
              );
            })}
          </div>
        )}

        <button className="btn" onClick={onClose}
          style={{width:'100%', padding:12, borderRadius:11, background:NAVY, color:'#fff', fontWeight:700, fontSize:14, marginTop:6}}>
          Đã xem
        </button>
      </div>
    </div>
  );
}

// ---------- Huy hiệu bệnh viện (dùng ảnh logo thật) ----------
function HospitalCrest({ size = 44 }) {
  return (
    <img src={HOSPITAL_LOGO_BASE64} alt="Logo Bệnh viện Trường Đại học Y Dược Cần Thơ"
      width={size} height={size} style={{flexShrink:0, borderRadius:'50%', objectFit:'cover'}}/>
  );
}

function ChangePinModal({ onCancel, onSubmit }) {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError('');
    if (!oldPin || !newPin || !confirmPin) { setError('Vui lòng nhập đủ thông tin'); return; }
    if (newPin !== confirmPin) { setError('Mã PIN mới nhập lại không khớp'); return; }
    setLoading(true);
    const result = await onSubmit(oldPin, newPin);
    setLoading(false);
    if (!result.ok) setError(result.reason);
  };

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(18,37,72,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:45, animation:'fadeIn .15s ease', padding:24}}
      onClick={onCancel}>
      <div onClick={e=>e.stopPropagation()} style={{background:'#fff', width:'100%', maxWidth:340, borderRadius:16, padding:'20px', boxShadow:'0 20px 60px rgba(0,0,0,0.3)', animation:'slideUp .2s ease'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
          <h2 style={{margin:0, fontSize:16, fontWeight:800, fontFamily:'Georgia, serif', color:NAVY}}>Đổi mã PIN</h2>
          <button className="btn" onClick={onCancel} style={{background:'#F0EBE0', width:28, height:28, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center'}}><X size={14}/></button>
        </div>

        <Field label="Mã PIN hiện tại">
          <input type="password" inputMode="numeric" value={oldPin} onChange={e=>setOldPin(e.target.value)} placeholder="••••"
            style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:15, letterSpacing:3, textAlign:'center'}}/>
        </Field>
        <Field label="Mã PIN mới (4-6 chữ số)">
          <input type="password" inputMode="numeric" value={newPin} onChange={e=>setNewPin(e.target.value)} placeholder="••••"
            style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:15, letterSpacing:3, textAlign:'center'}}/>
        </Field>
        <Field label="Nhập lại mã PIN mới">
          <input type="password" inputMode="numeric" value={confirmPin} onChange={e=>setConfirmPin(e.target.value)}
            onKeyDown={e => e.key==='Enter' && submit()} placeholder="••••"
            style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:15, letterSpacing:3, textAlign:'center'}}/>
        </Field>

        {error && <div style={{color:RED, fontSize:12, marginBottom:10}}>{error}</div>}

        <button className="btn" onClick={submit} disabled={loading}
          style={{width:'100%', padding:12, borderRadius:11, background:NAVY, color:'#fff', fontWeight:700, fontSize:14, marginTop:4, opacity: loading ? 0.6 : 1}}>
          {loading ? 'Đang lưu...' : 'Xác nhận đổi PIN'}
        </button>
      </div>
    </div>
  );
}

function AdminPendingAlert({ items, onViewNow, onClose }) {
  const pad2 = (n) => String(n).padStart(2, '0');
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(18,37,72,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:45, animation:'fadeIn .15s ease', padding:24}}
      onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:'#fff', width:'100%', maxWidth:420, borderRadius:18, padding:'22px', boxShadow:'0 20px 60px rgba(0,0,0,0.35)', animation:'slideUp .2s ease', maxHeight:'80vh', overflowY:'auto'}}>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', marginBottom:16}}>
          <div style={{width:52, height:52, borderRadius:'50%', background:'#FBEAEA', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10}}>
            <Bell size={24} color={RED}/>
          </div>
          <h2 style={{margin:0, fontSize:16.5, fontWeight:800, fontFamily:'Georgia, serif', color:NAVY}}>
            {greetingByHour()}
          </h2>
          <p style={{margin:'6px 0 0', fontSize:13, color:'#6b6258', lineHeight:1.4}}>
            Có {pad2(items.length)} đề xuất công việc mới đang chờ Thu xem xét và giao việc.
          </p>
        </div>

        <div style={{marginBottom:16}}>
          {items.map(t => (
            <div key={t.id} style={{padding:'10px 12px', background:'#FBEAEA', borderRadius:10, marginBottom:8}}>
              <div style={{fontSize:13.5, fontWeight:600, color:'#20242B'}}>{t.ten}</div>
              <div style={{fontSize:11, color:RED, marginTop:3}}>Đề xuất bởi {t.deXuatBoi}</div>
            </div>
          ))}
        </div>

        <button className="btn" onClick={onViewNow}
          style={{width:'100%', padding:12, borderRadius:11, background:NAVY, color:'#fff', fontWeight:700, fontSize:14, marginBottom:8}}>
          Xem ngay
        </button>
        <button className="btn" onClick={onClose}
          style={{width:'100%', padding:11, borderRadius:11, background:'#F0EBE0', color:'#6b6258', fontWeight:600, fontSize:13.5}}>
          Để sau
        </button>
      </div>
    </div>
  );
}

function RoleGate({ onAdmin, onStaff, staffList, showLogin, onCancelLogin, onAdminLogin, staffPins }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [staffStep, setStaffStep] = useState('pick'); // 'pick' -> 'pin'
  const [staffPin, setStaffPin] = useState('');
  const [staffError, setStaffError] = useState('');

  const tryLogin = () => {
    if (pin === ADMIN_PIN) { onAdminLogin(); setPin(''); setError(''); }
    else setError('Sai mã PIN, vui lòng thử lại');
  };

  const goToStaffPin = () => {
    if (!selectedStaff) return;
    setStaffStep('pin');
    setStaffPin('');
    setStaffError('');
  };

  const tryStaffLogin = () => {
    const person = NHAN_SU.find(n => n.name === selectedStaff);
    const effectivePin = (staffPins && staffPins[selectedStaff]) || person?.pin;
    if (person && staffPin === effectivePin) { onStaff(selectedStaff); }
    else setStaffError('Sai mã PIN, vui lòng thử lại');
  };

  return (
    <div style={{minHeight:'100vh', background:`linear-gradient(180deg, ${SKY_DEEP} 0%, ${SKY} 55%, ${BG} 55%)`, fontFamily:"'Inter', -apple-system, sans-serif", display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24}}>
      <style>{`.btn { cursor:pointer; border:none; font-family:inherit; } .btn:active{transform:scale(0.97);}`}</style>
      <div style={{textAlign:'center', marginBottom:26}}>
        <div style={{display:'flex', justifyContent:'center', marginBottom:14}}>
          <div style={{background:'#fff', borderRadius:'50%', padding:5, boxShadow:'0 8px 24px rgba(0,0,0,0.25)'}}>
            <HospitalCrest size={58}/>
          </div>
        </div>
        <div style={{fontSize:10.5, letterSpacing:'0.1em', textTransform:'uppercase', color:'#fff', fontWeight:700}}>Bệnh viện Trường Đại học Y Dược Cần Thơ</div>
        <div style={{fontSize:11, color:GOLD, fontStyle:'italic', marginTop:2}}>Chuẩn chuyên môn - Tận tâm phục vụ</div>
        <div style={{fontSize:12, color:'rgba(255,255,255,0.85)', marginTop:10}}>Phòng Kế hoạch Tổng hợp</div>
        <div style={{fontSize:10.5, color:'rgba(255,255,255,0.7)', fontStyle:'italic', marginTop:1}}>Kế hoạch hôm nay - Tương lai ngày mai</div>
        <h1 style={{margin:'12px 0 0', fontSize:22, fontWeight:800, fontFamily:'Georgia, serif', color:'#fff', textTransform:'uppercase'}}>Bộ công cụ theo dõi công việc</h1>
      </div>

      {!showLogin ? (
        <div style={{width:'100%', maxWidth:340, display:'flex', flexDirection:'column', gap:12}}>
          <button className="btn" onClick={onAdmin}
            style={{display:'flex', alignItems:'center', gap:12, padding:'16px 18px', borderRadius:14, background:`linear-gradient(135deg, ${GOLD}, #D99A0B)`, color:NAVY_DEEP, textAlign:'left', boxShadow:'0 6px 18px rgba(240,180,41,0.35)'}}>
            <ShieldCheck size={22}/>
            <div style={{fontWeight:800, fontSize:15}}>Quản lý</div>
          </button>

          <div style={{background:'#fff', border:'1px solid #E7E3D8', borderRadius:14, padding:'14px 16px', boxShadow:'0 6px 18px rgba(18,37,72,0.08)'}}>
            <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:10, color:NAVY}}>
              <User size={18}/><span style={{fontWeight:700, fontSize:15}}>Nhân viên</span>
            </div>

            {staffStep === 'pick' ? (
              <>
                <select value={selectedStaff} onChange={e=>setSelectedStaff(e.target.value)}
                  style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:13.5, marginBottom:10, background:'#fff'}}>
                  <option value="">Chọn tên của bạn...</option>
                  {staffList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="btn" disabled={!selectedStaff} onClick={goToStaffPin}
                  style={{width:'100%', padding:11, borderRadius:9, background: selectedStaff ? NAVY : '#E3DACB', color:'#fff', fontWeight:700, fontSize:13.5}}>
                  Tiếp tục
                </button>
              </>
            ) : (
              <>
                <div style={{fontSize:12.5, color:'#6b6258', marginBottom:8}}>Nhập mã PIN của <strong>{selectedStaff}</strong></div>
                <input type="password" value={staffPin} onChange={e=>{setStaffPin(e.target.value); setStaffError('');}}
                  onKeyDown={e => e.key==='Enter' && tryStaffLogin()}
                  placeholder="••••" autoFocus inputMode="numeric" maxLength={6}
                  style={{width:'100%', padding:'11px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:16, letterSpacing:4, textAlign:'center', marginBottom:10}}/>
                {staffError && <div style={{color:RED, fontSize:12, marginBottom:10}}>{staffError}</div>}
                <div style={{display:'flex', gap:8}}>
                  <button className="btn" onClick={()=>{setStaffStep('pick'); setStaffError('');}}
                    style={{flex:1, padding:11, borderRadius:9, background:'#F0EBE0', color:'#6b6258', fontWeight:600, fontSize:13.5}}>Quay lại</button>
                  <button className="btn" onClick={tryStaffLogin}
                    style={{flex:1, padding:11, borderRadius:9, background:NAVY, color:'#fff', fontWeight:700, fontSize:13.5}}>Vào</button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div style={{width:'100%', maxWidth:300, background:'#fff', border:'1px solid #E7E3D8', borderRadius:14, padding:20, boxShadow:'0 6px 18px rgba(18,37,72,0.08)'}}>
          <div style={{fontWeight:700, fontSize:15, marginBottom:10, color:NAVY}}>Nhập mã PIN quản lý</div>
          <input type="password" value={pin} onChange={e=>{setPin(e.target.value); setError('');}}
            onKeyDown={e => e.key==='Enter' && tryLogin()}
            placeholder="••••" autoFocus
            style={{width:'100%', padding:'11px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:16, letterSpacing:4, textAlign:'center', marginBottom:10}}/>
          {error && <div style={{color:RED, fontSize:12, marginBottom:10}}>{error}</div>}
          <div style={{display:'flex', gap:8}}>
            <button className="btn" onClick={onCancelLogin} style={{flex:1, padding:11, borderRadius:9, background:'#F0EBE0', color:'#6b6258', fontWeight:600, fontSize:13.5}}>Quay lại</button>
            <button className="btn" onClick={tryLogin} style={{flex:1, padding:11, borderRadius:9, background:NAVY, color:'#fff', fontWeight:700, fontSize:13.5}}>Vào</button>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminSidebar({ current, archiveCount, pendingCount, onSelect }) {
  const items = [
    { key: 'board', icon: <LayoutGrid size={16}/>, label: 'Bảng công việc' },
    { key: 'table', icon: <Table2 size={16}/>, label: 'Bảng tổng hợp' },
    { key: 'calendar', icon: <Calendar size={16}/>, label: 'Lịch' },
    { key: 'catalog', icon: <ClipboardList size={16}/>, label: 'DM công việc P.KHTH' },
    { key: 'pending', icon: <AlertCircle size={16}/>, label: `Chờ giao việc (${pendingCount})` },
    { key: 'archive', icon: <Archive size={16}/>, label: `Lưu trữ (${archiveCount})` },
  ];
  return (
    <div className="card khth-sidebar" style={{padding:8, flexShrink:0, display:'flex', flexDirection:'column', gap:4, position:'sticky', top:100}}>
      {items.map(it => (
        <button key={it.key} className="btn khth-sidebar-btn" onClick={()=>onSelect(it.key)}
          style={{display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:9, fontSize:12.5, fontWeight:600, textAlign:'left',
            background: current===it.key ? NAVY : 'transparent', color: current===it.key ? '#fff' : '#20242B'}}>
          {it.icon}<span className="khth-sidebar-label">{it.label}</span>
        </button>
      ))}
    </div>
  );
}

function StatChip({ icon, label, value, color }) {
  return (
    <div className="card" style={{padding:'10px 14px', display:'flex', alignItems:'center', gap:8, minWidth:104, flexShrink:0}}>
      <div style={{color}}>{icon}</div>
      <div>
        <div style={{fontSize:16, fontWeight:800, lineHeight:1}}>{value}</div>
        <div style={{fontSize:10, color:'#8a8072', marginTop:2, whiteSpace:'nowrap'}}>{label}</div>
      </div>
    </div>
  );
}

function SelectBox({ value, onChange, options, getLabel, getValue, minWidth }) {
  return (
    <div style={{position:'relative', minWidth}}>
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{width:'100%', appearance:'none', padding:'8px 28px 8px 10px', borderRadius:9, border:'1px solid #E3DACB', fontSize:13, background:'#fff', color:'#20242B'}}>
        {options.map(o => <option key={getValue(o)} value={getValue(o)}>{getLabel(o)}</option>)}
      </select>
      <ChevronDown size={14} style={{position:'absolute', right:9, top:10, color:'#A89B85', pointerEvents:'none'}}/>
    </div>
  );
}

const TRANG_THAI_ORDER = { 'Chưa bắt đầu': 0, 'Đang xử lý': 1, 'Đã hoàn thành': 2 };

function TaskTable({ tasks, onEdit, onDelete, onSendReminder, emailSending }) {
  const sortedTasks = [...tasks].sort((a, b) => (TRANG_THAI_ORDER[a.trangThai] ?? 9) - (TRANG_THAI_ORDER[b.trangThai] ?? 9));
  return (
    <div className="card" style={{overflowX:'auto'}}>
      {sortedTasks.length === 0 ? (
        <div style={{padding:'24px 14px', fontSize:12.5, color:'#A89B85', textAlign:'center'}}>Không có việc nào</div>
      ) : (
        <table style={{width:'100%', borderCollapse:'collapse', minWidth:640}}>
          <thead>
            <tr style={{background:'#F1F0EB'}}>
              <th style={thStyle}>STT</th>
              <th style={{...thStyle, textAlign:'left', minWidth:180}}>Tên công việc</th>
              <th style={thStyle}>Nhóm</th>
              <th style={thStyle}>Người phụ trách</th>
              <th style={thStyle}>Ưu tiên</th>
              <th style={thStyle}>Hạn</th>
              <th style={thStyle}>Trạng thái</th>
              <th style={thStyle}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.map((t, i) => {
              const dl = daysLeft(t.hanHoanThanh);
              const overdue = t.trangThai !== 'Đã hoàn thành' && dl < 0;
              const selfCreated = t.taoBoi && t.taoBoi !== 'admin';
              return (
                <tr key={t.id} style={{borderTop:'1px solid #F0EDE3'}}>
                  <td style={tdStyle}>{i+1}</td>
                  <td style={{...tdStyle, textAlign:'left', fontWeight:600}}>
                    {t.ten}
                    {selfCreated && <span style={{marginLeft:6, fontSize:9.5, padding:'1px 6px', borderRadius:20, background:'#EDE7DA', color:'#8a7350', fontWeight:600}}>Tự thêm</span>}
                    {t.riengTu && <span style={{marginLeft:6, fontSize:9.5, padding:'1px 6px', borderRadius:20, background:'#FBEAEA', color:RED, fontWeight:600}}>Riêng tư</span>}
                  </td>
                  <td style={tdStyle}>{t.nhom}</td>
                  <td style={tdStyle}>{t.phuTrach}</td>
                  <td style={tdStyle}>
                    <span style={{fontSize:10, padding:'1px 7px', borderRadius:20, background: COLOR_UUTIEN[t.uuTien]+'20', color:COLOR_UUTIEN[t.uuTien], fontWeight:600}}>{t.uuTien}</span>
                  </td>
                  <td style={{...tdStyle, color: overdue ? RED : '#20242B', fontWeight: overdue ? 700 : 400}}>{t.hanHoanThanh}</td>
                  <td style={tdStyle}>
                    <span style={{fontSize:10, padding:'1px 7px', borderRadius:20, background: COLOR_TRANGTHAI[t.trangThai]+'30', color:'#20242B', fontWeight:600}}>{t.trangThai}</span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{display:'flex', gap:5, justifyContent:'center'}}>
                      {!selfCreated && onSendReminder && (
                        <button className="btn" onClick={()=>onSendReminder(t)} title="Nhắc qua email" disabled={emailSending===t.id}
                          style={{background:'#F3F0EA', color:'#1B6FA8', width:24, height:24, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center'}}>
                          <Mail size={11}/>
                        </button>
                      )}
                      <button className="btn" onClick={()=>onEdit(t)} title="Sửa"
                        style={{background:'#F3F0EA', color:'#6b6258', width:24, height:24, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <Pencil size={11}/>
                      </button>
                      <button className="btn" onClick={()=>onDelete(t.id)} title="Xoá"
                        style={{background:'#F3F0EA', color:RED, width:24, height:24, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <Trash2 size={11}/>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
const thStyle = { padding:'9px 10px', fontSize:11, fontWeight:700, color:'#6b6258', textAlign:'center', whiteSpace:'nowrap' };
const tdStyle = { padding:'9px 10px', fontSize:12, color:'#20242B', textAlign:'center' };

function TaskCalendar({ tasks, month, onMonthChange, selectedDay, onSelectDay, onEdit, onDelete, onSendReminder, emailSending }) {
  const year = month.getFullYear();
  const monthIdx = month.getMonth();
  const firstDay = new Date(year, monthIdx, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Thứ 2 = 0
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();

  const tasksByDay = useMemo(() => {
    const map = {};
    tasks.forEach(t => {
      if (!t.hanHoanThanh) return;
      const d = t.hanHoanThanh;
      if (!d.startsWith(`${year}-${String(monthIdx+1).padStart(2,'0')}`)) return;
      if (!map[d]) map[d] = [];
      map[d].push(t);
    });
    return map;
  }, [tasks, year, monthIdx]);

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const todayStr = todayISO();
  const monthLabel = month.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  const selectedTasks = selectedDay ? (tasksByDay[selectedDay] || []) : [];
  const monthDates = useMemo(() => Object.keys(tasksByDay).sort(), [tasksByDay]);

  return (
    <div className="khth-calendar-wrap" style={{display:'flex', gap:14, alignItems:'flex-start'}}>
      <div className="card khth-calendar-left" style={{padding:14, width:320, flexShrink:0}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12}}>
          <button className="btn" onClick={()=>{ const d = new Date(month); d.setMonth(d.getMonth()-1); onMonthChange(d); onSelectDay(null); }}
            style={{width:28, height:28, borderRadius:8, background:'#F3F0EA', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <ChevronLeft size={15}/>
          </button>
          <div style={{fontSize:14, fontWeight:700, color:NAVY, textTransform:'capitalize'}}>{monthLabel}</div>
          <button className="btn" onClick={()=>{ const d = new Date(month); d.setMonth(d.getMonth()+1); onMonthChange(d); onSelectDay(null); }}
            style={{width:28, height:28, borderRadius:8, background:'#F3F0EA', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <ChevronRight size={15}/>
          </button>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:3, marginBottom:6}}>
          {['T2','T3','T4','T5','T6','T7','CN'].map(d => (
            <div key={d} style={{textAlign:'center', fontSize:10, fontWeight:700, color:'#A89B85'}}>{d}</div>
          ))}
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:3}}>
          {cells.map((d, i) => {
            if (d === null) return <div key={i}/>;
            const dateStr = `${year}-${String(monthIdx+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const dayTasks = tasksByDay[dateStr] || [];
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDay;
            const hasOverdue = dayTasks.some(t => t.trangThai !== 'Đã hoàn thành' && dateStr < todayStr);
            return (
              <button key={i} className="btn" onClick={()=>onSelectDay(isSelected ? null : dateStr)}
                style={{
                  aspectRatio:'1', borderRadius:9, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2,
                  background: isSelected ? NAVY : isToday ? '#EAF2F7' : 'transparent',
                  border: isToday && !isSelected ? `1px solid ${SKY}` : '1px solid transparent',
                }}>
                <span style={{fontSize:12, fontWeight: isToday||isSelected ? 700 : 500, color: isSelected ? '#fff' : '#20242B'}}>{d}</span>
                {dayTasks.length > 0 && (
                  <span style={{
                    fontSize:11, fontWeight:800, lineHeight:1,
                    color: isSelected ? '#fff' : hasOverdue ? RED : SKY,
                  }}>{hasOverdue ? '−' : '+'}</span>
                )}
              </button>
            );
          })}
        </div>
        <div style={{display:'flex', gap:14, justifyContent:'center', marginTop:10, fontSize:10.5, color:'#8a8072'}}>
          <span style={{color:SKY, fontWeight:800}}>+</span>&nbsp;Có việc đến hạn
          <span style={{color:RED, fontWeight:800, marginLeft:6}}>−</span>&nbsp;Có việc trễ hạn
        </div>
      </div>

      <div className="khth-calendar-right" style={{flex:1, minWidth:0}}>
        {selectedDay ? (
          <div className="card" style={{overflow:'hidden'}}>
            <div style={{background:'#F1F0EB', padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <span style={{fontSize:12.5, fontWeight:700, color:'#20242B'}}>Công việc ngày {selectedDay.split('-').reverse().join('/')} ({selectedTasks.length})</span>
              <button className="btn" onClick={()=>onSelectDay(null)} style={{fontSize:11, color:'#1B6FA8', background:'transparent', padding:'2px 6px'}}>Xem cả tháng</button>
            </div>
            {selectedTasks.length === 0 ? (
              <div style={{padding:'16px 14px', fontSize:12.5, color:'#A89B85', textAlign:'center'}}>Không có việc nào đến hạn ngày này</div>
            ) : (
              selectedTasks.map(t => <CalendarTaskRow key={t.id} t={t} onEdit={onEdit} onDelete={onDelete} onSendReminder={onSendReminder} emailSending={emailSending}/>)
            )}
          </div>
        ) : (
          <div className="card" style={{overflow:'hidden'}}>
            <div style={{background:'#F1F0EB', padding:'10px 14px', fontSize:12.5, fontWeight:700, color:'#20242B'}}>
              Danh sách công việc trong tháng ({tasks.length})
            </div>
            {monthDates.length === 0 ? (
              <div style={{padding:'20px 14px', fontSize:12.5, color:'#A89B85', textAlign:'center'}}>Không có việc nào đến hạn trong tháng này</div>
            ) : (
              monthDates.map(dateStr => {
                const dayTasks = tasksByDay[dateStr] || [];
                const isOverdueDay = dateStr < todayStr;
                return (
                  <div key={dateStr}>
                    <div style={{padding:'7px 14px', background:'#FAF9F5', fontSize:11, fontWeight:700, color: isOverdueDay ? RED : '#6b6258', borderTop:'1px solid #F0EDE3'}}>
                      {dateStr.split('-').reverse().join('/')}
                    </div>
                    {dayTasks.map(t => <CalendarTaskRow key={t.id} t={t} onEdit={onEdit} onDelete={onDelete} onSendReminder={onSendReminder} emailSending={emailSending}/>)}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarTaskRow({ t, onEdit, onDelete, onSendReminder, emailSending }) {
  const selfCreated = t.taoBoi && t.taoBoi !== 'admin';
  return (
    <div style={{padding:'10px 14px', borderTop:'1px solid #F0EDE3', display:'flex', gap:10, alignItems:'flex-start'}}>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:13, fontWeight:600, color:'#20242B'}}>{t.ten}</div>
        <div style={{fontSize:10.5, color:'#8a8072', marginTop:3}}>{t.phuTrach} · {t.trangThai}</div>
      </div>
      <div style={{display:'flex', gap:6, flexShrink:0}}>
        {!selfCreated && onSendReminder && (
          <button className="btn" onClick={()=>onSendReminder(t)} title="Nhắc qua email" disabled={emailSending===t.id}
            style={{background:'#F3F0EA', color:'#1B6FA8', width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Mail size={12}/>
          </button>
        )}
        <button className="btn" onClick={()=>onEdit(t)} title="Sửa"
          style={{background:'#F3F0EA', color:'#6b6258', width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <Pencil size={12}/>
        </button>
        <button className="btn" onClick={()=>onDelete(t.id)} title="Xoá"
          style={{background:'#F3F0EA', color:RED, width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <Trash2 size={12}/>
        </button>
      </div>
    </div>
  );
}

function TaskColumn({ title, color, bg, tasks, isAdmin, staffName, onEdit, onDelete, onAdvance, advanceLabel, advanceIcon, onSendReminder, emailSending }) {
  return (
    <div className="card" style={{overflow:'hidden'}}>
      <div style={{background:bg, padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{display:'flex', alignItems:'center', gap:7}}>
          <div style={{width:8, height:8, borderRadius:'50%', background:color}}/>
          <span style={{fontSize:13, fontWeight:700, color:'#20242B'}}>{title}</span>
        </div>
        <span style={{fontSize:12, fontWeight:700, color}}>{tasks.length}</span>
      </div>
      {tasks.length === 0 ? (
        <div style={{padding:'16px 14px', fontSize:12.5, color:'#A89B85', textAlign:'center'}}>Không có việc nào</div>
      ) : (
        <div>
          {tasks.map(t => {
            const dl = daysLeft(t.hanHoanThanh);
            const overdue = t.trangThai !== 'Đã hoàn thành' && dl < 0;
            const nhomTen = NHOM_CV.find(n=>n.ma===t.nhom)?.ten || '';
            const selfCreated = t.taoBoi && t.taoBoi !== 'admin';
            const canManage = isAdmin || (staffName && t.taoBoi === staffName);
            const canRemind = isAdmin && !selfCreated && onSendReminder;
            return (
              <div key={t.id} style={{padding:'10px 14px', borderTop:'1px solid #F0EDE3', display:'flex', gap:10, alignItems:'flex-start'}}>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:13.5, fontWeight:600, color:'#20242B', lineHeight:1.35}}>{t.ten}</div>
                  <div style={{display:'flex', flexWrap:'wrap', gap:6, marginTop:5, alignItems:'center'}}>
                    <span style={{fontSize:10.5, color:'#8a8072'}}>{t.phuTrach}</span>
                    <span style={{fontSize:10, padding:'1px 7px', borderRadius:20, background: COLOR_UUTIEN[t.uuTien]+'20', color:COLOR_UUTIEN[t.uuTien], fontWeight:600}}>{t.uuTien}</span>
                    <span style={{fontSize:10.5, color: overdue ? RED : '#8a8072', fontWeight: overdue?700:400}}>
                      {overdue ? `Trễ ${Math.abs(dl)} ngày` : `Hạn ${t.hanHoanThanh}`}
                    </span>
                    {selfCreated && (
                      <span style={{fontSize:9.5, padding:'1px 7px', borderRadius:20, background:'#EDE7DA', color:'#8a7350', fontWeight:600}}>Tự thêm</span>
                    )}
                    {t.riengTu && (
                      <span style={{fontSize:9.5, padding:'1px 7px', borderRadius:20, background:'#FBEAEA', color:RED, fontWeight:600}}>Riêng tư</span>
                    )}
                  </div>
                  <div style={{fontSize:10, color:'#B8ADA0', marginTop:3}}>{t.nhom} · {nhomTen}</div>
                  {(t.batDauLuc || t.hoanThanhLuc) && (
                    <div style={{fontSize:9.5, color:'#A89B85', marginTop:4, display:'flex', gap:10}}>
                      {t.batDauLuc && <span>Bắt đầu: {fmtDateTime(t.batDauLuc)}</span>}
                      {t.hoanThanhLuc && <span style={{color: overdue ? RED : '#1E7A5C'}}>Hoàn thành: {fmtDateTime(t.hoanThanhLuc)}</span>}
                    </div>
                  )}
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:6, alignItems:'center', flexShrink:0}}>
                  {onAdvance && (
                    <button className="btn" onClick={()=>onAdvance(t.id)} title={advanceLabel}
                      style={{background:color, color:'#fff', width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center'}}>
                      {advanceIcon}
                    </button>
                  )}
                  {canRemind && (
                    <button className="btn" onClick={()=>onSendReminder(t)} title="Nhắc qua email" disabled={emailSending===t.id}
                      style={{background:'#F3F0EA', color:'#1B6FA8', width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', opacity: emailSending===t.id ? 0.5 : 1}}>
                      <Mail size={12}/>
                    </button>
                  )}
                  {canManage && (
                    <>
                      <button className="btn" onClick={()=>onEdit(t)} title="Sửa"
                        style={{background:'#F3F0EA', color:'#6b6258', width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <Pencil size={12}/>
                      </button>
                      <button className="btn" onClick={()=>onDelete(t.id)} title="Xoá"
                        style={{background:'#F3F0EA', color:RED, width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <Trash2 size={12}/>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ArchiveList({ tasks, isAdmin, staffName, onDelete }) {
  return (
    <div className="card" style={{overflow:'hidden'}}>
      <div style={{background:'#EEF3F0', padding:'10px 14px', display:'flex', alignItems:'center', gap:7}}>
        <Archive size={14} color="#1E7A5C"/>
        <span style={{fontSize:13, fontWeight:700, color:'#20242B'}}>Việc đã lưu trữ</span>
        <span style={{fontSize:12, fontWeight:700, color:'#1E7A5C', marginLeft:'auto'}}>{tasks.length}</span>
      </div>
      {tasks.length === 0 ? (
        <div style={{padding:'20px 14px', fontSize:12.5, color:'#A89B85', textAlign:'center'}}>Chưa có việc nào trong lưu trữ</div>
      ) : (
        <div>
          {tasks.map(t => {
            const nhomTen = NHOM_CV.find(n=>n.ma===t.nhom)?.ten || '';
            const canManage = isAdmin || (staffName && t.taoBoi === staffName);
            return (
              <div key={t.id} style={{padding:'10px 14px', borderTop:'1px solid #F0EDE3', display:'flex', gap:10, alignItems:'flex-start', opacity:0.85}}>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:13.5, fontWeight:600, color:'#20242B', lineHeight:1.35}}>{t.ten}</div>
                  <div style={{display:'flex', flexWrap:'wrap', gap:6, marginTop:5, alignItems:'center'}}>
                    <span style={{fontSize:10.5, color:'#8a8072'}}>{t.phuTrach}</span>
                    <span style={{fontSize:10.5, color:'#1E7A5C'}}>Hoàn thành: {fmtDateTime(t.hoanThanhLuc)}</span>
                  </div>
                  <div style={{fontSize:10, color:'#B8ADA0', marginTop:3}}>{t.nhom} · {nhomTen}</div>
                </div>
                {canManage && (
                  <button className="btn" onClick={()=>onDelete(t.id)} title="Xoá vĩnh viễn"
                    style={{background:'#F3F0EA', color:RED, width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                    <Trash2 size={12}/>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PendingView({ tasks, onAssign, onDelete }) {
  return (
    <div className="card" style={{overflow:'hidden'}}>
      <div style={{background:'#FBEAEA', padding:'10px 14px', display:'flex', alignItems:'center', gap:7}}>
        <AlertCircle size={14} color={RED}/>
        <span style={{fontSize:13, fontWeight:700, color:'#20242B'}}>Chờ giao việc</span>
        <span style={{fontSize:12, fontWeight:700, color:RED, marginLeft:'auto'}}>{tasks.length}</span>
      </div>
      {tasks.length === 0 ? (
        <div style={{padding:'24px 14px', fontSize:12.5, color:'#A89B85', textAlign:'center'}}>Chưa có nội dung nào chờ giao việc</div>
      ) : (
        tasks.map(t => {
          const nhomTen = NHOM_CV.find(n=>n.ma===t.nhom)?.ten || '';
          return (
            <div key={t.id} style={{padding:'12px 14px', borderTop:'1px solid #F0EDE3', display:'flex', gap:10, alignItems:'flex-start'}}>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:13.5, fontWeight:600, color:'#20242B', lineHeight:1.4}}>{t.ten}</div>
                {t.ghiChu && <div style={{fontSize:11.5, color:'#6b6258', marginTop:4}}>{t.ghiChu}</div>}
                <div style={{fontSize:10.5, color:'#8a8072', marginTop:5}}>
                  {t.nhom} · {nhomTen} · Đề xuất bởi <strong>{t.deXuatBoi}</strong>
                </div>
              </div>
              <div style={{display:'flex', gap:6, flexShrink:0}}>
                <button className="btn" onClick={()=>onAssign(t)}
                  style={{display:'flex', alignItems:'center', gap:5, background:NAVY, color:'#fff', padding:'8px 12px', borderRadius:8, fontSize:12, fontWeight:700, whiteSpace:'nowrap'}}>
                  <Plus size={13}/> Giao việc
                </button>
                <button className="btn" onClick={()=>onDelete(t.id)} title="Xoá"
                  style={{background:'#F3F0EA', color:RED, width:32, height:32, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center'}}>
                  <Trash2 size={13}/>
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function CatalogItemForm({ initial, onCancel, onSave }) {
  const [ten, setTen] = useState(initial?.ten || '');
  const [nhom, setNhom] = useState(initial?.nhom || NHOM_CV[0].ma);
  const [noiDung, setNoiDung] = useState(initial?.noiDung || '');
  const [phuTrach, setPhuTrach] = useState(initial?.phuTrach || '');
  const [phoiHop, setPhoiHop] = useState(initial?.phoiHop || '');
  const [error, setError] = useState('');

  const submit = () => {
    if (!ten.trim()) { setError('Vui lòng nhập tên công việc'); return; }
    onSave({ id: initial?.id, ma: initial?.ma || '', nhom, ten: ten.trim(), noiDung: noiDung.trim(), phuTrach: phuTrach.trim(), phoiHop: phoiHop.trim() });
  };

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(18,37,72,0.45)', display:'flex', alignItems:'flex-end', zIndex:40, animation:'fadeIn .15s ease'}}
      onClick={onCancel}>
      <div onClick={e=>e.stopPropagation()} style={{background:BG, width:'100%', maxHeight:'88vh', overflowY:'auto', borderRadius:'20px 20px 0 0', padding:'18px 18px 26px', animation:'slideUp .2s ease'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
          <h2 style={{margin:0, fontSize:17, fontWeight:800, fontFamily:'Georgia, serif', color:NAVY}}>{initial ? 'Sửa nội dung công việc' : 'Thêm nội dung công việc'}</h2>
          <button className="btn" onClick={onCancel} style={{background:'#F0EBE0', width:30, height:30, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center'}}><X size={16}/></button>
        </div>

        <Field label="Nhóm công việc">
          <select value={nhom} onChange={e=>setNhom(e.target.value)}
            style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:13.5, background:'#fff'}}>
            {NHOM_CV.map(n => <option key={n.ma} value={n.ma}>{n.ma} · {n.ten}</option>)}
          </select>
        </Field>

        <Field label="Tên công việc nhỏ">
          <input value={ten} onChange={e=>setTen(e.target.value)} placeholder="VD: Danh mục kỹ thuật"
            style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:14}}/>
        </Field>

        <Field label="Nội dung / đầu việc cụ thể">
          <textarea value={noiDung} onChange={e=>setNoiDung(e.target.value)} rows={3} placeholder="Mô tả chi tiết công việc..."
            style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:13.5, resize:'vertical'}}/>
        </Field>

        <Field label="Người phụ trách chính">
          <input value={phuTrach} onChange={e=>setPhuTrach(e.target.value)} placeholder="VD: ThS. Lê Huyền Trân" list="catalog-staff-list"
            style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:14}}/>
          <datalist id="catalog-staff-list">{NHAN_SU_NAMES.map(p => <option key={p} value={p}/>)}</datalist>
        </Field>

        <Field label="Người phụ trách (cách nhau bằng dấu phẩy)">
          <input value={phoiHop} onChange={e=>setPhoiHop(e.target.value)} placeholder="VD: BS. Dương Thị Anh Thư, CN. Nguyễn Ngọc Thơ"
            style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:14}}/>
        </Field>

        {error && <div style={{color:RED, fontSize:12.5, marginBottom:10}}>{error}</div>}

        <button className="btn" onClick={submit}
          style={{width:'100%', padding:13, borderRadius:11, background:NAVY, color:'#fff', fontWeight:700, fontSize:14.5, marginTop:4}}>
          {initial ? 'Lưu thay đổi' : 'Thêm vào danh mục'}
        </button>
      </div>
    </div>
  );
}

function CatalogView({ catalog, isAdmin, onUpsert, onDelete }) {
  const [search, setSearch] = useState('');
  const [filterNhom, setFilterNhom] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  if (!catalog) {
    return <div className="card" style={{padding:'24px 14px', fontSize:12.5, color:'#A89B85', textAlign:'center'}}>Đang tải danh mục…</div>;
  }

  const filtered = catalog.filter(item => {
    if (filterNhom !== 'all' && item.nhom !== filterNhom) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!item.ten.toLowerCase().includes(q) && !item.noiDung.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const grouped = NHOM_CV.map(n => ({
    nhom: n,
    items: filtered.filter(i => i.nhom === n.ma),
  })).filter(g => g.items.length > 0);

  return (
    <div>
      <div style={{background:'#EAF2F7', color:'#1B6FA8', fontSize:12, padding:'9px 12px', borderRadius:9, marginBottom:14, lineHeight:1.4}}>
        Danh mục tổng hợp toàn bộ nội dung công việc của Phòng Kế hoạch Tổng hợp, kèm người phụ trách hiện tại.
        {!isAdmin && ' Nhân viên chỉ xem, không chỉnh sửa được nội dung này.'}
      </div>
      <div style={{display:'flex', gap:8, marginBottom:14, flexWrap:'wrap'}}>
        <div style={{position:'relative', flex:'1 1 160px'}}>
          <Search size={15} style={{position:'absolute', left:10, top:10, color:'#A89B85'}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm nội dung công việc..."
            style={{width:'100%', padding:'8px 10px 8px 32px', borderRadius:9, border:'1px solid #E3DACB', fontSize:13.5, background:'#fff'}}/>
        </div>
        <SelectBox value={filterNhom} onChange={setFilterNhom} options={[{ma:'all', ten:'Tất cả nhóm'}, ...NHOM_CV]} getLabel={o=>o.ma==='all'?o.ten:`${o.ma} · ${o.ten}`} getValue={o=>o.ma} minWidth={140}/>
        {isAdmin && (
          <button className="btn" onClick={()=>{ setEditingItem(null); setShowForm(true); }}
            style={{display:'flex', alignItems:'center', gap:6, background:NAVY, color:'#fff', padding:'8px 14px', borderRadius:9, fontWeight:700, fontSize:13, whiteSpace:'nowrap'}}>
            <Plus size={15}/> Thêm công việc
          </button>
        )}
      </div>

      {grouped.length === 0 ? (
        <div className="card" style={{padding:'24px 14px', fontSize:12.5, color:'#A89B85', textAlign:'center'}}>Không tìm thấy nội dung phù hợp</div>
      ) : (
        grouped.map(g => (
          <div key={g.nhom.ma} className="card" style={{overflow:'hidden', marginBottom:12}}>
            <div style={{background:'#F1F0EB', padding:'10px 14px', fontSize:12.5, fontWeight:700, color:'#20242B'}}>
              {g.nhom.ma} · {g.nhom.ten}
            </div>
            {g.items.map(item => (
              <div key={item.id} style={{padding:'12px 14px', borderTop:'1px solid #F0EDE3', display:'flex', gap:10, alignItems:'flex-start'}}>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:13, fontWeight:700, color:'#20242B'}}>
                    {item.ma && <span style={{color:SKY_DEEP, marginRight:6}}>{item.ma}</span>}{item.ten}
                  </div>
                  {item.noiDung && <div style={{fontSize:11.5, color:'#6b6258', marginTop:4, lineHeight:1.5}}>{item.noiDung}</div>}
                  <div style={{marginTop:6, display:'flex', flexDirection:'column', gap:2}}>
                    <div style={{fontSize:11, color: item.phuTrach ? '#1B6FA8' : '#A89B85', fontWeight:600}}>
                      Người phụ trách chính: {item.phuTrach || 'Chưa phân công'}
                    </div>
                    <div style={{fontSize:11, color: item.phoiHop ? '#6b6258' : '#A89B85'}}>
                      Người phụ trách: {item.phoiHop || 'Không có'}
                    </div>
                  </div>
                </div>
                {isAdmin && (
                  <div style={{display:'flex', gap:6, flexShrink:0}}>
                    <button className="btn" onClick={()=>{ setEditingItem(item); setShowForm(true); }} title="Sửa"
                      style={{background:'#F3F0EA', color:'#6b6258', width:28, height:28, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center'}}>
                      <Pencil size={13}/>
                    </button>
                    <button className="btn" onClick={()=>{ if (window.confirm('Xoá nội dung công việc này?')) onDelete(item.id); }} title="Xoá"
                      style={{background:'#F3F0EA', color:RED, width:28, height:28, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center'}}>
                      <Trash2 size={13}/>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))
      )}

      {showForm && isAdmin && (
        <CatalogItemForm
          initial={editingItem}
          onCancel={()=>{ setShowForm(false); setEditingItem(null); }}
          onSave={(item)=>{ onUpsert(item); setShowForm(false); setEditingItem(null); }}
        />
      )}
    </div>
  );
}

function TaskForm({ initial, prefill, phuTrachList, isAdmin, staffName, deXuatMode, onCancel, onSave }) {
  const [ten, setTen] = useState(initial?.ten || prefill?.ten || '');
  const [nhom, setNhom] = useState(initial?.nhom || prefill?.nhom || NHOM_CV[0].ma);
  const deXuat = !isAdmin && !initial && !!deXuatMode; // cố định theo nút nhân viên đã bấm
  const [phuTrach, setPhuTrach] = useState(initial?.phuTrach || (!isAdmin ? staffName : ''));
  const [uuTien, setUuTien] = useState(initial?.uuTien || 'Trung bình');
  const [hanHoanThanh, setHanHoanThanh] = useState(initial?.hanHoanThanh || todayISO());
  const [trangThai, setTrangThai] = useState(initial?.trangThai || 'Chưa bắt đầu');
  const [ghiChu, setGhiChu] = useState(initial?.ghiChu || '');
  const [riengTu, setRiengTu] = useState(initial?.riengTu || false);
  const [error, setError] = useState('');
  const isCompletingPending = isAdmin && initial?.choGiaoViec;

  const submit = () => {
    if (!ten.trim()) { setError('Vui lòng nhập tên công việc'); return; }
    if (!deXuat && !phuTrach.trim()) { setError('Vui lòng nhập người phụ trách'); return; }
    if (deXuat) {
      onSave({ ten: ten.trim(), nhom, phuTrach: '', uuTien: 'Trung bình', hanHoanThanh: todayISO(), trangThai: 'Chưa bắt đầu', ghiChu, riengTu:false, choGiaoViec:true, deXuatBoi: staffName });
    } else {
      onSave({ ten: ten.trim(), nhom, phuTrach: phuTrach.trim(), uuTien, hanHoanThanh, trangThai, ghiChu, riengTu: !isAdmin ? riengTu : false });
    }
  };

  const formTitle = isCompletingPending ? 'Giao việc đang chờ' : deXuat ? 'Chờ giao việc' : initial ? 'Sửa công việc' : (isAdmin ? 'Giao việc mới' : 'Thêm việc');
  const submitLabel = isCompletingPending ? 'Xác nhận giao việc' : initial ? 'Lưu thay đổi' : (isAdmin ? 'Giao việc này' : (deXuat ? 'Gửi đề xuất' : 'Thêm vào bảng theo dõi'));

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(18,37,72,0.45)', display:'flex', alignItems:'flex-end', zIndex:40, animation:'fadeIn .15s ease'}}
      onClick={onCancel}>
      <div onClick={e=>e.stopPropagation()} style={{background:BG, width:'100%', maxHeight:'88vh', overflowY:'auto', borderRadius:'20px 20px 0 0', padding:'18px 18px 26px', animation:'slideUp .2s ease'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
          <h2 style={{margin:0, fontSize:17, fontWeight:800, fontFamily:'Georgia, serif', color:NAVY}}>{formTitle}</h2>
          <button className="btn" onClick={onCancel} style={{background:'#F0EBE0', width:30, height:30, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center'}}><X size={16}/></button>
        </div>

        {isCompletingPending && (
          <div style={{background:'#FBEAEA', color:RED, fontSize:12, padding:'9px 12px', borderRadius:9, marginBottom:14, lineHeight:1.4}}>
            Nội dung này do nhân viên đề xuất. Thu chọn người phụ trách, mức ưu tiên và hạn để chính thức giao việc.
          </div>
        )}

        {!isAdmin && !initial && (
          <div style={{background: deXuat ? '#FBEAEA' : '#EAF2F7', color: deXuat ? RED : '#1B6FA8', fontSize:12, padding:'9px 12px', borderRadius:9, marginBottom:14, lineHeight:1.4}}>
            {deXuat
              ? 'Nội dung sẽ hiện trong mục "Chờ giao việc" của Quản lý. Quản lý sẽ chọn người phụ trách và giao chính thức.'
              : 'Công việc do tự người được giao cập nhật để quản lý theo dõi.'}
          </div>
        )}

        <Field label="Tên công việc">
          <input value={ten} onChange={e=>setTen(e.target.value)} placeholder="VD: Báo cáo thống kê tuần 34"
            style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:14}}/>
        </Field>

        <Field label="Nhóm công việc">
          <select value={nhom} onChange={e=>setNhom(e.target.value)}
            style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:13.5, background:'#fff'}}>
            {NHOM_CV.map(n => <option key={n.ma} value={n.ma}>{n.ma} · {n.ten}</option>)}
          </select>
        </Field>

        {!deXuat && (
          <Field label="Người phụ trách">
            {isAdmin ? (
              <>
                <input value={phuTrach} onChange={e=>setPhuTrach(e.target.value)} placeholder="VD: ThS. Lê Thanh Tâm" list="staff-list"
                  style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:14}}/>
                <datalist id="staff-list">{phuTrachList.map(p => <option key={p} value={p}/>)}</datalist>
              </>
            ) : (
              <div style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:14, background:'#F3F0EA', color:'#6b6258'}}>
                {phuTrach}
              </div>
            )}
          </Field>
        )}

        {!deXuat && (
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
            <Field label="Mức ưu tiên">
              <select value={uuTien} onChange={e=>setUuTien(e.target.value)}
                style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:13.5, background:'#fff'}}>
                {MUC_UU_TIEN.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Hạn hoàn thành">
              <input type="date" value={hanHoanThanh} onChange={e=>setHanHoanThanh(e.target.value)}
                style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:13.5}}/>
            </Field>
          </div>
        )}

        {!deXuat && (
          <Field label="Trạng thái ban đầu">
            <div style={{display:'flex', gap:8}}>
              {TRANG_THAI.map(s => (
                <button key={s} className="btn" onClick={()=>setTrangThai(s)}
                  style={{flex:1, padding:'9px 6px', borderRadius:9, fontSize:12, fontWeight:600,
                    background: trangThai===s ? COLOR_TRANGTHAI[s] : '#F0EBE0',
                    color: trangThai===s ? '#fff' : '#6b6258'}}>
                  {s}
                </button>
              ))}
            </div>
          </Field>
        )}

        <Field label="Ghi chú (không bắt buộc)">
          <textarea value={ghiChu} onChange={e=>setGhiChu(e.target.value)} rows={2}
            style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:13.5, resize:'vertical'}}/>
        </Field>

        {!isAdmin && !deXuat && (
          <button type="button" className="btn" onClick={()=>setRiengTu(v=>!v)}
            style={{width:'100%', display:'flex', alignItems:'center', gap:10, padding:'11px 12px', borderRadius:9, background: riengTu ? '#FBEAEA' : '#F3F0EA', border: riengTu ? `1px solid ${RED}` : '1px solid transparent', marginBottom:14, textAlign:'left'}}>
            <div style={{width:18, height:18, borderRadius:5, border: `2px solid ${riengTu ? RED : '#B8ADA0'}`, background: riengTu ? RED : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
              {riengTu && <Check size={12} color="#fff"/>}
            </div>
            <div>
              <div style={{fontSize:13, fontWeight:600, color: riengTu ? RED : '#20242B'}}>Chỉ mình tôi xem</div>
              <div style={{fontSize:11, color:'#8a8072', marginTop:1}}>Ẩn việc này khỏi màn hình Quản lý</div>
            </div>
          </button>
        )}

        {error && <div style={{color:RED, fontSize:12.5, marginBottom:10}}>{error}</div>}

        <button className="btn" onClick={submit}
          style={{width:'100%', padding:13, borderRadius:11, background:NAVY, color:'#fff', fontWeight:700, fontSize:14.5, marginTop:4}}>
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{marginBottom:12}}>
      <div style={{fontSize:11.5, fontWeight:600, color:'#8a8072', marginBottom:5}}>{label}</div>
      {children}
    </div>
  );
}
