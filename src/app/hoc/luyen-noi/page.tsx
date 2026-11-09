import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { parseJson } from "@/lib/utils";
import { SpeakingPracticeWidget } from "@/components/SpeakingPracticeWidget";

export const metadata = { title: "Luyện nói với Gia sư AI – 3 mức trợ giúp" };

export default async function LearnerSpeakingPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const sp = await searchParams;
  const user = await requireUser();

  const [scenarios, progressList] = await Promise.all([
    db.scenario.findMany({ where: { status: "PUBLISHED" }, orderBy: { order: "asc" } }),
    db.scenarioProgress.findMany({ where: { userId: user.id } }),
  ]);

  const progressMap = new Map(progressList.map((p) => [p.scenarioId, p]));
  const current =
    (sp.slug && scenarios.find((s) => s.slug === sp.slug)) ||
    scenarios.find((s) => s.slug === "gioi-thieu-tra-su") ||
    scenarios[0];

  const currentProgress = current ? progressMap.get(current.id) : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="eyebrow whitespace-nowrap">🗣️ Mục 2 · Luyện nói có hướng dẫn</span>
          <h1 className="text-2xl font-extrabold md:text-3xl text-ink">
            Gia sư AI thích ứng 3 mức trợ giúp (Scaffolding)
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-3xl">
            Ban đầu có câu mẫu &amp; khung câu (Mức 1); khi em nói đạt yêu cầu 2 lượt liên tiếp, AI tự động giảm trợ giúp sang Mức 2 và Mức 3.
          </p>
        </div>
      </div>

      {/* Danh sách 8 tình huống học tập địa phương – Cân đối chiều cao, không bị tràn hay lệch dòng */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {scenarios.map((s) => {
          const p = progressMap.get(s.id);
          const active = current?.id === s.id;
          return (
            <Link
              key={s.id}
              href={`/hoc/luyen-noi?slug=${s.slug}`}
              className={`flex flex-col justify-between rounded-2xl border p-4 transition h-full min-h-[120px] ${
                active
                  ? "border-2 border-brand-600 bg-brand-50/80 shadow-sm ring-2 ring-brand-600/20"
                  : "border-slate-200 bg-white hover:border-brand-400 hover:shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1.5 text-xs">
                  <span className="badge badge-green whitespace-nowrap shrink-0 text-[11px] font-bold">
                    {s.topic}
                  </span>
                  <span className="font-bold text-amber-700 whitespace-nowrap shrink-0 text-[11px]">
                    Mức {p?.scaffoldLevel ?? 1}/3{s.isTransfer ? " · Vận dụng" : ""}
                  </span>
                </div>
                <div
                  className="mt-2 text-sm font-extrabold text-ink leading-snug line-clamp-2 min-h-[2.5rem] flex items-center"
                  title={s.titleVi || s.title}
                >
                  {s.titleVi || s.title}
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="whitespace-nowrap">Điểm cao nhất:</span>
                <span className="font-extrabold text-brand-700 whitespace-nowrap">
                  {p?.bestScore ?? 0}/100
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Trình luyện nói AI thích ứng */}
      {current && (
        <SpeakingPracticeWidget
          key={current.id}
          initialLevel={currentProgress?.scaffoldLevel ?? 1}
          scenario={{
            slug: current.slug,
            title: current.title,
            titleVi: current.titleVi,
            topic: current.topic,
            image: current.image,
            goalVi: current.goalVi,
            contextVi: current.contextVi,
            aiOpening: current.aiOpening,
            keywords: parseJson<string[]>(current.keywordsJson, []),
            frames: parseJson<string[]>(current.framesJson, []),
            hints: parseJson<string[]>(current.hintsJson, []),
            followUps: parseJson<string[]>(current.followUpsJson, []),
            modelAnswer: current.modelAnswer,
          }}
        />
      )}
    </div>
  );
}
