import Link from "next/link";
import { ShieldCheck, CheckCircle2, Flame, Sparkles, Video } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { updateParentConsentAction } from "@/lib/portal-actions";
import { DemoRoleSwitcher } from "@/components/DemoRoleSwitcher";
import { PublicHeader } from "@/components/PublicHeader";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Cổng Phụ huynh – Báo cáo tuần & Bảo vệ dữ liệu giọng nói" };

export default async function ParentPortalPage() {
  const user = await requireUser(["PARENT", "ADMIN"]);

  const links = await db.parentLink.findMany({
    where: user.role === "ADMIN" ? {} : { parentId: user.id },
    include: {
      student: {
        include: {
          weeklyReports: { orderBy: { weekStart: "desc" }, take: 4 },
          studySessions: { orderBy: { createdAt: "desc" }, take: 6 },
          speaking: { include: { scenario: true }, orderBy: { createdAt: "desc" }, take: 5 },
          consents: true,
        },
      },
    },
  });

  const children = links.map((l) => l.student);

  return (
    <div className="min-h-screen bg-surface">
      <DemoRoleSwitcher />
      <PublicHeader />

      <div className="container space-y-8 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">👨‍👩‍👧 Cổng Phụ huynh</span>
            <h1 className="text-2xl font-extrabold md:text-4xl">
              Báo cáo tiến bộ theo tuần & Quản lý quyền dữ liệu của con
            </h1>
            <p className="text-sm text-slate-600">
              Báo cáo ngắn gọn bằng tiếng Việt giúp phụ huynh biết ngay tuần này con đã làm được gì và cần luyện thêm điểm nào.
            </p>
          </div>
          <Link href="/bang-gia" className="btn btn-primary">
            <Video className="h-4 w-4" /> Mua thêm gói học / Buổi Live Speaking cho con
          </Link>
        </div>

        {children.map((child) => {
          const latestReport = child.weeklyReports[0];
          const voiceConsent = child.consents.find((c) => c.type === "VOICE_RECORDING");

          return (
            <div key={child.id} className="space-y-6">
              {/* Thẻ tóm tắt tuần của con */}
              <div className="card border-2 border-brand-500 p-6 md:p-8 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="badge badge-green">Học sinh lớp {child.grade || 6}</span>
                    <h2 className="mt-1 text-2xl font-extrabold">{child.name}</h2>
                  </div>
                  <div className="flex gap-2">
                    <span className="badge badge-gold">
                      <Flame className="h-4 w-4 text-orange-600" /> Chuỗi học: {child.streak} ngày
                    </span>
                    <span className="badge badge-green">
                      <Sparkles className="h-4 w-4" /> {child.xp} XP
                    </span>
                  </div>
                </div>

                {/* Báo cáo ngắn theo tuần */}
                <div className="rounded-2xl bg-brand-50 p-5 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wide text-brand-700">
                    📩 Báo cáo tuần gần nhất ({formatDate(latestReport?.weekStart || new Date())}):
                  </div>
                  <p className="text-base font-extrabold text-ink">
                    “Tuần qua con đã luyện {latestReport?.sessions ?? 4} buổi ({latestReport?.minutes ?? 60} phút).{" "}
                    {latestReport?.canDoVi || "Con có thể tự giới thiệu bản thân và trường học."}{" "}
                    {latestReport?.needVi || "Cần luyện thêm cách đặt câu hỏi (Where/What/How)."}”
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Lịch sử các lượt luyện nói của con */}
                  <div className="space-y-3">
                    <h3 className="font-extrabold">🎤 Các câu tiếng Anh con vừa luyện nói</h3>
                    {child.speaking.map((sp) => (
                      <div key={sp.id} className="rounded-xl border border-slate-200 bg-white p-3.5 text-sm">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-brand-700">{sp.scenario?.titleVi}</span>
                          <span>Điểm: {sp.overall}/100 (Mức trợ giúp {sp.scaffoldLevel})</span>
                        </div>
                        <div className="mt-1 font-medium text-ink">“{sp.transcript}”</div>
                        {sp.feedbackVi && <div className="mt-1 text-xs text-slate-500">{sp.feedbackVi}</div>}
                      </div>
                    ))}
                  </div>

                  {/* Quản lý đồng ý thu thập giọng nói (Nghị định 13/2023/NĐ-CP) */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                    <div className="flex items-center gap-2 font-extrabold text-ink">
                      <ShieldCheck className="h-5 w-5 text-brand-600" />
                      Quyền đồng ý & Thời hạn lưu trữ bản ghi giọng nói (Nghị định 13/2023/NĐ-CP)
                    </div>
                    <p className="text-xs text-slate-600">
                      Với học sinh nhỏ tuổi, chủ đề hội thoại được giới hạn chặt theo bài học trên lớp. Bản ghi âm chỉ được lưu phục vụ đánh giá tiến bộ khi phụ huynh đồng ý dưới đây.
                    </p>

                    <form action={updateParentConsentAction} className="space-y-3">
                      <input type="hidden" name="studentId" value={child.id} />
                      <label className="flex items-center gap-2.5 text-sm font-semibold text-ink">
                        <input
                          type="checkbox"
                          name="granted"
                          defaultChecked={voiceConsent?.granted ?? true}
                          className="h-4 w-4 accent-brand-600"
                        />
                        <span>Tôi đồng ý cho lưu bản ghi âm bài học của con để giáo viên & phụ huynh theo dõi</span>
                      </label>

                      <div>
                        <label className="label">Thời hạn tự động xoá bản ghi âm</label>
                        <select
                          name="retentionDays"
                          defaultValue={String(voiceConsent?.retentionDays ?? 180)}
                          className="select"
                        >
                          <option value="30">Tự xoá sau 30 ngày</option>
                          <option value="90">Tự xoá sau 90 ngày (1 học kỳ ngắn)</option>
                          <option value="180">Tự xoá sau 180 ngày (1 học kỳ)</option>
                          <option value="365">Tự xoá sau 365 ngày (1 năm học)</option>
                        </select>
                      </div>

                      <button type="submit" className="btn btn-sm btn-primary">
                        <CheckCircle2 className="h-4 w-4" /> Lưu thiết lập bảo vệ dữ liệu
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
