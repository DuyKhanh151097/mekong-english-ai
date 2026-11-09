import "server-only";
import { db } from "./db";

/**
 * Quyền truy cập nội dung.
 * - tier "VIDEO": xem toàn bộ video + bài tập
 * - tier "AI": VIDEO + luyện nói AI không giới hạn hợp lý + nhiệm vụ thực tế + báo cáo phụ huynh
 * Học sinh thuộc lớp của trường có license còn hạn => được tier AI.
 */
export type AccessTier = "FREE" | "VIDEO" | "AI";

export async function getAccessTier(userId: string): Promise<AccessTier> {
  const now = new Date();
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: { where: { status: "ACTIVE", endAt: { gt: now } }, include: { plan: true } },
      organization: true,
      classMembers: { include: { classroom: { include: { organization: true } } } },
    },
  });
  if (!user) return "FREE";
  if (["ADMIN", "EDITOR", "TEACHER", "SCHOOL_ADMIN", "TUTOR"].includes(user.role)) return "AI";

  const orgActive = (o?: { status: string; licenseExpiresAt: Date | null } | null) =>
    !!o && o.status !== "EXPIRED" && (!o.licenseExpiresAt || o.licenseExpiresAt > now);
  if (orgActive(user.organization) || user.classMembers.some((m) => orgActive(m.classroom.organization))) return "AI";

  let tier: AccessTier = "FREE";
  for (const s of user.subscriptions) {
    if (s.plan.tier === "AI") return "AI";
    if (s.plan.tier === "VIDEO") tier = "VIDEO";
  }
  return tier;
}

/** Giới hạn lượt luyện nói AI mỗi ngày theo tier (fair-use) */
export const DAILY_SPEAKING_LIMIT: Record<AccessTier, number> = { FREE: 5, VIDEO: 10, AI: 200 };

export async function speakingUsedToday(userId: string) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return db.speakingAttempt.count({ where: { userId, createdAt: { gte: start } } });
}

/** Bài học có được mở không: bài học thử miễn phí, khoá miễn phí, hoặc có tier >= VIDEO */
export function canOpenLesson(tier: AccessTier, lesson: { isFreePreview: boolean }, course: { isFree: boolean }) {
  return lesson.isFreePreview || course.isFree || tier !== "FREE";
}
