import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "./db";
import { SESSION_COOKIE, verifySession, type SessionPayload } from "./session";

/** Đọc phiên hiện tại từ cookie (không truy vấn DB) */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

/** Lấy người dùng hiện tại (có cache trong một request) */
export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session) return null;
  const user = await db.user.findUnique({ where: { id: session.uid } });
  if (!user || user.status !== "ACTIVE") return null;
  return user;
});

/** Bắt buộc đăng nhập; nếu có roles thì kiểm tra vai trò. Dùng trong Server Component / Server Action. */
export async function requireUser(roles?: string[]) {
  const user = await getCurrentUser();
  if (!user) redirect("/dang-nhap");
  if (roles && roles.length && !roles.includes(user.role)) redirect("/khong-co-quyen");
  return user;
}

/** Ghi nhật ký thao tác (audit log) */
export async function audit(userId: string | null | undefined, action: string, entity: string, entityId?: string | null, detail?: string) {
  try {
    await db.auditLog.create({ data: { userId: userId ?? null, action, entity, entityId: entityId ?? null, detail } });
  } catch {
    // không chặn nghiệp vụ nếu ghi log lỗi
  }
}
