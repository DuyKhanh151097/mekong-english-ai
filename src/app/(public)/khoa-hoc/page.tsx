import Link from "next/link";
import { PlayCircle, BookOpen, Mic, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";
import { formatVnd, LESSON_TYPE_LABELS, PACKAGE_LABELS } from "@/lib/utils";

export const metadata = { title: "Khoá học & Thư viện Video bài giảng" };

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ pkg?: string; grade?: string }>;
}) {
  const sp = await searchParams;
  const pkg = sp.pkg || "ALL";
  const grade = sp.grade ? Number(sp.grade) : undefined;

  const [courses, videos] = await Promise.all([
    db.course.findMany({
      where: {
        status: "PUBLISHED",
        ...(pkg !== "ALL" ? { package: pkg } : {}),
        ...(grade ? { grade } : {}),
      },
      include: { chapters: { include: { lessons: true }, orderBy: { order: "asc" } } },
      orderBy: { order: "asc" },
    }),
    db.video.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="py-10">
      <div className="container space-y-10">
        {/* Đầu trang & bộ lọc */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">📚 Học liệu số chuẩn hoá</span>
            <h1 className="text-3xl font-extrabold md:text-4xl">Khoá học & Video bài giảng</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Video bài giảng quay sẵn dùng được nhiều lần, kèm phụ đề song ngữ Anh – Việt, bài tập tương tác và tình huống luyện nói với Gia sư AI.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { code: "ALL", label: "Tất cả" },
              { code: "SCHOOL", label: "English School (THCS)" },
              { code: "CAREER", label: "English Career (Du lịch)" },
              { code: "COMMUNITY", label: "English Community" },
            ].map((f) => (
              <Link
                key={f.code}
                href={f.code === "ALL" ? "/khoa-hoc" : `/khoa-hoc?pkg=${f.code}`}
                className={`btn btn-sm ${pkg === f.code ? "btn-primary" : "btn-outline"}`}
              >
                {f.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Danh sách khoá học */}
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((c) => {
            const lessonCount = c.chapters.reduce((s, ch) => s + ch.lessons.length, 0);
            return (
              <div key={c.id} className="card overflow-hidden">
                <div className="grid sm:grid-cols-5">
                  <div className="relative sm:col-span-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.coverImage || "/images/classroom.jpg"}
                      alt={c.title}
                      className="h-48 w-full object-cover sm:h-full"
                    />
                    <span className="badge badge-green absolute left-3 top-3">
                      {PACKAGE_LABELS[c.package] || c.package}
                    </span>
                  </div>
                  <div className="flex flex-col justify-between p-5 sm:col-span-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-500">
                        {c.levelLabel} · {c.chapters.length} chương · {lessonCount} bài · GV: {c.teacherName}
                      </div>
                      <h2 className="mt-1 text-lg font-extrabold">{c.title}</h2>
                      <p className="mt-1 text-xs text-slate-600">{c.subtitle}</p>
                      <div className="mt-3 space-y-1 text-xs text-slate-600">
                        {c.chapters.slice(0, 3).map((ch) => (
                          <div key={ch.id} className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-brand-600" />
                            <span className="truncate">{ch.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <div>
                        {c.isFree ? (
                          <span className="text-lg font-extrabold text-brand-700">Miễn phí</span>
                        ) : (
                          <>
                            <span className="text-lg font-extrabold text-brand-700">
                              {formatVnd(c.salePrice ?? c.price)}
                            </span>
                            {c.salePrice && (
                              <span className="ml-1.5 text-xs text-slate-400 line-through">
                                {formatVnd(c.price)}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/khoa-hoc/${c.slug}`} className="btn btn-sm btn-outline">
                          Xem giáo trình
                        </Link>
                        <Link href={`/hoc?course=${c.slug}`} className="btn btn-sm btn-primary">
                          Học ngay
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Kho Video bài giảng quay sẵn */}
        <div className="card p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="badge badge-gold">🎬 Video bài giảng quay sẵn</span>
              <h2 className="mt-2 text-2xl font-extrabold">Thư viện Video bài giảng ({videos.length} video)</h2>
              <p className="text-sm text-slate-600">
                Quay 1 lần – phục vụ hàng ngàn học viên. Có điều chỉnh tốc độ 0.75x, phụ đề EN/VI và bài tập kiểm tra ngay sau khi xem.
              </p>
            </div>
            <Link href="/hoc" className="btn btn-secondary">
              <PlayCircle className="h-4 w-4" /> Mở trình phát trong App học
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {videos.map((v) => (
              <Link
                key={v.id}
                href={`/hoc?video=${v.id}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-brand-600"
              >
                <div className="relative h-36">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.thumbnail || "/images/tra-su.jpg"} alt={v.title} className="h-full w-full object-cover" />
                  <span className="absolute inset-0 grid place-items-center bg-black/35 text-white">
                    <PlayCircle className="h-10 w-10 transition group-hover:scale-110" />
                  </span>
                  <span className="absolute bottom-2 right-2 rounded bg-black/75 px-2 py-0.5 text-[11px] font-bold text-white">
                    Phụ đề EN/VI
                  </span>
                </div>
                <div className="p-3.5">
                  <div className="font-bold group-hover:text-brand-700">{v.title}</div>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                    <span>{v.views} lượt xem</span>
                    <span className="text-brand-700 font-semibold">Xem & làm bài tập →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Gợi ý kết hợp Live Speaking */}
        <div className="rounded-3xl bg-mekong p-6 text-white md:p-8 flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-xl">
            <h3 className="text-xl font-extrabold text-white">
              Muốn luyện phản xạ trực tiếp 1-1 với giáo viên sau khi xem video?
            </h3>
            <p className="mt-1 text-sm text-white/85">
              Đăng ký thêm gói buổi Live Speaking (25 phút/buổi) để được giáo viên sửa phát âm và hội thoại thực tế.
            </p>
          </div>
          <Link href="/luyen-noi-truc-tiep" className="btn btn-lg btn-accent">
            <Mic className="h-5 w-5" /> Đặt lịch Live Speaking
          </Link>
        </div>
      </div>
    </div>
  );
}
