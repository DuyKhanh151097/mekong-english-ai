import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, PlayCircle, Lock, Sparkles, Mic } from "lucide-react";
import { db } from "@/lib/db";
import { formatVnd, LESSON_TYPE_LABELS, PACKAGE_LABELS, parseJson } from "@/lib/utils";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await db.course.findUnique({
    where: { slug },
    include: {
      chapters: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: { video: true, scenario: true, questions: true },
          },
        },
      },
      tasks: true,
    },
  });

  if (!course) notFound();

  const objectives = parseJson<string[]>(course.objectivesJson, []);
  const totalLessons = course.chapters.reduce((s, c) => s + c.lessons.length, 0);

  return (
    <div className="py-10">
      <div className="container grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <div>
            <span className="badge badge-green">{PACKAGE_LABELS[course.package] || course.package}</span>
            <h1 className="mt-2 text-2xl font-extrabold md:text-4xl">{course.title}</h1>
            <p className="mt-2 text-slate-600">{course.subtitle}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
              <span>🎓 Cấp độ: {course.levelLabel}</span>
              <span>📖 {course.chapters.length} chương · {totalLessons} bài học</span>
              <span>👩‍🏫 Giáo viên: {course.teacherName}</span>
            </div>
          </div>

          {/* Video giới thiệu khoá học */}
          {course.introVideoUrl && (
            <div className="card overflow-hidden p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold">🎬 Video bài giảng giới thiệu khoá học</span>
                <span className="badge badge-gold">Học thử miễn phí</span>
              </div>
              <video
                controls
                poster={course.coverImage || "/images/classroom.jpg"}
                className="aspect-video w-full rounded-xl bg-black"
                src={course.introVideoUrl}
              />
            </div>
          )}

          {/* Mục tiêu đầu ra */}
          <div className="card p-6">
            <h2 className="text-lg font-extrabold">🎯 Sau khoá học này, người học làm được gì?</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {objectives.map((obj, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Giáo trình chi tiết */}
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold">📋 Nội dung giáo trình ({course.chapters.length} chương)</h2>
            {course.chapters.map((ch) => (
              <div key={ch.id} className="card overflow-hidden">
                <div className="flex items-center justify-between bg-slate-50 px-5 py-3.5">
                  <div>
                    <h3 className="font-extrabold">{ch.title}</h3>
                    {ch.topic && <span className="text-xs text-slate-500">Chủ đề: {ch.topic}</span>}
                  </div>
                  <span className="badge badge-gray">{ch.lessons.length} bài</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {ch.lessons.map((l) => (
                    <div key={l.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 text-sm">
                      <div className="flex items-center gap-3">
                        <PlayCircle className="h-5 w-5 text-brand-600" />
                        <div>
                          <div className="font-bold text-ink">{l.title}</div>
                          <div className="text-xs text-slate-500">
                            {LESSON_TYPE_LABELS[l.type] || l.type} · {l.durationMin} phút
                            {l.questions.length > 0 && ` · ${l.questions.length} câu hỏi`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {l.isFreePreview || course.isFree ? (
                          <Link href={`/hoc?lesson=${l.id}`} className="btn btn-sm btn-secondary">
                            Học thử miễn phí
                          </Link>
                        ) : (
                          <Link href={`/hoc?lesson=${l.id}`} className="btn btn-sm btn-outline">
                            <Lock className="h-3.5 w-3.5" /> Mở bài
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cột phải: Thẻ đăng ký khoá học */}
        <div className="lg:col-span-4">
          <div className="card sticky top-20 space-y-4 p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.coverImage || "/images/classroom.jpg"}
              alt={course.title}
              className="h-44 w-full rounded-xl object-cover"
            />
            <div>
              {course.isFree ? (
                <div className="text-2xl font-extrabold text-brand-700">Miễn phí 100%</div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-brand-700">
                    {formatVnd(course.salePrice ?? course.price)}
                  </span>
                  {course.salePrice && (
                    <span className="text-sm text-slate-400 line-through">{formatVnd(course.price)}</span>
                  )}
                </div>
              )}
              <p className="mt-1 text-xs text-slate-500">
                Bao gồm Video bài giảng, Bài tập tương tác, Gia sư AI 3 mức trợ giúp và Nhiệm vụ thực tế.
              </p>
            </div>

            <Link href={`/hoc?course=${course.slug}`} className="btn btn-lg btn-primary w-full">
              <Sparkles className="h-5 w-5" /> Vào học ngay trên App
            </Link>
            {!course.isFree && (
              <Link href="/thanh-toan/AI_6M" className="btn btn-outline w-full">
                Mua gói AI Premium (Mở toàn bộ khoá)
              </Link>
            )}
            <Link href="/luyen-noi-truc-tiep" className="btn btn-secondary w-full">
              <Mic className="h-4 w-4" /> + Đặt thêm buổi nói 1-1 với GV
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
