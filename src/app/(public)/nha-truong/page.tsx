import Link from "next/link";
import { School, CheckCircle2, ClipboardCheck, ShieldCheck } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";

export const metadata = { title: "Giải pháp cho Nhà trường & Đề án thí điểm tại An Giang" };

export default function ForSchoolsPage() {
  return (
    <div className="py-12">
      <div className="container space-y-12">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <span className="eyebrow">🏫 Đồng hành cùng Ngành Giáo dục tỉnh An Giang</span>
            <h1 className="text-3xl font-extrabold md:text-5xl">
              Giải pháp học liệu số & thí điểm đưa tiếng Anh trở thành ngôn ngữ thứ hai trong trường học
            </h1>
            <p className="text-slate-600 md:text-lg">
              Thiết kế thí điểm 9–12 tháng (đợt học 12 tuần) cho 4–6 trường THCS, quy mô 300–500 học sinh lớp 6–7, kèm cổng giáo viên gọn nhẹ và bộ tiêu chí đo lường khoa học.
            </p>
            <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4 text-xs text-brand-900">
              <b>Tên nhiệm vụ KH&CN đề xuất tại tỉnh:</b> “Nghiên cứu phát triển và thí điểm nền tảng học tiếng Anh thích ứng ứng dụng trí tuệ nhân tạo, hỗ trợ luyện giao tiếp theo ngữ cảnh địa phương cho học sinh trung học cơ sở tại tỉnh An Giang.”
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/lop-hoc" className="btn btn-lg btn-primary">
                <School className="h-5 w-5" /> Xem thử Cổng Giáo viên
              </Link>
              <Link href="/admin/ai-thi-diem" className="btn btn-lg btn-outline">
                <ClipboardCheck className="h-5 w-5" /> Xem bảng dữ liệu thí điểm
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/classroom.jpg" alt="Thí điểm trường học An Giang" className="rounded-3xl shadow-card" />
          </div>
        </div>

        {/* Bảng 6 chỉ tiêu đánh giá đề xuất */}
        <div className="card overflow-hidden">
          <div className="bg-brand-900 px-6 py-4 text-white">
            <h2 className="text-xl font-extrabold text-white">
              📊 Bộ chỉ tiêu mục tiêu đánh giá đợt thí điểm 12 tuần
            </h2>
            <p className="text-xs text-white/75">
              Lưu ý: Các chỉ tiêu dưới đây là mục tiêu đề xuất cho đợt thí điểm, chưa phải kết quả đã được chứng minh.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Nội dung đánh giá</th>
                  <th>Cách đo lường đề xuất</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "1. Dễ sử dụng",
                    "Ít nhất 85% người học tự mở và hoàn thành thao tác bắt đầu bài sau một lần hướng dẫn.",
                  ],
                  [
                    "2. Duy trì học tập",
                    "Ít nhất 65% người tham gia hoàn thành tối thiểu 3 buổi/tuần trong 8/12 tuần.",
                  ],
                  [
                    "3. Tiến bộ giao tiếp",
                    "Đánh giá nói trước – sau (Pre-test / Post-test) bằng nhiệm vụ tương đương; giáo viên chấm độc lập không biết học sinh thuộc nhóm nào (Blind scoring).",
                  ],
                  [
                    "4. Hiệu quả bổ sung của App",
                    "So sánh nhóm thực nghiệm với nhóm đối chứng học theo cách hiện có, có mức đầu vào tương đương; phân bổ theo lớp.",
                  ],
                  [
                    "5. Khả năng vận dụng (Transfer)",
                    "Kiểm tra bằng tình huống mới chưa được luyện nguyên mẫu trên app (VD: tự giới thiệu một địa điểm gần nhà).",
                  ],
                  [
                    "6. Tính khả thi kinh doanh",
                    "Theo dõi chi phí AI (STT/LLM/TTS), hạ tầng, hỗ trợ và học liệu trên mỗi người học hoạt động.",
                  ],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td className="font-bold text-ink">{k}</td>
                    <td className="text-slate-600">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Phạm vi bàn giao phiên bản đầu */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-lg font-extrabold">📦 Phạm vi sản phẩm bàn giao cho Trường</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {[
                "Phiên bản Web/PWA chạy tốt trên điện thoại và phòng máy trường học (có tài khoản cá nhân & nút đăng xuất rõ ràng) + App Android.",
                "60 bài học ngắn và 30 tình huống giao tiếp tập trung lớp 6–7, có phân 3 mức trợ giúp.",
                "Gia sư AI luyện hội thoại, phản hồi sửa 1–2 lỗi và đề xuất nội dung ôn tập.",
                "Cổng giáo viên, báo cáo phụ huynh hàng tuần và hệ thống quản trị học liệu.",
                "Tập huấn giáo viên, hỗ trợ kỹ thuật và báo cáo tổng kết hiệu quả thí điểm.",
              ].map((it, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="flex items-center gap-2 text-lg font-extrabold">
              <ShieldCheck className="h-5 w-5 text-brand-600" /> Kiểm chứng độ tin cậy AI & Bảo mật học sinh
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Điểm nhận dạng giọng nói của máy không được dùng thay hoàn toàn cho đánh giá năng lực nói. Hệ thống tích hợp công cụ <b>kiểm tra mức thống nhất giữa phản hồi AI và giáo viên</b>, đặc biệt với bản ghi có tiếng ồn hoặc học sinh phát âm chưa rõ.
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Với học sinh nhỏ tuổi, chủ đề hội thoại được khoá chặt theo bài học; bản ghi âm chỉ thu thập khi có sự đồng ý của phụ huynh/nhà trường và tự động xoá khi hết thời hạn lưu trữ.
            </p>
          </div>
        </div>

        <LeadForm
          source="SCHOOL_DEMO"
          defaultRole="SCHOOL"
          title="Đăng ký khảo sát & Thí điểm cho Trường THCS / Phòng Giáo dục"
          subtitle="Để lại thông tin của trường, đội ngũ Mekong Green AI sẽ gửi hồ sơ đề án thí điểm 12 tuần và lịch demo trực tiếp."
        />
      </div>
    </div>
  );
}
