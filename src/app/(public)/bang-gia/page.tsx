import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";
import { formatVnd, parseJson } from "@/lib/utils";

export const metadata = { title: "Bảng giá & Gói buổi Live Speaking" };

export default async function PricingPage() {
  const plans = await db.plan.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
  const subPlans = plans.filter((p) => p.type === "FREE" || p.type === "SUBSCRIPTION");
  const livePlans = plans.filter((p) => p.type === "LIVE_PACK");
  const b2bPlans = plans.filter((p) => p.type === "B2B");

  return (
    <div className="py-12">
      <div className="container space-y-12">
        <div className="text-center">
          <span className="eyebrow">💳 Minh bạch – Phù hợp điều kiện địa phương</span>
          <h1 className="text-3xl font-extrabold md:text-5xl">Bảng giá MEKONG English AI</h1>
          <p className="section-sub mx-auto">
            Giá hiển thị là mức đề xuất tham khảo (có thể điều chỉnh linh hoạt trong trang Quản trị theo mức sẵn sàng chi trả và chi phí hội thoại thực tế). Dùng mã <code>MEKONG30</code> để giảm 30%.
          </p>
        </div>

        {/* 1. Gói tự học Video + Gia sư AI */}
        <div>
          <h2 className="mb-4 text-xl font-extrabold">1. Gói tự học qua Video bài giảng & Gia sư AI</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {subPlans.map((p) => {
              const feats = parseJson<string[]>(p.featuresJson, []);
              return (
                <div
                  key={p.id}
                  className={`card flex flex-col justify-between p-6 ${
                    p.isFeatured ? "border-2 border-brand-600 ring-4 ring-brand-500/10" : ""
                  }`}
                >
                  <div>
                    {p.isFeatured && <span className="badge badge-green mb-2">Phổ biến nhất</span>}
                    <h3 className="text-lg font-extrabold">{p.name}</h3>
                    <p className="mt-1 text-xs text-slate-500">{p.description}</p>
                    <div className="mt-4">
                      <span className="text-2xl font-extrabold text-brand-700">
                        {p.price === 0 ? "Miễn phí" : formatVnd(p.salePrice ?? p.price)}
                      </span>
                      {p.salePrice && (
                        <span className="ml-1.5 text-xs text-slate-400 line-through">{formatVnd(p.price)}</span>
                      )}
                      {p.price > 0 && (
                        <div className="text-xs text-slate-500">Thời hạn: {p.durationDays} ngày</div>
                      )}
                    </div>
                    <ul className="mt-4 space-y-2 text-xs text-slate-700">
                      {feats.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href={p.price === 0 ? "/dang-ky" : `/thanh-toan/${p.code}`}
                    className={`btn mt-6 w-full ${p.isFeatured ? "btn-primary" : "btn-outline"}`}
                  >
                    {p.price === 0 ? "Đăng ký miễn phí" : "Chọn gói này"}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Gói buổi Live Speaking trả phí thêm */}
        <div>
          <h2 className="mb-4 text-xl font-extrabold">
            2. Gói phiên luyện nói trực tiếp với Giáo viên (Live Speaking – Trả phí thêm)
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {livePlans.map((p) => {
              const feats = parseJson<string[]>(p.featuresJson, []);
              return (
                <div key={p.id} className="card flex flex-col justify-between border-2 border-amber-300 bg-rice-50/40 p-6">
                  <div>
                    <span className="badge badge-gold">{p.sessions} buổi × 25 phút</span>
                    <h3 className="mt-2 text-xl font-extrabold">{p.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{p.description}</p>
                    <div className="mt-3">
                      <span className="text-3xl font-extrabold text-brand-700">{formatVnd(p.salePrice ?? p.price)}</span>
                      {p.salePrice && <span className="ml-2 text-sm text-slate-400 line-through">{formatVnd(p.price)}</span>}
                    </div>
                    <ul className="mt-4 space-y-1.5 text-sm text-slate-700">
                      {feats.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-brand-600" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href={`/thanh-toan/${p.code}`} className="btn btn-primary mt-6 w-full">
                    Mua gói {p.name}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Gói B2B cho Trường học & Doanh nghiệp */}
        <div>
          <h2 className="mb-4 text-xl font-extrabold">3. Gói triển khai cho Trường học, Trung tâm & Doanh nghiệp</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {b2bPlans.map((p) => {
              const feats = parseJson<string[]>(p.featuresJson, []);
              return (
                <div key={p.id} className="card flex flex-col justify-between p-6">
                  <div>
                    <span className="badge badge-blue">Hợp đồng theo đơn vị</span>
                    <h3 className="mt-2 text-xl font-extrabold">{p.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{p.description}</p>
                    <ul className="mt-4 space-y-1.5 text-sm text-slate-700">
                      {feats.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-brand-600" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href="/nha-truong" className="btn btn-outline mt-6 w-full">
                    Nhận báo giá & Đăng ký thí điểm
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
