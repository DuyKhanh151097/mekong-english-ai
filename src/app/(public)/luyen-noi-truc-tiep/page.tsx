import Link from "next/link";
import { Star, Video, Calendar, CheckCircle2, Users } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { bookLiveSlotAction } from "@/lib/public-actions";
import { formatDate, formatTime, formatVnd, parseJson } from "@/lib/utils";

export const metadata = { title: "Luyện nói trực tiếp với Giáo viên (Live Speaking)" };

export default async function LiveSpeakingPublicPage() {
  const [user, tutors, livePlans] = await Promise.all([
    getCurrentUser(),
    db.tutor.findMany({
      where: { status: "APPROVED" },
      include: {
        slots: {
          where: { status: "OPEN", startAt: { gte: new Date() } },
          orderBy: { startAt: "asc" },
          take: 6,
        },
      },
    }),
    db.plan.findMany({ where: { type: "LIVE_PACK", isActive: true }, orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="py-12">
      <div className="container space-y-12">
        {/* Hero */}
        <div className="grid items-center gap-8 rounded-3xl bg-brand-900 p-8 text-white lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <span className="badge bg-rice-500 text-ink">Dịch vụ trả phí thêm (Add-on)</span>
            <h1 className="text-3xl font-extrabold text-white md:text-4xl">
              Phiên luyện nói trực tiếp với Giáo viên (Live Speaking 1-1 & Nhóm nhỏ)
            </h1>
            <p className="text-white/85">
              Học qua Video bài giảng và Gia sư AI mỗi ngày giúp tiết kiệm chi phí; khi cần chỉnh phát âm sâu, rèn phản xạ tự nhiên hoặc chuẩn bị kiểm tra nói, em đặt lịch 25 phút trực tiếp với giáo viên.
            </p>
            {user && (
              <div className="inline-flex items-center gap-3 rounded-xl bg-white/15 px-4 py-2.5 text-sm">
                <span>
                  Tài khoản <b>{user.name}</b> hiện có:{" "}
                  <b className="text-rice-400">{user.liveCredits} buổi Live Speaking</b>
                </span>
                <Link href="/hoc/live" className="btn btn-sm btn-accent">
                  Xem lịch đã đặt
                </Link>
              </div>
            )}
          </div>
          <div className="lg:col-span-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/live-tutor.jpg" alt="Live Speaking" className="rounded-2xl shadow-lg" />
          </div>
        </div>

        {/* Danh sách giáo viên & khung giờ trống */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold">👩‍🏫 Chọn Giáo viên & Đặt khung giờ trống (25 phút/buổi)</h2>
            <p className="text-sm text-slate-600">
              Bấm chọn ca trống để đặt lịch ngay (trừ 1 buổi trong gói Live Speaking của bạn).
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {tutors.map((t) => (
              <div key={t.id} className="card flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.avatar || "/images/live-tutor.jpg"}
                      alt={t.name}
                      className="h-20 w-20 rounded-2xl object-cover"
                    />
                    <div>
                      <Link href={`/giao-vien/${t.slug}`} className="text-lg font-extrabold hover:text-brand-700">
                        {t.name}
                      </Link>
                      <div className="text-xs font-semibold text-brand-700">{t.headline}</div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-amber-600 font-bold">
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400" /> {t.rating} ({t.ratingCount})
                        </span>
                        <span>· {formatVnd(t.pricePerSession)}/buổi</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-600">{t.bio}</p>
                  <div className="mt-2 text-xs text-slate-500">
                    <b>Chứng chỉ:</b> {t.certificates} · <b>Chuyên môn:</b> {t.specialties}
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <div className="mb-2 flex items-center gap-1 text-xs font-bold text-slate-700">
                      <Calendar className="h-3.5 w-3.5 text-brand-600" /> Lịch trống sắp tới:
                    </div>
                    <div className="space-y-2">
                      {t.slots.map((s) => (
                        <form
                          key={s.id}
                          action={bookLiveSlotAction}
                          className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                        >
                          <input type="hidden" name="slotId" value={s.id} />
                          <div>
                            <div className="font-bold text-ink">
                              {formatDate(s.startAt)} · {formatTime(s.startAt)} ({s.durationMin}&apos;)
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {s.type === "GROUP" ? `Nhóm 3–5 HS (${s.topic || "Giao tiếp"})` : "Kèm 1-1 riêng"}
                            </div>
                          </div>
                          <button type="submit" className="btn btn-sm btn-primary py-1">
                            Đặt lịch
                          </button>
                        </form>
                      ))}
                    </div>
                  </div>
                </div>

                <Link href={`/giao-vien/${t.slug}`} className="btn btn-outline mt-4 w-full">
                  Xem hồ sơ & toàn bộ lịch của {t.name}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Gói buổi Live Speaking trả phí thêm */}
        <div className="card p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="badge badge-orange">Mua thêm gói buổi Live Speaking</span>
              <h2 className="mt-1 text-2xl font-extrabold">Bảng giá gói buổi luyện nói với Giáo viên</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {livePlans.map((p) => {
              const feats = parseJson<string[]>(p.featuresJson, []);
              return (
                <div key={p.id} className="rounded-2xl border-2 border-brand-200 bg-brand-50/40 p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-extrabold">{p.name}</h3>
                    <span className="badge badge-green">{p.sessions} buổi × 25 phút</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{p.description}</p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-brand-700">{formatVnd(p.salePrice ?? p.price)}</span>
                    {p.salePrice && <span className="text-sm text-slate-400 line-through">{formatVnd(p.price)}</span>}
                  </div>
                  <ul className="mt-4 space-y-1.5 text-sm text-slate-700">
                    {feats.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-brand-600" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/thanh-toan/${p.code}`} className="btn btn-primary mt-5 w-full">
                    Mua gói {p.name}
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
