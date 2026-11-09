import { Video, Calendar, PlusCircle, CheckCircle2, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { createTutorSlotAction, saveLiveFeedbackAction } from "@/lib/portal-actions";
import { DemoRoleSwitcher } from "@/components/DemoRoleSwitcher";
import { PublicHeader } from "@/components/PublicHeader";
import { formatDate, formatTime, formatVnd } from "@/lib/utils";

export const metadata = { title: "Cổng Giáo viên Live Speaking – Lịch dạy & Nhận xét" };

export default async function TutorPortalPage() {
  await requireUser(["TUTOR", "ADMIN"]);

  const tutors = await db.tutor.findMany({
    include: {
      slots: {
        include: { bookings: { include: { user: true } } },
        orderBy: { startAt: "asc" },
      },
    },
  });
  const tutor = tutors[0];
  const allBookings = tutors.flatMap((t) =>
    t.slots.flatMap((s) => s.bookings.map((b) => ({ ...b, slot: s, tutor: t })))
  );

  return (
    <div className="min-h-screen bg-surface">
      <DemoRoleSwitcher />
      <PublicHeader />

      <div className="container space-y-8 py-8">
        <div>
          <span className="eyebrow">🎥 Cổng Giáo viên Live Speaking</span>
          <h1 className="text-2xl font-extrabold md:text-4xl">
            Quản lý lịch dạy trực tiếp & Ghi nhận xét sau buổi học
          </h1>
          <p className="text-sm text-slate-600">
            Mỗi buổi 25 phút (1-1 hoặc nhóm 3–5 học viên). Sau buổi học, giáo viên ghi nhận xét để gửi về Cổng Phụ huynh & Học sinh.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Danh sách buổi đã đặt cần dạy / ghi nhận xét */}
          <div className="card p-6 lg:col-span-7 space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-extrabold">
              <Video className="h-5 w-5 text-brand-600" /> Các phiên Live Speaking ({allBookings.length})
            </h2>
            <div className="space-y-4">
              {allBookings.map((b) => (
                <form
                  key={b.id}
                  action={saveLiveFeedbackAction}
                  className="rounded-2xl border border-slate-200 p-4 text-sm space-y-2.5"
                >
                  <input type="hidden" name="bookingId" value={b.id} />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-extrabold text-ink">
                        Học viên: {b.user.name}
                      </span>{" "}
                      · <span className="text-xs text-slate-500">GV: {b.tutor.name}</span>
                    </div>
                    <span className="badge badge-green">
                      {formatDate(b.slot.startAt)} · {formatTime(b.slot.startAt)}
                    </span>
                  </div>
                  {b.note && <div className="text-xs text-slate-600">Ghi chú của học viên: “{b.note}”</div>}

                  <div className="flex flex-wrap gap-2">
                    {b.slot.meetingUrl && (
                      <a
                        href={b.slot.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-secondary"
                      >
                        Mở phòng Video <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="grid gap-2 sm:grid-cols-4">
                    <input
                      name="tutorFeedback"
                      defaultValue={b.tutorFeedback || ""}
                      placeholder="Nhập nhận xét phát âm, phản xạ & bài tập về nhà..."
                      className="input sm:col-span-3"
                      required
                    />
                    <button type="submit" className="btn btn-sm btn-primary">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Lưu nhận xét
                    </button>
                  </div>
                </form>
              ))}
            </div>
          </div>

          {/* Mở thêm ca trống */}
          <div className="card p-6 lg:col-span-5 space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-extrabold">
              <Calendar className="h-5 w-5 text-brand-600" /> Khai báo thêm khung giờ rảnh (25 phút)
            </h2>
            {tutor && (
              <form action={createTutorSlotAction} className="space-y-3">
                <div>
                  <label className="label">Giáo viên</label>
                  <select name="tutorId" className="select" defaultValue={tutor.id}>
                    {tutors.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({formatVnd(t.pricePerSession)}/buổi · chia sẻ {t.revenueShare}%)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Ngày & giờ bắt đầu</label>
                  <input
                    name="startAt"
                    type="datetime-local"
                    className="input"
                    defaultValue={new Date(Date.now() + 86400000).toISOString().slice(0, 16)}
                    required
                  />
                </div>
                <div>
                  <label className="label">Hình thức phiên học</label>
                  <select name="type" className="select" defaultValue="ONE_ON_ONE">
                    <option value="ONE_ON_ONE">Kèm 1-1 riêng (25 phút)</option>
                    <option value="GROUP">Nhóm nhỏ 3–5 học viên (25 phút)</option>
                  </select>
                </div>
                <div>
                  <label className="label">Chủ đề (nếu là lớp nhóm)</label>
                  <input name="topic" className="input" placeholder="VD: Giới thiệu điểm đến An Giang" />
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  <PlusCircle className="h-4 w-4" /> Mở ca dạy mới
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
