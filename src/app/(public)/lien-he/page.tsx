import { LeadForm } from "@/components/LeadForm";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "Liên hệ Công ty TNHH Công nghệ Mekong Green AI" };

export default async function ContactPage() {
  const settings = await getSettings();
  const c = settings.company;

  return (
    <div className="py-12">
      <div className="container grid gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <span className="eyebrow">📍 Liên hệ & Hợp tác</span>
          <h1 className="text-3xl font-extrabold">{c.name}</h1>
          <p className="text-slate-600">
            Đơn vị phát triển nền tảng giáo dục thông minh <b>MEKONG English AI</b> và hệ sinh thái công nghệ địa phương <b>SmartTourism AI, Coop360, TraceHub</b>.
          </p>
          <div className="card space-y-2 p-5 text-sm">
            <div><b>Địa chỉ:</b> {c.address}</div>
            <div><b>Hotline / Zalo:</b> {c.hotline}</div>
            <div><b>Email:</b> {c.email}</div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <LeadForm source="CONTACT" title="Gửi yêu cầu tư vấn / Hợp tác" />
        </div>
      </div>
    </div>
  );
}
