# PROMPT XÂY DỰNG WEBSITE + TRANG QUẢN TRỊ — MEKONG English AI

> Cách dùng: copy toàn bộ phần **"PROMPT"** bên dưới dán vào công cụ AI tạo website (Lovable, Bolt, v0, Cursor, Claude, ChatGPT…). Nếu công cụ giới hạn độ dài, dùng lần lượt các **Prompt theo giai đoạn** ở cuối tài liệu.

---

## PROMPT

### 0. Vai trò & mục tiêu

Bạn là đội ngũ Senior Full-stack Engineer + Product Designer + Chuyên gia EdTech. Hãy xây dựng **hoàn chỉnh** nền tảng học tiếng Anh trực tuyến **MEKONG English AI** của **Công ty TNHH Công nghệ Mekong Green AI**, gồm:

1. **Website công khai** (marketing + bán khoá học + đăng ký học thử).
2. **Ứng dụng học (Web App / PWA, ưu tiên mobile)** cho học sinh, phụ huynh, giáo viên.
3. **Trang quản trị (Admin CMS)** cho công ty quản lý nội dung, người dùng, đơn hàng, lịch học trực tiếp, báo cáo.

Mô hình kinh doanh cốt lõi:
- **Video bài giảng quay sẵn** (làm 1 lần, dùng nhiều lần) + bài tập tương tác + luyện nói với Gia sư AI → bán theo gói thuê bao / theo trường.
- **Phiên luyện nói trực tiếp với giáo viên (Live Speaking)** 1-1 hoặc nhóm nhỏ → **trả phí thêm** (mua lẻ theo buổi hoặc gói buổi).

Tham khảo cấu trúc (KHÔNG sao chép nội dung, hình ảnh, thương hiệu):
- **kynaenglish.vn**: hero rõ ràng + CTA "Học thử miễn phí", gia sư AI, cá nhân hoá, báo cáo tiến độ cho phụ huynh, kết hợp giáo viên thật, đội ngũ giáo viên, cảm nhận phụ huynh, bảng giá, form tư vấn nổi.
- **tienganh123.com (mobile)**: kho bài học lớn phân theo **lớp / chương trình SGK**, video bài giảng + bài tập ngay sau video, gói thành viên VIP, điều hướng đơn giản theo khối lớp, trò chơi ôn từ vựng, bảng xếp hạng.

### 1. Thông tin thương hiệu

- Tên thương mại: **MEKONG English AI**
- Đơn vị: Công ty TNHH Công nghệ Mekong Green AI (cùng hệ sinh thái SmartTourism AI, Coop360, TraceHub)
- Định vị: **"Mỗi ngày 15 phút, học điều gần gũi, luyện nói có hướng dẫn và nhìn thấy tiến bộ."**
- Slogan: **"Học gần gũi – Nói tự tin – Dùng được mỗi ngày."**
- Địa bàn trọng tâm: **tỉnh An Giang** (Châu Đốc, Long Xuyên, Trà Sư, Núi Sam, Hà Tiên, Phú Quốc…)
- Đối tượng ưu tiên: học sinh **THCS lớp 6–7**; mở rộng sinh viên, người làm du lịch – dịch vụ, người mới bắt đầu.
- Ngôn ngữ giao diện: **Tiếng Việt** (mặc định) + English (chuyển đổi i18n).

**Phong cách thiết kế**
- Cảm hứng: sông nước Mekong, lúa xanh, thân thiện, trẻ trung, tin cậy (không trẻ con quá).
- Màu chính: Xanh lá Mekong `#0F9D58` / Xanh ngọc `#0EA5A4`; màu nhấn: Vàng lúa `#F5B700`; màu cảnh báo/CTA phụ: Cam phù sa `#F97316`; nền `#F8FAF9`; chữ `#0F172A`.
- Font: **Be Vietnam Pro** (hỗ trợ tiếng Việt tốt), tiêu đề đậm, bo góc 16px, bóng nhẹ, minh hoạ phẳng.
- Mobile-first, nút lớn (≥ 44px), độ tương phản đạt WCAG AA, tối giản chữ, nhiều biểu tượng.
- Tối ưu cho mạng yếu & máy cấu hình thấp: ảnh WebP/AVIF, lazy-load, Lighthouse mobile ≥ 90.

### 2. Vai trò người dùng (RBAC)

