import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Calendar, ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { bookLiveSlotAction } from "@/lib/public-actions";
import { formatDate, formatTime, formatVnd } from "@/lib/utils";

export default async function TutorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tutor = await db.tutor.findUnique({
    where: { slug },
    include: {
      slots: {
        where: { status: "OPEN", startAt: { gte: new Date() } },
        orderBy: { startAt: "asc" },
      },
    },
  });
  if (!tutor) notFound();

  return (
    <div className="py-12">
      <div className="container max-w-4xl space-y-8">
        <Link href="/luyen-noi-truc-tiep" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách giáo viên
        </Link>

        <div className="card p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={tutor.avatar || "/images/live-tutor.jpg"} alt={tutor.name} className="h-28 w-28 rounded-2xl object-cover" />
            <div className="space-y-1">
              <span className="badge badge-green">Quốc tịch: {tutor.nationality}</span>
              <h1 className="text-2xl font-extrabold md:text-3xl">{tutor.name}</h1>
              <p className="font-semibold text-brand-700">{tutor.headline}</p>
              <div className="flex items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                  <Star className="h-4 w-4 fill-amber-400" /> {tutor.rating} ({tutor.ratingCount} đánh giá)
                </span>
                <span>· Đơn giá: <b>{formatVnd(tutor.pricePerSession)}/buổi 25 phút</b></span>
              </div>
            </div>
          </div>

          <p className="mt-6 text-slate-700">{tutor.bio}</p>
          <div className="mt-4 grid gap-4 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
            <div><b>Chứng chỉ sư phạm:</b> {tutor.certificates}</div>
            <div><b>Chuyên môn:</b> {tutor.specialties}</div>
          </div>

          {tutor.videoUrl && (
            <div className="mt-6">
              <div className="mb-2 text-sm font-bold">🎬 Video giới thiệu của {tutor.name}</div>
              <video controls src={tutor.videoUrl} className="aspect-video w-full rounded-xl bg-black" />
            </div>
          )}
        </div>

        <div className="card p-6 md:p-8">
          <h2 className="flex items-center gap-2 text-xl font-extrabold">
            <Calendar className="h-5 w-5 text-brand-600" /> Lịch trống có thể đặt ({tutor.slots.length} ca)
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {tutor.slots.map((s) => (
              <form
                key={s.id}
                action={bookLiveSlotAction}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
              >
                <input type="hidden" name="slotId" value={s.id} />
                <div>
                  <div className="font-bold">{formatDate(s.startAt)} · {formatTime(s.startAt)}</div>
                  <div className="text-xs text-slate-500">
                    {s.type === "GROUP" ? `Nhóm 3–5 học viên (${s.topic || "Giao tiếp"})` : "1-1 riêng (25 phút)"}
                  </div>
                </div>
                <button type="submit" className="btn btn-sm btn-primary">
                  Đặt lịch
                </button>
              </form>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
