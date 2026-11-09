import Link from "next/link";
import { Flame, Sparkles, Trophy, Volume2, Video } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Tiến bộ của tôi" };

export default async function LearnerProgressPage() {
  const user = await requireUser();

  const [sessions, attempts, scenarioProgress, classmates] = await Promise.all([
    db.studySession.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    db.speakingAttempt.findMany({
      where: { userId: user.id },
      include: { scenario: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    db.scenarioProgress.findMany({
      where: { userId: user.id },
      include: { scenario: true },
    }),
    db.user.findMany({
      where: { role: "STUDENT" },
      orderBy: { xp: "desc" },
      take: 8,
    }),
  ]);

  const totalMinutes = sessions.reduce((s, it) => s + it.minutes, 0);
  const avgSpeaking =
    attempts.length > 0
      ? Math.round(attempts.reduce((s, a) => s + a.overall, 0) / attempts.length)
      : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">📈 Mục 4 · Nhìn thấy tiến bộ mỗi tuần</span>
          <h1 className="text-2xl font-extrabold md:text-3xl">Tiến bộ học tập của {user.name}</h1>
        </div>
        <Link href="/hoc/live" className="btn btn-primary">
          <Video className="h-4 w-4" /> Lịch học trực tiếp với GV ({user.liveCredits} buổi)
        </Link>
      </div>

      {/* 4 chỉ số tổng quan */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500">Chuỗi ngày học (Streak)</div>
          <div className="mt-1 flex items-center gap-2 text-2xl font-extrabold text-orange-600">
            <Flame className="h-6 w-6" /> {user.streak} ngày
          </div>
        </div>
        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500">Điểm kinh nghiệm</div>
          <div className="mt-1 flex items-center gap-2 text-2xl font-extrabold text-brand-700">
            <Sparkles className="h-6 w-6" /> {user.xp} XP
          </div>
        </div>
        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500">Số buổi 15&apos; đã hoàn thành</div>
          <div className="mt-1 text-2xl font-extrabold text-ink">
            {sessions.length} buổi ({totalMinutes} phút)
          </div>
        </div>
        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500">Điểm nói trung bình</div>
          <div className="mt-1 text-2xl font-extrabold text-teal-700">{avgSpeaking}/100</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Mức trợ giúp hiện tại theo từng tình huống */}
        <div className="card p-6 lg:col-span-7 space-y-4">
          <h2 className="text-lg font-extrabold">
            🧭 Mức trợ giúp AI hiện tại theo từng chủ đề (Cơ chế giảm dần trợ giúp)
          </h2>
          <div className="space-y-3">
            {scenarioProgress.map((sp) => (
              <div key={sp.id} className="rounded-xl border border-slate-200 p-3.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold">{sp.scenario.titleVi || sp.scenario.title}</span>
                  <span className="badge badge-gold">Mức trợ giúp {sp.scaffoldLevel}/3</span>
                </div>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-600"
                    style={{ width: `${Math.min(100, sp.bestScore)}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-xs text-slate-500">
                  <span>Đã luyện: {sp.attempts} lượt</span>
                  <span>Điểm tốt nhất: {sp.bestScore}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bảng xếp hạng lớp */}
        <div className="card p-6 lg:col-span-5 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-extrabold">
            <Trophy className="h-5 w-5 text-amber-500" /> Bảng khích lệ trong lớp
          </h2>
          <div className="space-y-2">
            {classmates.map((st, idx) => (
              <div
                key={st.id}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm ${
                  st.id === user.id ? "bg-brand-50 font-extrabold text-brand-900" : "bg-slate-50"
                }`}
              >
                <span>
                  #{idx + 1} · {st.name}
                </span>
                <span className="text-xs font-bold text-brand-700">
                  {st.xp} XP · {st.streak}🔥
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lịch sử bản ghi nói trước - sau */}
      <div className="card p-6">
        <h2 className="text-lg font-extrabold">🎤 Lịch sử các lượt luyện nói gần đây</h2>
        <div className="mt-4 space-y-3">
          {attempts.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3.5 text-sm"
            >
              <div>
                <div className="font-bold">
                  {a.scenario?.titleVi || "Tình huống giao tiếp"} ·{" "}
                  <span className="text-brand-700">{a.overall}/100 điểm</span> (Mức {a.scaffoldLevel})
                </div>
                <div className="text-xs text-slate-600">&ldquo;{a.transcript}&rdquo;</div>
                {a.feedbackVi && <div className="mt-0.5 text-xs text-slate-500">{a.feedbackVi}</div>}
              </div>
              <span className="text-xs text-slate-400">{formatDate(a.createdAt, true)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