| Vai trò | Quyền chính |
|---|---|
| Khách (Guest) | Xem website, xem video học thử, đăng ký tư vấn / học thử |
| Học viên (Student) | Học bài, xem video, làm bài tập, luyện nói AI, nhiệm vụ thực tế, đặt lịch Live Speaking, xem tiến bộ |
| Phụ huynh (Parent) | Liên kết tài khoản con, xem báo cáo tuần, thanh toán, đồng ý thu thập giọng nói |
| Giáo viên trường (Teacher) | Tạo lớp, mã lớp/QR, giao bài, xem dashboard lớp, sửa phản hồi AI, chấm nhiệm vụ thực tế |
| Giáo viên Live (Tutor) | Khai báo lịch rảnh, dạy phiên trực tiếp, ghi nhận xét sau buổi, xem thu nhập |
| Quản trị trường (School Admin) | Quản lý giáo viên/học sinh của trường, xem báo cáo trường, quản lý license |
| Biên tập học liệu (Content Editor) | Soạn / duyệt bài học, video, tình huống, ngân hàng câu hỏi |
| Kế toán / CSKH (Sales & Support) | Đơn hàng, hoá đơn, mã giảm giá, lead, ticket hỗ trợ |
| Super Admin | Toàn quyền, cấu hình hệ thống, phân quyền, nhật ký |

---

### 3. WEBSITE CÔNG KHAI (Public Site)

**Header:** Logo · Khoá học (mega menu: English School / English Career / English Community) · Luyện nói trực tiếp · Dành cho Nhà trường · Bảng giá · Blog · Đăng nhập · **[Học thử miễn phí]** (nút nổi bật).
Mobile: menu hamburger + thanh CTA cố định đáy màn hình "Học thử miễn phí | Gọi tư vấn".

#### 3.1 Trang chủ `/`
1. **Hero**: tiêu đề "Mỗi ngày 15 phút – Nói tiếng Anh tự tin từ những điều gần gũi"; mô tả ngắn; 2 CTA: "Học thử miễn phí" + "Xem video giới thiệu"; minh hoạ học sinh nói chuyện với gia sư AI trên điện thoại, nền Trà Sư / sông nước.
2. **Dải số liệu**: số bài học, số tình huống giao tiếp, số trường thí điểm, số học viên (lấy từ CMS, có thể ẩn khi chưa có số thật).
3. **Buổi học 15 phút hoạt động thế nào** (timeline 5 bước có icon):
   2' Ôn lại → 3' Xem & nghe → 6' Luyện nói với AI → 3' Sửa lỗi & nói lại → 1' Xem kết quả.
4. **5 điểm khác biệt** (card):
   - Học từ điều quen thuộc (trường học, chợ nổi, món ăn, nông sản, điểm du lịch An Giang – giáo viên thẩm định)
   - AI điều chỉnh mức trợ giúp (gợi ý → khung câu → hội thoại tự nhiên)
   - Luyện nói để giao tiếp hiểu được (mỗi lượt sửa 1–2 lỗi, không gây áp lực)
   - Học được khi mạng yếu (tải trước bài, ghi âm gửi sau)
   - Nhiệm vụ thực tế (giới thiệu địa điểm, hỏi đường, trình bày sản phẩm)
5. **3 gói sản phẩm**: English School · English Career · English Community (card + nút "Xem chi tiết").
6. **Thư viện video bài giảng**: lưới video nổi bật theo lớp 6 / lớp 7 / chủ đề; một số video gắn nhãn "Miễn phí".
7. **Luyện nói trực tiếp với giáo viên (trả phí thêm)**: giới thiệu 1-1 và nhóm 3–5 bạn, 25 phút/buổi, nút "Đặt lịch".
8. **Demo bài học mẫu "Giới thiệu Rừng tràm Trà Sư"**: ảnh + ví dụ mức trợ giúp cho người mới / người khá + nút "Thử nói ngay" (demo ghi âm trên web).
9. **Dành cho phụ huynh**: mẫu báo cáo tuần ("Con đã luyện 4 buổi, có thể giới thiệu bản thân; cần luyện thêm cách đặt câu hỏi.").
10. **Dành cho nhà trường**: cổng giáo viên, mã lớp/QR, báo cáo lớp → CTA "Đăng ký thí điểm cho trường".
11. **Đội ngũ giáo viên** (slider hồ sơ giáo viên Live).
12. **Cảm nhận** học sinh / phụ huynh / giáo viên (quản lý trong CMS).
13. **Bảng giá rút gọn** + link tới `/bang-gia`.
14. **FAQ** (accordion).
15. **Form đăng ký tư vấn / học thử**: Họ tên, SĐT, vai trò (phụ huynh/học sinh/giáo viên/trường/doanh nghiệp), lớp, tỉnh/thành → lưu Lead vào Admin, gửi thông báo Zalo/Email.
16. **Footer**: thông tin công ty, MST, địa chỉ, hotline, Zalo OA, Facebook, YouTube, chính sách bảo mật, điều khoản, chính sách bảo vệ dữ liệu trẻ em, link hệ sinh thái SmartTourism AI / Coop360 / TraceHub.
17. **Nút nổi**: Zalo chat, gọi điện, Messenger.

