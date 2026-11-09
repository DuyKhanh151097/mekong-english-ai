import Link from "next/link";
import { Video, Calendar, ExternalLink, PlusCircle } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { bookLiveSlotAction } from "@/lib/public-actions";
import { formatDate, formatTime } from "@/lib/utils";

export const metadata = { title: "Lịch học trực tiếp với Giáo viên (Live Speaking)" };

export default async function LearnerLivePage({
  searchParams,
}: {
  searchParams: Promise<{ booked?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const user = await requireUser();

  const [bookings, openSlots] = await Promise.all([
    db.booking.findMany({
      where: { userId: user.id },
      include: { slot: { include: { tutor: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.tutorSlot.findMany({
      where: { status: "OPEN", startAt: { gte: new Date() } },
      include: { tutor: true },
      orderBy: { startAt: "asc" },
      take: 9,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="eyebrow">🎥 Phiên luyện nói trực tiếp với Giáo viên (25 phút/buổi)</span>
          <h1 className="text-2xl font-extrabold md:text-3xl">
            Live Speaking của {user.name}
          </h1>
          <p className="text-sm text-slate-600">
            Số buổi Live còn lại trong tài khoản: <b className="text-brand-700">{user.liveCredits} buổi</b>
          </p>
        </div>
        <Link href="/bang-gia" className="btn btn-primary">
          <PlusCircle className="h-4 w-4" /> Mua thêm gói 4 buổi / 12 buổi
        </Link>
      </div>

      {sp.booked && (
        <div className="rounded-2xl bg-brand-600 p-4 text-sm font-bold text-white">
          ✅ Đã đặt lịch học trực tiếp thành công! Link phòng học trực tuyến đã sẵn sàng bên dưới.
        </div>
      )}
      {sp.error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{sp.error}</div>
      )}

      {/* Lịch đã đặt & Nhận xét của giáo viên sau buổi học */}
      <div className="card p-6">
        <h2 className="text-lg font-extrabold">📅 Các buổi học trực tiếp của em ({bookings.length})</h2>
        <div className="mt-4 space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="badge badge-green">{b.status === "COMPLETED" ? "Đã hoàn thành" : "Sắp diễn ra"}</span>
                  <span className="font-extrabold">
                    GV: {b.slot.tutor.name} · {formatDate(b.slot.startAt)} lúc {formatTime(b.slot.startAt)}
                  </span>
                </div>
                {b.tutorFeedback && (
                  <div className="text-xs font-semibold text-brand-800">
                    📝 Nhận xét của giáo viên sau buổi học: “{b.tutorFeedback}”
                  </div>
                )}
              </div>

              {b.slot.meetingUrl && (
                <a
                  href={b.slot.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-primary"
                >
                  <Video className="h-4 w-4" /> Vào phòng học Video <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Đặt nhanh ca trống */}
      <div className="card p-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold">
          <Calendar className="h-5 w-5 text-brand-600" /> Đặt nhanh ca trống sắp tới
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {openSlots.map((s) => (
            <form
              key={s.id}
              action={bookLiveSlotAction}
              className="flex flex-col justify-between rounded-xl border border-slate-200 p-4 text-sm"
            >
              <input type="hidden" name="slotId" value={s.id} />
              <div>
                <div className="font-extrabold text-ink">{s.tutor.name}</div>
                <div className="text-xs text-slate-500">
                  {formatDate(s.startAt)} · {formatTime(s.startAt)} ({s.durationMin} phút)
                </div>
                <div className="mt-1 text-xs text-brand-700 font-semibold">
                  {s.type === "GROUP" ? `Nhóm 3–5 bạn (${s.topic || "Giao tiếp"})` : "Kèm 1-1 riêng"}
                </div>
              </div>
              <button type="submit" className="btn btn-sm btn-outline mt-3 w-full">
                Đặt ca này (-1 buổi)
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
