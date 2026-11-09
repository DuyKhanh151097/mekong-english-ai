import Link from "next/link";
import { PlayCircle, CheckCircle2, ClipboardList, Mic, Compass, BarChart3 } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { LESSON_TYPE_LABELS, parseJson } from "@/lib/utils";
import { DailySessionPlayer } from "./DailySessionPlayer";

export const metadata = { title: "Học hôm nay – Buổi học 15 phút" };

export default async function LearnerHomePage({
  searchParams,
}: {
  searchParams: Promise<{ lesson?: string; course?: string; joined?: string }>;
}) {
  const sp = await searchParams;
  const user = await requireUser();

  const [courses, assignments, progressList, defaultScenario] = await Promise.all([
    db.course.findMany({
      where: { status: "PUBLISHED" },
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
      },
      orderBy: { order: "asc" },
    }),
    db.assignment.findMany({
      include: { classroom: true, lesson: true, scenario: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    db.lessonProgress.findMany({ where: { userId: user.id } }),
    db.scenario.findUnique({ where: { slug: "gioi-thieu-tra-su" } }),
  ]);

  const allLessons = courses.flatMap((c) => c.chapters.flatMap((ch) => ch.lessons));
  const selectedLesson =
    (sp.lesson && allLessons.find((l) => l.id === sp.lesson)) ||
    allLessons.find((l) => l.title.includes("Trà Sư")) ||
    allLessons[0];

  const parsedContent = parseJson<{
    vocab?: Array<{ word: string; ipa: string; meaning: string; example: string }>;
    sentences?: Array<{ en: string; vi: string }>;
    dialogue?: Array<{ speaker: string; en: string; vi: string }>;
    tipVi?: string;
  }>(selectedLesson?.contentJson, {});

  const rawScenario = selectedLesson?.scenario || defaultScenario;
  const scenarioClient = {
    slug: rawScenario?.slug || "gioi-thieu-tra-su",
    title: rawScenario?.title || "Introduce Tra Su Cajeput Forest",
    titleVi: rawScenario?.titleVi || "Giới thiệu Rừng tràm Trà Sư",
    topic: rawScenario?.topic || "Du lịch An Giang",
    image: rawScenario?.image || "/images/tra-su.jpg",
    goalVi: rawScenario?.goalVi || "Giới thiệu Rừng tràm Trà Sư cho một bạn nước ngoài.",
    contextVi: rawScenario?.contextVi,
    aiOpening: rawScenario?.aiOpening || "Where should I go in An Giang?",
    keywords: parseJson<string[]>(rawScenario?.keywordsJson, ["Tra Su", "cajeput forest", "boat", "birds"]),
    frames: parseJson<string[]>(rawScenario?.framesJson, ["You should visit ___.", "You can go by ___."]),
    hints: parseJson<string[]>(rawScenario?.hintsJson, []),
    followUps: parseJson<string[]>(rawScenario?.followUpsJson, ["What can I do there?"]),
    modelAnswer: rawScenario?.modelAnswer,
  };

  const completedIds = new Set(progressList.filter((p) => p.completed).map((p) => p.lessonId));

  return (
    <div className="space-y-8">
      {sp.joined && (
        <div className="rounded-2xl bg-brand-600 px-5 py-3 text-sm font-bold text-white">
          🎉 Chào mừng em đã tham gia lớp <b>{sp.joined}</b>! Hãy bắt đầu buổi học 15 phút bên dưới nhé.
        </div>
      )}

      {/* 4 Ô ĐIỀU HƯỚNG RÕ RÀNG TRÊN MÀN HÌNH CHÍNH */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Link href="/hoc" className="card flex items-center gap-3 border-2 border-brand-600 bg-brand-50/60 p-4">
          <PlayCircle className="h-8 w-8 shrink-0 text-brand-600" />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-brand-700 whitespace-nowrap">Mục 1</div>
            <div className="text-sm font-extrabold text-ink whitespace-nowrap">Học hôm nay (15&apos;)</div>
          </div>
        </Link>
        <Link href="/hoc/luyen-noi" className="card card-hover flex items-center gap-3 p-4">
          <Mic className="h-8 w-8 shrink-0 text-teal-600" />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-500 whitespace-nowrap">Mục 2</div>
            <div className="text-sm font-extrabold text-ink whitespace-nowrap">Luyện nói AI</div>
          </div>
        </Link>
        <Link href="/hoc/nhiem-vu" className="card card-hover flex items-center gap-3 p-4">
          <Compass className="h-8 w-8 shrink-0 text-silt-500" />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-500 whitespace-nowrap">Mục 3</div>
            <div className="text-sm font-extrabold text-ink whitespace-nowrap">Nhiệm vụ thực tế</div>
          </div>
        </Link>
        <Link href="/hoc/tien-bo" className="card card-hover flex items-center gap-3 p-4">
          <BarChart3 className="h-8 w-8 shrink-0 text-amber-600" />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-500 whitespace-nowrap">Mục 4</div>
            <div className="text-sm font-extrabold text-ink whitespace-nowrap">Tiến bộ của tôi</div>
          </div>
        </Link>
      </div>

      {/* TRÌNH CHẠY BUỔI HỌC 15 PHÚT (5 BƯỚC) */}
      {selectedLesson && (
        <DailySessionPlayer
          lesson={{
            id: selectedLesson.id,
            title: selectedLesson.title,
            summary: selectedLesson.summary,
            image: selectedLesson.image,
            videoUrl: selectedLesson.video?.url,
            vocab: parsedContent.vocab || [],
            sentences: parsedContent.sentences || [],
            dialogue: parsedContent.dialogue || [],
            tipVi: parsedContent.tipVi,
            questions: selectedLesson.questions.map((q) => ({
              id: q.id,
              type: q.type,
              prompt: q.prompt,
              options: parseJson<string[]>(q.optionsJson, []),
              answer: q.answer,
              explanation: q.explanation,
            })),
          }}
          scenario={scenarioClient}
        />
      )}

      {/* BÀI HỌC DO GIÁO VIÊN GIAO */}
      {assignments.length > 0 && (
        <div className="card p-5">
          <h3 className="flex items-center gap-2 text-base font-extrabold">
            <ClipboardList className="h-5 w-5 text-brand-600" /> Bài giáo viên giao cho lớp
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {assignments.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm"
              >
                <div>
                  <div className="font-bold text-ink">{a.title}</div>
                  <div className="text-xs text-slate-500">
                    Lớp: {a.classroom.name} {a.note ? `· ${a.note}` : ""}
                  </div>
                </div>
                <Link
                  href={
                    a.lessonId
                      ? `/hoc?lesson=${a.lessonId}`
                      : a.scenario
                      ? `/hoc/luyen-noi?slug=${a.scenario.slug}`
                      : "/hoc"
                  }
                  className="btn btn-sm btn-primary shrink-0"
                >
                  Làm ngay
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LỘ TRÌNH BÀI HỌC & VIDEO THEO CHƯƠNG */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold">📚 Chọn bài học hoặc Video bài giảng khác</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {courses.map((c) => (
            <div key={c.id} className="card p-5 space-y-3">
              <div>
                <span className="badge badge-green">{c.levelLabel}</span>
                <h4 className="mt-1 font-extrabold">{c.title}</h4>
              </div>
              <div className="space-y-2">
                {c.chapters.flatMap((ch) => ch.lessons).map((l) => {
                  const done = completedIds.has(l.id);
                  const active = selectedLesson?.id === l.id;
                  return (
                    <Link
                      key={l.id}
                      href={`/hoc?lesson=${l.id}`}
                      className={`flex items-center justify-between rounded-xl border p-3 text-xs transition ${
                        active
                          ? "border-brand-600 bg-brand-50 font-bold text-brand-900"
                          : "border-slate-200 hover:border-brand-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {done ? (
                          <CheckCircle2 className="h-4 w-4 text-brand-600" />
                        ) : (
                          <PlayCircle className="h-4 w-4 text-slate-400" />
                        )}
                        <span>{l.title}</span>
                      </div>
                      <span className="text-slate-500">{LESSON_TYPE_LABELS[l.type] || l.type}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