#### 3.2 Các trang khác
- `/khoa-hoc` — danh mục khoá học, lọc theo gói / lớp / chủ đề / trình độ (A0–B1) / miễn phí–trả phí.
- `/khoa-hoc/[slug]` — chi tiết khoá: video giới thiệu, mục tiêu đầu ra, giáo trình (chương → bài, hiển thị bài học thử), số bài, thời lượng, giáo viên, đánh giá, giá, nút "Mua khoá học" / "Học thử".
- `/english-school` — trang gói học sinh THCS lớp 6–7, bám SGK (Global Success…), lợi ích cho trường – giáo viên – phụ huynh.
- `/english-career` — tiếng Anh du lịch, nhà hàng, lưu trú, bán hàng, giới thiệu sản phẩm OCOP/nông sản.
- `/english-community` — người mới bắt đầu, hướng dẫn bằng tiếng Việt.
- `/luyen-noi-truc-tiep` — giới thiệu Live Speaking, danh sách giáo viên (lọc theo giờ rảnh, giới tính, chuyên môn), lịch trống, gói buổi, quy trình đặt – học – nhận nhận xét.
- `/giao-vien/[slug]` — hồ sơ giáo viên: video giới thiệu, chứng chỉ, đánh giá, lịch trống, đặt lịch.
- `/nha-truong` — giải pháp cho trường/trung tâm/doanh nghiệp: tính năng cổng giáo viên, quy trình thí điểm 12 tuần, chỉ số đo lường, form đặt lịch demo.
- `/bang-gia` — bảng giá (xem mục 6).
- `/kiem-tra-trinh-do` — bài test đầu vào 10 phút (trắc nghiệm + 2 câu nói) → gợi ý lộ trình & khoá phù hợp → thu lead.
- `/blog` + `/blog/[slug]` — mẹo học, tiếng Anh về An Giang, tin tức thí điểm (SEO).
- `/gioi-thieu`, `/lien-he`, `/faq`, `/chinh-sach-bao-mat`, `/dieu-khoan`, `/bao-ve-du-lieu-tre-em`.
- `/dang-nhap`, `/dang-ky`, `/quen-mat-khau`, `/vao-lop` (nhập **mã lớp** hoặc **quét QR**).

SEO: SSR/SSG, meta & Open Graph động, schema.org (`Course`, `Organization`, `FAQPage`, `VideoObject`), sitemap.xml, robots.txt, URL tiếng Việt không dấu.

---

### 4. ỨNG DỤNG HỌC (Learner App – PWA, mobile-first)

**Màn hình chính chỉ có 4 mục** (bottom navigation):
**Học hôm nay · Luyện nói · Nhiệm vụ thực tế · Tiến bộ của tôi** (+ avatar góc trên: hồ sơ, Live Speaking, gói của tôi, đăng xuất).

