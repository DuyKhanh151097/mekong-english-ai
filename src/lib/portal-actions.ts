"use server";

import { revalidatePath } from "next/cache";
import { db } from "./db";
import { requireUser, audit } from "./auth";
import { randomCode } from "./utils";

/** Giáo viên tạo lớp học mới (tự sinh mã lớp & QR) */
export async function createClassroomAction(formData: FormData) {
  const user = await requireUser(["TEACHER", "SCHOOL_ADMIN", "ADMIN"]);
  const name = String(formData.get("name") || "").trim();
  const grade = Number(formData.get("grade") || 6);
  const pilotGroup = String(formData.get("pilotGroup") || "EXPERIMENT");
  if (!name) return;

  await db.classroom.create({
    data: {
      name,
      code: "AG" + grade + randomCode(3),
      grade,
      teacherId: user.id,
      organizationId: user.organizationId,
      pilotGroup,
    },
  });
  revalidatePath("/lop-hoc");
  revalidatePath("/admin/truong-hoc");
}

/** Giáo viên chọn chủ đề & giao bài cho lớp */
export async function createAssignmentAction(formData: FormData) {
  await requireUser(["TEACHER", "SCHOOL_ADMIN", "ADMIN"]);
  const classroomId = String(formData.get("classroomId") || "");
  const title = String(formData.get("title") || "").trim();
  const lessonId = String(formData.get("lessonId") || "") || null;
  const scenarioId = String(formData.get("scenarioId") || "") || null;
  const note = String(formData.get("note") || "").trim() || null;

  if (!classroomId || !title) return;

  await db.assignment.create({
    data: {
      classroomId,
      title,
      lessonId,
      scenarioId,
      note,
      dueAt: new Date(Date.now() + 5 * 86400000),
    },
  });
  revalidatePath("/lop-hoc");
  revalidatePath("/hoc");
}

/** Giáo viên chấm nhiệm vụ thực tế hoặc sửa phản hồi AI */
export async function gradeTaskSubmissionAction(formData: FormData) {
  const teacher = await requireUser(["TEACHER", "SCHOOL_ADMIN", "ADMIN"]);
  const submissionId = String(formData.get("submissionId") || "");
  const teacherScore = Number(formData.get("teacherScore") || 8);
  const teacherFeedback = String(formData.get("teacherFeedback") || "").trim();
  if (!submissionId) return;

  await db.taskSubmission.update({
    where: { id: submissionId },
    data: { teacherScore, teacherFeedback, status: "REVIEWED" },
  });
  await audit(teacher.id, "GRADE_TASK", "TaskSubmission", submissionId, `Điểm GV: ${teacherScore}/10`);
  revalidatePath("/lop-hoc");
  revalidatePath("/hoc/nhiem-vu");
}

/** Giáo viên sửa phản hồi / điểm của Gia sư AI trên một lượt nói */
export async function updateSpeakingAttemptByTeacherAction(formData: FormData) {
  const teacher = await requireUser(["TEACHER", "SCHOOL_ADMIN", "ADMIN"]);
  const attemptId = String(formData.get("attemptId") || "");
  const teacherScore = Number(formData.get("teacherScore") || 75);
  const feedbackVi = String(formData.get("feedbackVi") || "").trim();
  if (!attemptId) return;

  await db.speakingAttempt.update({
    where: { id: attemptId },
    data: {
      teacherScore,
      ...(feedbackVi ? { feedbackVi } : {}),
    },
  });
  await audit(teacher.id, "EDIT_AI_FEEDBACK", "SpeakingAttempt", attemptId, `Điểm GV: ${teacherScore}`);
  revalidatePath("/lop-hoc");
  revalidatePath("/admin/ai-thi-diem");
}

/** Phụ huynh bật/tắt đồng ý thu thập bản ghi giọng nói & thời hạn lưu (Nghị định 13/2023) */
export async function updateParentConsentAction(formData: FormData) {
  const parent = await requireUser(["PARENT", "ADMIN"]);
  const studentId = String(formData.get("studentId") || "");
  const granted = formData.get("granted") === "on";
  const retentionDays = Number(formData.get("retentionDays") || 180);

  if (!studentId) return;
  const existing = await db.consent.findFirst({ where: { studentId, type: "VOICE_RECORDING" } });
  if (existing) {
    await db.consent.update({
      where: { id: existing.id },
      data: { granted, retentionDays, grantedById: parent.id },
    });
  } else {
    await db.consent.create({
      data: { studentId, grantedById: parent.id, type: "VOICE_RECORDING", granted, retentionDays },
    });
  }
  await audit(parent.id, "UPDATE_CONSENT", "Consent", studentId, `granted=${granted}, days=${retentionDays}`);
  revalidatePath("/phu-huynh");
  revalidatePath("/admin/ai-thi-diem");
}

/** Giáo viên Live thêm ca trống và ghi nhận xét sau buổi học */
export async function createTutorSlotAction(formData: FormData) {
  await requireUser(["TUTOR", "ADMIN"]);
  const tutorId = String(formData.get("tutorId") || "");
  const dateStr = String(formData.get("startAt") || "");
  const type = String(formData.get("type") || "ONE_ON_ONE");
  const topic = String(formData.get("topic") || "").trim() || null;
  if (!tutorId || !dateStr) return;

  const startAt = new Date(dateStr);
  await db.tutorSlot.create({
    data: {
      tutorId,
      startAt,
      durationMin: 25,
      type,
      capacity: type === "GROUP" ? 5 : 1,
      topic,
      meetingUrl: `https://meet.jit.si/mekong-live-${randomCode(5)}`,
    },
  });
  revalidatePath("/giang-vien");
  revalidatePath("/luyen-noi-truc-tiep");
}

export async function saveLiveFeedbackAction(formData: FormData) {
  await requireUser(["TUTOR", "ADMIN"]);
  const bookingId = String(formData.get("bookingId") || "");
  const tutorFeedback = String(formData.get("tutorFeedback") || "").trim();
  if (!bookingId) return;

  await db.booking.update({
    where: { id: bookingId },
    data: { tutorFeedback, status: "COMPLETED" },
  });
  revalidatePath("/giang-vien");
  revalidatePath("/hoc/live");
}
