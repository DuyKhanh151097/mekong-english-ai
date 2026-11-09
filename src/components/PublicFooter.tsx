import Link from "next/link";
import { Phone, MessageCircle, Sparkles } from "lucide-react";
import { Logo } from "./Logo";
import { getSettings } from "@/lib/settings";

export async function PublicFooter() {
  const settings = await getSettings();
  const c = settings.company;

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-3 lg:col-span-2">
            <Logo light />
            <p className="text-sm text-slate-400">
              <b>{c.name}</b> – Ứng dụng học tiếng Anh thông minh gắn với học tập, đời sống và nghề nghiệp địa phương tỉnh An Giang.
            </p>
            <p className="text-xs font-semibold text-rice-400">
              “Mỗi ngày 15 phút, học điều gần gũi, luyện nói có hướng dẫn và nhìn thấy tiến bộ.”
            </p>
            <div className="pt-1 text-xs text-slate-400 space-y-1">
              <div>📍 Địa chỉ: {c.address}</div>
              <div>📞 Hotline: {c.hotline} · ✉️ {c.email}</div>
              <div>🏢 Hệ sinh thái Mekong Green AI: SmartTourism AI · Coop360 · TraceHub</div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">3 Gói sản phẩm</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/english-school" className="hover:text-white">English School (THCS lớp 6–7)</Link></li>
              <li><Link href="/english-career" className="hover:text-white">English Career (Du lịch – dịch vụ)</Link></li>
              <li><Link href="/english-community" className="hover:text-white">English Community (Cộng đồng)</Link></li>
              <li><Link href="/khoa-hoc" className="hover:text-white">Thư viện Video bài giảng</Link></li>
              <li><Link href="/luyen-noi-truc-tiep" className="hover:text-white">Luyện nói trực tiếp với GV</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Cổng truy cập</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/hoc" className="hover:text-white">Ứng dụng Học sinh (4 mục)</Link></li>
              <li><Link href="/lop-hoc" className="hover:text-white">Cổng Giáo viên trường</Link></li>
              <li><Link href="/phu-huynh" className="hover:text-white">Cổng Phụ huynh (Báo cáo tuần)</Link></li>
              <li><Link href="/giang-vien" className="hover:text-white">Cổng Giáo viên Live Speaking</Link></li>
              <li><Link href="/admin" className="text-rice-400 hover:underline">Quản trị hệ thống (Admin CMS)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Thông tin & Chính sách</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/nha-truong" className="hover:text-white">Đề án thí điểm trường học An Giang</Link></li>
              <li><Link href="/bang-gia" className="hover:text-white">Bảng giá & Gói buổi Live</Link></li>
              <li><Link href="/kiem-tra-trinh-do" className="hover:text-white">Kiểm tra trình độ miễn phí</Link></li>
              <li><Link href="/chinh-sach-bao-mat" className="hover:text-white">Bảo vệ dữ liệu trẻ em (NĐ 13/2023)</Link></li>
              <li><Link href="/lien-he" className="hover:text-white">Liên hệ & Hỗ trợ</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-6 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {c.name}. Bảo lưu mọi quyền.</p>
          <p>Nhiệm vụ KH&CN đề xuất tại tỉnh An Giang · Thông điệp: “{settings.slogan}”</p>
        </div>
      </div>

      {/* Nút nổi liên hệ & Học thử trên mobile */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
        <a
          href={c.zalo}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-sky-700"
        >
          <MessageCircle className="h-4 w-4" /> Chat Zalo tư vấn
        </a>
        <Link
          href="/hoc"
          className="flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-brand-700"
        >
          <Sparkles className="h-4 w-4" /> Vào học 15&apos; ngay
        </Link>
      </div>
    </footer>
  );
}
