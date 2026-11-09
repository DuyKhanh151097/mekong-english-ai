"use server";

import { revalidatePath } from "next/cache";
import { db } from "./db";
import { requireUser } from "./auth";
import type { FormState } from "./auth-actions";

/** Lưu hoàn thành một buổi học 15 phút (5 bước) */
export async function completeDailySessionAction(formData: FormData) {
  const user = await requireUser();
  const lessonId = String(formData.get("lessonId") || "") || null;
  const score = Number(formData.get("score") || 85);
  const summaryVi =
    String(formData.get("summaryVi") || "").trim() ||
    "Hoàn thành trọn vẹn 5 bước buổi học 15 phút hôm nay";
  const nextFocusVi =
    String(formData.get("nextFocusVi") || "").trim() ||
    "Ngày mai ôn thêm mẫu câu hỏi đường & phát âm âm cuối /s/.";

  await db.$transaction([
    db.studySession.create({
      data: {
        userId: user.id,
        lessonId,
        minutes: 15,
        stepsCompleted: 5,
        score,
        summaryVi,
        nextFocusVi,
      },
    }),
    db.user.update({
      where: { id: user.id },
      data: {
        xp: { increment: 50 },
        streak: { increment: 1 },
        lastActiveAt: new Date(),
      },
    }),
    ...(lessonId
      ? [
          db.lessonProgress.upsert({
            where: { userId_lessonId: { userId: user.id, lessonId } },
            update: { completed: true, score, videoPct: 100 },
            create: { userId: user.id, lessonId, completed: true, score, videoPct: 100 },
          }),
        ]
      : []),
  ]);

  revalidatePath("/hoc");
  revalidatePath("/hoc/tien-bo");
}

/** Nộp bài Nhiệm vụ thực tế sau chủ đề */
export async function submitRealTaskAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const taskId = String(formData.get("taskId") || "");
  const transcript = String(formData.get("transcript") || "").trim();

  if (!taskId) return { error: "Không tìm thấy nhiệm vụ." };
  if (transcript.split(/\s+/).filter(Boolean).length < 5) {
    return { error: "Em hãy nói hoặc ghi lại ít nhất 2–3 câu tiếng Anh cho nhiệm vụ này nhé!" };
  }

  const words = transcript.split(/\s+/).filter(Boolean).length;
  const aiScore = Math.min(10, Math.max(5, Math.round(5 + Math.min(5, words / 6))));
  const aiFeedbackVi =
    words >= 18
      ? "Bài nói đủ ý, mạch lạc và vận dụng tốt từ vựng trong chủ đề. Giáo viên sẽ nghe và chấm điểm cuối cùng."
      : "Em đã nêu được ý chính. Hãy mở rộng thêm 1–2 câu miêu tả lý do em thích địa điểm/món ăn này nhé!";

  await db.taskSubmission.create({
    data: {
      taskId,
      userId: user.id,
      transcript,
      aiScore,
      aiFeedbackVi,
      status: "SUBMITTED",
    },
  });

  await db.user.update({
    where: { id: user.id },
    data: { xp: { increment: 40 }, lastActiveAt: new Date() },
  });

  revalidatePath("/hoc/nhiem-vu");
  revalidatePath("/lop-hoc");
  return {
    ok: `Đã nộp nhiệm vụ thành công! Điểm sơ bộ từ AI: ${aiScore}/10 — ${aiFeedbackVi}`,
  };
}
