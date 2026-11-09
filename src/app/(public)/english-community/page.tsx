import Link from "next/link";
import { Sparkles, Volume2, CheckCircle2 } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";

export const metadata = { title: "English Community – Tiếng Anh cho người mới bắt đầu" };

export default function EnglishCommunityPage() {
  return (
    <div className="py-12">
      <div className="container space-y-10">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <span className="badge badge-blue">Dành cho người mới bắt đầu & học lại từ đầu</span>
            <h1 className="text-3xl font-extrabold md:text-5xl">
              English Community – Hướng dẫn bằng tiếng Việt, bài ngắn, thao tác đơn giản
            </h1>
            <p className="text-slate-600 md:text-lg">
              Thiết kế tối giản cho người mới bắt đầu hoặc các đơn vị, hội đoàn địa phương đặt hàng đào tạo cộng đồng: nút bấm lớn, giải thích tiếng Việt rõ ràng, có nghe chậm từng từ.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/khoa-hoc/tieng-anh-cho-nguoi-moi-bat-dau" className="btn btn-lg btn-primary">
                <Sparkles className="h-5 w-5" /> Học miễn phí ngay
              </Link>
              <Link href="/hoc" className="btn btn-lg btn-outline">
                <Volume2 className="h-5 w-5" /> Vào bài học mẫu
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/cho-noi.jpg" alt="English Community" className="rounded-3xl shadow-card" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            "100% hướng dẫn bằng tiếng Việt, không dùng thuật ngữ ngữ pháp phức tạp",
            "Bài học ngắn 5–10 phút: chào hỏi, số đếm, giá tiền, chỉ đường, mua bán",
            "Triển khai linh hoạt theo đơn đặt hàng của địa phương, trung tâm học tập cộng đồng",
          ].map((t, i) => (
            <div key={i} className="card flex items-start gap-3 p-5 text-sm font-medium text-slate-700">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
              <span>{t}</span>
            </div>
          ))}
        </div>

        <LeadForm
          source="ENGLISH_COMMUNITY"
          defaultRole="STUDENT"
          title="Liên hệ đặt hàng triển khai gói English Community"
        />
      </div>
    </div>
  );
}
