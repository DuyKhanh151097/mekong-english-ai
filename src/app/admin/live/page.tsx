import { db } from "@/lib/db";
import { formatDate, formatTime, formatVnd } from "@/lib/utils";

export const metadata = { title: "Quản lý Live Speaking & Đối soát Giáo viên – Admin CMS" };

export default async function AdminLivePage() {
  const [tutors, bookings] = await Promise.all([
    db.tutor.findMany({
      include: { slots: { include: { bookings: true } } },
    }),
    db.booking.findMany({
      include: { user: true, slot: { include: { tutor: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <span className="eyebrow">🎥 Dịch vụ trả phí thêm (Live Speaking)</span>
        <h1 className="text-2xl font-extrabold md:text-3xl">
          Quản lý Giáo viên Live, Lịch đặt & Đối soát thù lao
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {tutors.map((t) => {
          const completedCount = t.slots.reduce(
            (s, sl) => s + sl.bookings.filter((b) => b.status === "COMPLETED" || b.status === "BOOKED").length,
            0
          );
          const gross = completedCount * t.pricePerSession;
          const payout = Math.round((gross * t.revenueShare) / 100);
          return (
            <div key={t.id} className="card p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold">{t.name}</h2>
                <span className="badge badge-green">Chia sẻ {t.revenueShare}%</span>
              </div>
              <div className="text-xs text-slate-600">{t.headline}</div>
              <div className="text-xs text-slate-500">
                Đơn giá: <b>{formatVnd(t.pricePerSession)}/buổi 25&apos;</b> · Đánh giá: ⭐ {t.rating}
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1">
                <div>Số buổi đã đặt/dạy: <b>{completedCount} buổi</b></div>
                <div>Doanh thu gộp: <b>{formatVnd(gross)}</b></div>
                <div className="text-brand-700 font-bold">Thù lao giáo viên nhận: {formatVnd(payout)}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-extrabold">📅 Danh sách các phiên đặt lịch Live Speaking ({bookings.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Học viên</th>
                <th>Giáo viên</th>
                <th>Thời gian</th>
                <th>Hình thức</th>
                <th>Trạng thái</th>
                <th>Nhận xét sau buổi</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="font-bold">{b.user.name}</td>
                  <td>{b.slot.tutor.name}</td>
                  <td className="text-xs">
                    {formatDate(b.slot.startAt)} · {formatTime(b.slot.startAt)}
                  </td>
                  <td className="text-xs">{b.slot.type === "GROUP" ? "Nhóm 3–5 HS" : "1-1"}</td>
                  <td>
                    <span className="badge badge-green">{b.status}</span>
                  </td>
                  <td className="max-w-xs truncate text-xs text-slate-600">
                    {b.tutorFeedback || "Chưa cập nhật"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
