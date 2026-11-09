import Link from "next/link";
import { CheckCircle2, Compass, Sparkles } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";

export const metadata = { title: "English Career – Tiếng Anh Du lịch, Dịch vụ & OCOP An Giang" };

export default function EnglishCareerPage() {
  return (
    <div className="py-12">
      <div className="container space-y-12">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <span className="badge badge-gold">Mở rộng sau thí điểm trường học</span>
            <h1 className="text-3xl font-extrabold md:text-5xl">
              English Career – Tiếng Anh phục vụ Du lịch, Dịch vụ & Sản phẩm OCOP
            </h1>
            <p className="text-slate-600 md:text-lg">
              Phù hợp định hướng phát triển du lịch kết nối Phú Quốc – Hà Tiên – Châu Đốc – Núi Sam – Trà Sư. Tích hợp dữ liệu điểm đến và sản phẩm được phép khai thác từ hệ sinh thái <b>SmartTourism AI, Coop360 và TraceHub</b> của Mekong Green AI.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/khoa-hoc/tieng-anh-du-lich-dich-vu" className="btn btn-lg btn-primary">
                <Sparkles className="h-5 w-5" /> Xem giáo trình English Career
              </Link>
              <Link href="/hoc/luyen-noi" className="btn btn-lg btn-outline">
                <Compass className="h-5 w-5" /> Thử tình huống Lễ tân & OCOP
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/career.jpg" alt="English Career" className="rounded-3xl shadow-card" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Lưu trú & Nhà hàng",
              desc: "Đón khách, nhận phòng, giới thiệu món ăn đặc sản (bún cá, bánh xèo, lẩu mắm), xử lý yêu cầu cơ bản.",
            },
            {
              title: "Hướng dẫn điểm đến",
              desc: "Giới thiệu Rừng tràm Trà Sư, Miếu Bà Chúa Xứ Núi Sam, chợ nổi Long Xuyên, lịch trình tham quan.",
            },
            {
              title: "Bán hàng & Sản phẩm OCOP",
              desc: "Trình bày câu chuyện sản phẩm đường thốt nốt, khô cá, mắm Châu Đốc, nông sản hợp tác xã.",
            },
          ].map((b) => (
            <div key={b.title} className="card p-6">
              <CheckCircle2 className="h-6 w-6 text-brand-600" />
              <h3 className="mt-3 text-lg font-extrabold">{b.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{b.desc}</p>
            </div>
          ))}
        </div>

        <LeadForm
          source="ENGLISH_CAREER"
          defaultRole="COMPANY"
          title="Đăng ký đào tạo English Career cho Doanh nghiệp / Cơ sở du lịch"
        />
      </div>
    </div>
  );
}
