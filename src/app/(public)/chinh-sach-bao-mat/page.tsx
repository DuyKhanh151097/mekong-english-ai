import { ShieldCheck } from "lucide-react";

export const metadata = { title: "Chính sách bảo mật & Bảo vệ dữ liệu giọng nói trẻ em" };

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12">
      <div className="container max-w-3xl">
        <div className="card space-y-5 p-6 md:p-10">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-brand-600" />
            <h1 className="text-2xl font-extrabold md:text-3xl">
              Chính sách bảo mật & Bảo vệ dữ liệu giọng nói học sinh (Nghị định 13/2023/NĐ-CP)
            </h1>
          </div>

          <p className="text-sm text-slate-600">
            Công ty TNHH Công nghệ Mekong Green AI cam kết bảo vệ dữ liệu cá nhân và bản ghi giọng nói của học sinh theo đúng quy định tại Nghị định 13/2023/NĐ-CP:
          </p>

          <div className="space-y-4 text-sm text-slate-700">
            <div>
              <h2 className="font-extrabold text-ink">1. Giới hạn chủ đề hội thoại an toàn cho học sinh nhỏ tuổi</h2>
              <p>
                Học sinh không phải tự viết câu lệnh mở cho AI. Toàn bộ các phiên luyện nói với Gia sư AI đều được khoá chặt trong phạm vi chủ đề bài học (trường học, khu phố, điểm du lịch, món ăn, sở thích lành mạnh) đã được giáo viên thẩm định.
              </p>
            </div>
            <div>
              <h2 className="font-extrabold text-ink">2. Cơ chế đồng ý của Phụ huynh & Nhà trường</h2>
              <p>
                Với học sinh dưới 16 tuổi, bản ghi âm giọng nói chỉ được lưu trữ phục vụ đánh giá tiến bộ khi có sự đồng ý xác nhận của phụ huynh trong Cổng Phụ huynh. Phụ huynh có thể tắt quyền lưu bản ghi âm hoặc yêu cầu xoá toàn bộ dữ liệu bất cứ lúc nào.
              </p>
            </div>
            <div>
              <h2 className="font-extrabold text-ink">3. Phân quyền truy cập & Thời hạn lưu trữ rõ ràng</h2>
              <p>
                Chỉ học sinh, phụ huynh được liên kết và giáo viên phụ trách lớp mới có quyền nghe lại bản ghi. Mặc định bản ghi âm tự động xoá sau 180 ngày (cấu hình được trong trang Quản trị). Khi phục vụ nghiên cứu thí điểm, dữ liệu xuất ra đều được ẩn danh hoàn toàn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