#### 4.1 Học hôm nay
- Một nút lớn "Bắt đầu buổi học 15 phút" → chạy tuần tự 5 bước có thanh tiến trình & đồng hồ:
  1. **Ôn lại (2')**: câu hỏi/từ/mẫu câu còn yếu (spaced repetition).
  2. **Xem & nghe (3')**: video bài giảng ngắn hoặc hình ảnh + hội thoại; nút **nghe chậm (0.75x)**, **nghe lại**, **phụ đề EN/VI**, **gợi ý tiếng Việt**.
  3. **Luyện nói với AI (6')**: nhiệm vụ có gợi ý theo mức trợ giúp.
  4. **Sửa lỗi & nói lại (3')**: nghe mẫu, giải thích ngắn bằng tiếng Việt, nói lại.
  5. **Kết quả (1')**: "Hôm nay em đã làm được…", "Ngày mai cần luyện…", streak, sao/XP.
- Danh sách bài do giáo viên giao + lộ trình khoá học (chương → bài; khoá bài chưa mở).

#### 4.2 Thư viện video (Video bài giảng)
- Phân theo **Gói → Lớp/Cấp độ → Chủ đề → Bài**.
- Trình phát video: HLS adaptive bitrate, chọn chất lượng (360p/480p/720p), tốc độ, phụ đề VTT song ngữ, ghi nhớ vị trí xem, đánh dấu đã xem ≥ 80%.
- Dưới video: từ vựng, mẫu câu, bài tập tương tác (trắc nghiệm, nối, điền từ, sắp xếp câu, nghe chọn đáp án, nói lặp lại).
- **Tải về xem offline** (PWA, mã hoá/giới hạn trong app), đồng bộ kết quả khi có mạng.
- Bảo vệ nội dung: signed URL có hạn, watermark động (tên/email người học), chặn tải trực tiếp, giới hạn số thiết bị đăng nhập.

#### 4.3 Luyện nói (Gia sư AI)
- Chọn tình huống (30 tình huống: giới thiệu bản thân, hỏi đường ở Châu Đốc, mua hàng ở chợ nổi, giới thiệu món bánh xèo / mắm Châu Đốc, giới thiệu Trà Sư, Núi Sam…).
- **3 mức trợ giúp (scaffolding) tự điều chỉnh**:
  - Mức 1: nghe mẫu + từ khoá + khung câu đầy đủ.
  - Mức 2: chỉ từ khoá gợi ý.
  - Mức 3: hội thoại tự nhiên, AI hỏi thêm câu mở rộng.
  - Quy tắc: đạt ngưỡng 2 lượt liên tiếp → giảm trợ giúp; không đạt → tăng trợ giúp.
- Luồng: bấm giữ để nói → STT → AI đánh giá **ý nghĩa, độ rõ, từ vựng, cấu trúc** → phản hồi ngắn, **chỉ sửa 1–2 lỗi quan trọng nhất**, lời khen cụ thể → TTS đọc câu mẫu → nói lại.
- Giới hạn an toàn cho trẻ vị thành niên: AI chỉ hội thoại trong phạm vi chủ đề bài học (system prompt khoá chủ đề + bộ lọc nội dung); học sinh **không phải tự viết câu lệnh cho AI**.
- Chế độ mạng yếu: ghi âm lưu cục bộ (IndexedDB) → tự gửi chấm khi có mạng; hội thoại AI trực tiếp chỉ bật khi kết nối đủ.

#### 4.4 Nhiệm vụ thực tế
- Sau mỗi chủ đề: ghi âm/ghi hình giới thiệu một địa điểm gần nhà, hỏi đường, trình bày sản phẩm, hội thoại cặp với bạn.
- **Tình huống mới chưa luyện nguyên mẫu** (đo khả năng vận dụng).
- AI chấm sơ bộ theo rubric → giáo viên xem & chấm/sửa phản hồi → học sinh nhận nhận xét.

#### 4.5 Tiến bộ của tôi
- Streak, số buổi/tuần, phút học, video đã xem, kỹ năng (nghe – nói – từ vựng – ngữ pháp) dạng radar, mức trợ giúp hiện tại theo chủ đề, huy hiệu, lịch sử bản ghi nói (nghe lại trước–sau).
- Bảng xếp hạng lớp (có thể tắt bởi giáo viên).

#### 4.6 Live Speaking (trả phí thêm)
- Xem giáo viên & lịch trống → chọn hình thức 1-1 / nhóm (3–5 HS) → chọn khung 25 phút → thanh toán hoặc trừ buổi trong gói.
- Phòng học trực tuyến nhúng trong web (LiveKit/Jitsi/Daily) hoặc link Zoom/Google Meet; nhắc lịch qua Email/Zalo/Push trước 24h & 15'.
- Sau buổi: giáo viên ghi nhận xét theo rubric + bài luyện gợi ý; học viên đánh giá giáo viên (1–5 sao).
- Chính sách huỷ/đổi lịch (trước 12h hoàn buổi), xử lý giáo viên vắng (hoàn buổi + bồi thường).

#### 4.7 Đăng nhập & thiết bị dùng chung
- Đăng nhập: SĐT/OTP, email, Google, Zalo; học sinh vào lớp bằng **mã lớp hoặc QR**.
- **Chế độ phòng máy**: tài khoản cá nhân, nút **Đăng xuất** luôn hiển thị, tự đăng xuất sau 15 phút không hoạt động, không lưu mật khẩu trên máy dùng chung.

### 5. CỔNG PHỤ HUYNH & CỔNG GIÁO VIÊN (trong app)

**Phụ huynh**
- Liên kết nhiều con; báo cáo tuần ngắn gọn (số buổi, kỹ năng đã làm được, cần luyện thêm), nghe bản ghi tiến bộ (nếu đã đồng ý).
- Quản lý **đồng ý thu thập & lưu giọng nói** (bật/tắt, thời hạn lưu, yêu cầu xoá).
- Mua gói, mua buổi Live, xem hoá đơn. Nhận báo cáo qua Email/Zalo ZNS.

**Giáo viên trường** — dashboard thật gọn, 3 thông tin chính trên màn hình đầu:
1. **Ai chưa tham gia** (tuần này).
2. **Nhóm đang gặp lỗi gì** (top lỗi phổ biến của lớp).
3. **Ai cần hỗ trợ thêm** (cảnh báo sớm).
- Tạo lớp, sinh mã lớp & QR, nhập học sinh bằng Excel, in thẻ đăng nhập.
- Chọn chủ đề → giao bài (hạn nộp), xem tiến độ từng học sinh.
- Hệ thống **đề xuất hoạt động cho buổi học tiếp theo**; giáo viên được sửa phản hồi AI và điều chỉnh bài.
- Chấm nhiệm vụ thực tế theo rubric; chấm đánh giá nói trước–sau ở chế độ **ẩn danh nhóm (blind)**.
- Xuất báo cáo lớp (PDF/Excel).

---

### 6. GÓI SẢN PHẨM & BẢNG GIÁ (cấu hình được trong Admin)

| Gói | Nội dung | Hình thức bán |
|---|---|---|
| **Miễn phí** | 1 khoá học thử, 3 video/chủ đề, 5 lượt luyện nói AI/ngày | Tài khoản cá nhân |
| **Video Premium** | Toàn bộ thư viện video + bài tập + tải offline | Tháng / 6 tháng / năm |
| **AI Premium** | Video Premium + luyện nói AI không giới hạn hợp lý (fair-use) + nhiệm vụ thực tế + báo cáo phụ huynh | Tháng / 6 tháng / năm |
| **Live Speaking (add-on)** | Phiên 25' với giáo viên: 1-1 hoặc nhóm | Mua lẻ / gói 4–8–12–24 buổi |
| **School License** | License theo số học sinh/năm, cổng giáo viên, tập huấn, hỗ trợ, báo cáo kết quả | Hợp đồng B2B (báo giá) |
| **Career / Doanh nghiệp** | English Career cho nhân viên du lịch – dịch vụ | Hợp đồng B2B (báo giá) |

- Giá hiển thị là **placeholder**, chỉnh trong Admin (giá gốc, giá khuyến mãi, thời hạn, quyền lợi).
- Mã giảm giá, combo, giới thiệu bạn bè (referral), dùng thử 7 ngày.
- Thanh toán: **VNPay, MoMo, ZaloPay, chuyển khoản QR (VietQR) tự đối soát**, thẻ quốc tế (Stripe – tuỳ chọn). Xuất hoá đơn điện tử (tích hợp sau).

---

### 7. TRANG QUẢN TRỊ (Admin CMS) — `/admin`

Layout: sidebar trái có nhóm menu, header có tìm kiếm toàn cục, thông báo, chuyển ngôn ngữ, hồ sơ. Bảng dữ liệu có lọc/sắp xếp/phân trang/xuất Excel, thao tác hàng loạt. Mọi thao tác ghi **audit log**.

#### 7.1 Tổng quan (Dashboard)
- Doanh thu (ngày/tuần/tháng, theo gói, theo kênh thanh toán), đơn hàng mới, học viên mới, học viên hoạt động (DAU/WAU/MAU), tỷ lệ giữ chân, số phiên Live hôm nay, lead mới.
- **Chỉ số thí điểm**: % tự mở & bắt đầu bài sau 1 lần hướng dẫn (mục tiêu ≥ 85%); % hoàn thành ≥ 3 buổi/tuần trong 8/12 tuần (mục tiêu ≥ 65%); **chi phí AI + hạ tầng + hỗ trợ / người học hoạt động**.
- Biểu đồ (line, bar, funnel: truy cập → đăng ký → học thử → trả phí).

#### 7.2 Quản lý học liệu
- **Khoá học**: CRUD, gói, lớp/cấp độ, ảnh bìa, mô tả, mục tiêu, giá, trạng thái (nháp / chờ duyệt / đã xuất bản), thứ tự.
- **Chương & Bài học**: kéo-thả sắp xếp; loại bài: video, bài tập, luyện nói AI, nhiệm vụ thực tế, buổi học 15 phút (ghép 5 bước); đánh dấu "học thử miễn phí".
- **Video**: upload trực tiếp (resumable/chunk) lên dịch vụ video (Bunny Stream / Cloudflare Stream / Mux), tự transcode HLS, thumbnail, phụ đề VTT (upload hoặc tự sinh bằng AI rồi sửa), thời lượng, thống kê lượt xem & tỷ lệ xem hết.
- **Ngân hàng câu hỏi**: nhiều dạng (trắc nghiệm, điền từ, nối, sắp xếp, nghe chọn, nói lặp lại), gắn thẻ kỹ năng/chủ đề/độ khó, nhập từ Excel.
- **Tình huống hội thoại AI**: tên, chủ đề, ảnh bối cảnh (VD: Trà Sư), mục tiêu giao tiếp, từ khoá, khung câu cho 3 mức trợ giúp, câu mở rộng cho người khá, **system prompt cho AI**, phạm vi chủ đề cho phép, rubric chấm, ngưỡng tăng/giảm trợ giúp. Có nút **"Chạy thử"**.
- **Nhiệm vụ thực tế & Rubric**: tiêu chí, thang điểm, mô tả mức.
- **Thư viện học liệu địa phương**: ảnh, audio, câu chuyện về trường học, chợ, món ăn, nông sản, điểm du lịch An Giang; trường **nguồn & quyền sử dụng/bản quyền**; trạng thái **giáo viên thẩm định**. Tuỳ chọn đồng bộ nội dung được phép từ SmartTourism AI / Coop360 / TraceHub (API).
- Quy trình duyệt nội dung: Biên tập → Giáo viên thẩm định → Xuất bản, có lịch sử phiên bản.

#### 7.3 Live Speaking
- **Giáo viên Live**: hồ sơ, video giới thiệu, chứng chỉ, chuyên môn, đơn giá/buổi, tỷ lệ chia sẻ doanh thu, trạng thái duyệt, điểm đánh giá.
- **Lịch rảnh & lịch dạy** (calendar view tuần/tháng), tạo lớp nhóm, gán giáo viên thay thế.
- **Booking**: danh sách buổi (sắp tới / đã học / huỷ / vắng), đổi lịch, hoàn buổi, link phòng học, nhận xét sau buổi.
- **Gói buổi**: số buổi còn lại của học viên, hạn sử dụng.
- **Đối soát & thanh toán giáo viên** theo tháng (xuất bảng lương).

#### 7.4 Người dùng & Tổ chức
- Học viên, phụ huynh, giáo viên, nhân sự nội bộ: tìm kiếm, khoá/mở, đặt lại mật khẩu, đăng nhập thay (impersonate – có ghi log), gán gói thủ công.
- **Trường / Trung tâm / Doanh nghiệp**: thông tin, license (số chỗ, thời hạn), danh sách lớp, quản trị trường, báo cáo.
- **Lớp học**: mã lớp, QR, giáo viên phụ trách, sĩ số, nhóm **thực nghiệm / đối chứng** (phục vụ đánh giá thí điểm).
- **Phân quyền (RBAC)**: tạo vai trò, tick quyền theo module (xem/tạo/sửa/xoá/xuất).

#### 7.5 Bán hàng & Tài chính
- Gói dịch vụ & bảng giá, mã giảm giá, chương trình khuyến mãi, referral.
- Đơn hàng (trạng thái: chờ thanh toán / đã thanh toán / huỷ / hoàn tiền), giao dịch theo cổng, đối soát chuyển khoản, hoàn tiền.
- Hợp đồng B2B: báo giá, hợp đồng, thời hạn, công nợ.

#### 7.6 CRM & Hỗ trợ
- **Lead** từ form website/test trình độ: nguồn (UTM), trạng thái (mới / đã gọi / hẹn học thử / chốt / huỷ), người phụ trách, ghi chú, nhắc lịch gọi.
- Ticket hỗ trợ, phản hồi người dùng.
- Gửi thông báo: Email, Zalo ZNS, Push, in-app; mẫu thông báo; gửi báo cáo tuần cho phụ huynh tự động (cron thứ Bảy/Chủ nhật).

#### 7.7 Website CMS
- Quản lý banner hero, các section trang chủ (bật/tắt, sắp xếp), số liệu nổi bật, cảm nhận, FAQ, đội ngũ giáo viên hiển thị, đối tác/trường.
- Blog: bài viết (editor rich-text), danh mục, thẻ, SEO (title, description, slug, OG image), lên lịch đăng.
- Trang tĩnh (giới thiệu, chính sách…), menu header/footer, thông tin liên hệ, mã tracking (GA4, Facebook Pixel, Google Tag Manager).

#### 7.8 AI & Chi phí
- Cấu hình nhà cung cấp AI (STT, LLM hội thoại, TTS, chấm phát âm) – có thể đổi provider qua lớp adapter.
- Giới hạn lượt/ngày theo gói, fair-use, ngưỡng cảnh báo chi phí.
- Thống kê **token / phút audio / chi phí theo người học, theo lớp, theo trường**.
- **Đối chiếu AI – giáo viên**: mẫu bản ghi được chấm cả AI và giáo viên, hiển thị mức thống nhất (tỷ lệ khớp, Cohen's kappa), lọc bản ghi nhiều tiếng ồn.
- Nhật ký hội thoại (đã ẩn danh) để rà soát an toàn nội dung.

#### 7.9 Đánh giá thí điểm & Nghiên cứu
- Quản lý đợt thí điểm 12 tuần: trường, lớp, nhóm thực nghiệm/đối chứng, mốc pre-test / post-test.
- Ngân hàng **nhiệm vụ đánh giá nói tương đương** (pre/post) + nhiệm vụ **tình huống mới** (transfer).
- Phân công chấm **blind** (giáo viên không biết học sinh thuộc nhóm nào).
- Xuất dữ liệu ẩn danh (CSV) để phân tích thống kê; báo cáo hiệu quả & chi phí vận hành.

#### 7.10 Bảo mật & Dữ liệu cá nhân
- Tuân thủ **Nghị định 13/2023/NĐ-CP** về bảo vệ dữ liệu cá nhân: quản lý **đồng ý của phụ huynh** cho học sinh dưới 16 tuổi, mục đích sử dụng, **thời hạn lưu bản ghi âm** (cấu hình, tự xoá khi hết hạn), yêu cầu truy cập/xoá dữ liệu.
- Audit log, nhật ký đăng nhập, 2FA cho tài khoản quản trị, sao lưu tự động hằng ngày.
- Cấu hình hệ thống: thông tin công ty, email SMTP, cổng thanh toán, Zalo OA, lưu trữ, tên miền.

---

### 8. MÔ HÌNH DỮ LIỆU (gợi ý các bảng chính)

`users, roles, permissions, user_roles, student_profiles, parent_student_links, consents, organizations (school/center/company), licenses, classes, class_members, courses, chapters, lessons, lesson_steps, videos, subtitles, video_progress, questions, question_options, attempts, speaking_scenarios, scaffold_levels, speaking_sessions, speaking_turns (audio_url, transcript, scores, feedback, scaffold_level), real_tasks, task_submissions, rubrics, rubric_scores, skill_mastery, review_queue (spaced repetition), streaks, badges, assignments, tutors, tutor_availability, live_sessions, live_bookings, live_feedback, session_packages, plans, subscriptions, orders, order_items, payments, coupons, referrals, leads, tickets, notifications, weekly_reports, posts, pages, site_settings, media_assets (source, license, verified_by), pilot_studies, pilot_groups, assessments, assessment_scores, ai_usage_logs, audit_logs.`

### 9. KIẾN TRÚC & CÔNG NGHỆ (đề xuất)

- **Frontend**: Next.js 14+ (App Router, TypeScript), Tailwind CSS, shadcn/ui, next-intl (vi/en), PWA (next-pwa / Workbox) cho offline, Zustand/TanStack Query.
- **Backend**: Next.js Route Handlers / NestJS; **PostgreSQL** + Prisma; Redis (cache, hàng đợi BullMQ cho chấm bài nói, gửi báo cáo).
- **Auth**: Auth.js / Supabase Auth (OTP SĐT, Google, Zalo), RBAC middleware.
- **Video**: Bunny Stream hoặc Cloudflare Stream / Mux (HLS, signed URL, watermark).
- **Lưu trữ**: S3-compatible (Cloudflare R2) cho audio, ảnh.
- **AI**: lớp adapter cho STT (Whisper / Google STT / Azure Speech – có pronunciation assessment), LLM (Gemini / GPT) cho hội thoại & phản hồi, TTS giọng chuẩn; prompt template quản lý trong Admin.
- **Live**: LiveKit / Daily / Jitsi nhúng web, hoặc tích hợp Zoom/Google Meet API.
- **Thanh toán**: VNPay, MoMo, ZaloPay, VietQR (webhook đối soát).
- **Thông báo**: Email (Resend/SMTP), Zalo ZNS, Web Push.
- **Hạ tầng**: Docker, CI/CD, Vercel/VPS tại Việt Nam, CDN, Sentry, giám sát uptime.
- Kiến trúc **dùng chung một nền tảng cho 3 gói** (School/Career/Community) bằng cấu hình gói & phân quyền, dễ mở rộng app Android (Capacitor/React Native) và iOS sau.

### 10. YÊU CẦU PHI CHỨC NĂNG

- Mobile-first, chạy tốt trên Android tầm thấp & trình duyệt phòng máy; tải trang đầu < 3s trên 3G/4G.
- Offline: cache bài học/video/ảnh đã tải; hàng đợi đồng bộ ghi âm & kết quả.
- Khả năng truy cập: phông lớn, tương phản, nhãn ARIA, hỗ trợ bàn phím.
- Bảo mật: HTTPS, mã hoá dữ liệu nhạy cảm, rate limit, chống spam form (reCAPTCHA/Turnstile), OWASP Top 10.
- Có **dữ liệu mẫu (seed)**: 2 khoá (Lớp 6, Lớp 7), mỗi khoá 3 chương × 4 bài, 6 tình huống AI (gồm "Giới thiệu Rừng tràm Trà Sư"), 3 giáo viên Live, 1 trường, 2 lớp, 20 học sinh, đơn hàng và lead mẫu.

### 11. TIÊU CHÍ HOÀN THÀNH

- Khách vào trang chủ hiểu sản phẩm trong 10 giây và đăng ký học thử trong ≤ 3 bước.
- Học sinh nhập mã lớp/QR → vào học buổi 15 phút mà không cần hướng dẫn thêm.
- Mua gói Video/AI Premium và mua buổi Live Speaking thanh toán thành công, quyền truy cập được kích hoạt tự động.
- Giáo viên thấy ngay 3 thông tin: ai chưa tham gia, nhóm lỗi gì, ai cần hỗ trợ.
- Admin tạo được khoá → chương → bài → upload video → tạo tình huống AI → xuất bản, không cần lập trình.
- Báo cáo tuần phụ huynh gửi tự động; dashboard hiển thị chỉ số thí điểm & chi phí AI/người học.

Hãy bắt đầu bằng: (1) sơ đồ trang & luồng người dùng, (2) schema cơ sở dữ liệu, (3) design system, sau đó code lần lượt Website công khai → Learner App → Cổng giáo viên/phụ huynh → Admin CMS → Thanh toán & Live Speaking → AI. Viết code sạch, có comment tiếng Việt ở phần nghiệp vụ, kèm README hướng dẫn cài đặt và biến môi trường.

---

## PROMPT THEO GIAI ĐOẠN (khi công cụ giới hạn độ dài)

Dán **phần 0–2 (Vai trò, Thương hiệu, RBAC)** ở đầu mỗi prompt, sau đó thêm:

1. **Giai đoạn 1 – Website công khai**: "Xây dựng mục 3 (Website công khai) với dữ liệu mẫu, responsive, SEO, form lead lưu DB."
2. **Giai đoạn 2 – Learner App & Video**: "Xây dựng mục 4.1, 4.2, 4.5, 4.7: buổi học 15 phút, thư viện video HLS, bài tập tương tác, tiến bộ, đăng nhập mã lớp/QR, PWA offline."
3. **Giai đoạn 3 – Luyện nói AI & Nhiệm vụ thực tế**: "Xây dựng mục 4.3, 4.4 và 7.8 với adapter AI (STT/LLM/TTS), 3 mức trợ giúp tự điều chỉnh, hàng đợi ghi âm offline."
4. **Giai đoạn 4 – Cổng giáo viên & phụ huynh**: "Xây dựng mục 5 và báo cáo tuần tự động."
5. **Giai đoạn 5 – Admin CMS**: "Xây dựng mục 7.1, 7.2, 7.4, 7.6, 7.7, 7.10."
6. **Giai đoạn 6 – Bán hàng & Live Speaking**: "Xây dựng mục 4.6, 6, 7.3, 7.5: bảng giá, giỏ hàng, VNPay/MoMo/VietQR, đặt lịch giáo viên, phòng học trực tuyến, đối soát."
7. **Giai đoạn 7 – Đánh giá thí điểm**: "Xây dựng mục 7.9: nhóm thực nghiệm/đối chứng, pre/post test, chấm blind, đối chiếu AI–giáo viên, xuất dữ liệu ẩn danh."
