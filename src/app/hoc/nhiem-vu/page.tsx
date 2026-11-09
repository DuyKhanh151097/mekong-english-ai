import { CheckCircle2, Compass } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { formatDate, parseJson } from "@/lib/utils";
import { TaskSubmissionForm } from "./TaskSubmissionForm";

export const metadata = { title: "Nhiệm vụ thực tế & Đánh giá vận dụng" };

export default async function RealTasksPage() {
  const user = await requireUser();
  const [tasks, submissions] = await Promise.all([
    db.realTask.findMany({
      where: { status: "PUBLISHED" },
      include: { course: true },
      orderBy: { order: "asc" },
    }),
    db.taskSubmission.findMany({
      where: { userId: user.id },
      include: { task: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <span className="eyebrow">🎯 Mục 3 · Biến bài học thành nhiệm vụ thực tế</span>
        <h1 className="text-2xl font-extrabold md:text-3xl">
          Nhiệm vụ thực tế & Tình huống vận dụng mới
        </h1>
        <p className="text-sm text-slate-600">
          Sau mỗi chủ đề, em ghi âm giới thiệu một địa điểm gần nhà, hỏi đường hoặc trình bày sản phẩm bằng lời của chính mình để đánh giá khả năng vận dụng ngoài bài tập mẫu.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {tasks.map((t) => {
          const rubric = parseJson<Array<{ criterion: string; maxScore: number; descriptionVi: string }>>(
            t.rubricJson,
            []
          );
          return (
            <div key={t.id} className="card space-y-4 p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="badge badge-green">{t.topic || "Thực hành"}</span>
                    {t.isTransfer && (
                      <span className="badge bg-silt-500 text-white">
                        🌟 Tình huống mới (Đo khả năng vận dụng)
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 text-lg font-extrabold">{t.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{t.descriptionVi}</p>
                </div>
                <Compass className="h-7 w-7 shrink-0 text-brand-600" />
              </div>

              {rubric.length > 0 && (
                <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1">
                  <div className="font-bold text-slate-700">Tiêu chí chấm điểm (Rubric 10 điểm):</div>
                  {rubric.map((r, idx) => (
                    <div key={idx} className="flex justify-between text-slate-600">
                      <span>
                        • <b>{r.criterion}:</b> {r.descriptionVi}
                      </span>
                      <span className="font-bold text-brand-700">{r.maxScore}đ</span>
                    </div>
                  ))}
                </div>
              )}

              <TaskSubmissionForm
                taskId={t.id}
                placeholder="Ghi âm hoặc nhập bài nói tiếng Anh bằng lời của em..."
              />
            </div>
          );
        })}
      </div>

      {/* Lịch sử bài nộp & nhận xét của giáo viên */}
      <div className="card p-6">
        <h2 className="text-lg font-extrabold">📋 Bài nhiệm vụ thực tế em đã nộp ({submissions.length})</h2>
        <div className="mt-4 space-y-3">
          {submissions.map((s) => (
            <div key={s.id} className="rounded-xl border border-slate-200 p-4 text-sm space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-extrabold text-ink">{s.task.title}</span>
                <span className="text-xs text-slate-500">{formatDate(s.createdAt, true)}</span>
              </div>
              <p className="rounded-lg bg-slate-50 p-2.5 text-slate-700">&ldquo;{s.transcript}&rdquo;</p>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <span className="badge badge-green">Điểm AI sơ bộ: {s.aiScore}/10</span>
                {s.teacherScore != null ? (
                  <span className="badge badge-gold">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Giáo viên chấm: {s.teacherScore}/10
                  </span>
                ) : (
                  <span className="badge badge-gray">Đang chờ giáo viên duyệt</span>
                )}
              </div>
              {s.aiFeedbackVi && <div className="text-xs text-slate-600">🤖 Nhận xét AI: {s.aiFeedbackVi}</div>}
              {s.teacherFeedback && (
                <div className="text-xs font-semibold text-brand-800">
                  👩‍🏫 Nhận xét Giáo viên: {s.teacherFeedback}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
