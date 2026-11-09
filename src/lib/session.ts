import { SignJWT, jwtVerify } from "jose";

/** Phiên đăng nhập dạng JWT lưu trong cookie httpOnly. File này an toàn cho Edge (middleware). */

export const SESSION_COOKIE = "mk_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 ngày
export const SHARED_DEVICE_MAX_AGE = 60 * 60 * 2; // phòng máy: 2 giờ

export type SessionPayload = {
  uid: string;
  role: string;
  name: string;
  shared?: boolean; // đăng nhập trên máy dùng chung (phòng máy)
  imp?: string; // id quản trị viên đang "đăng nhập thay"
};

function key() {
  const secret = process.env.AUTH_SECRET || "mekong-dev-secret";
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload, maxAgeSec = SESSION_MAX_AGE) {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + maxAgeSec)
    .sign(key());
}

export async function verifySession(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export const ADMIN_ROLES = ["ADMIN", "EDITOR", "SALES"];
export const TEACHER_ROLES = ["TEACHER", "SCHOOL_ADMIN", "ADMIN"];

/** Trang mặc định sau khi đăng nhập theo vai trò */
export function homeForRole(role: string) {
  switch (role) {
    case "ADMIN":
    case "EDITOR":
    case "SALES":
      return "/admin";
    case "TEACHER":
    case "SCHOOL_ADMIN":
      return "/lop-hoc";
    case "PARENT":
      return "/phu-huynh";
    case "TUTOR":
      return "/giang-vien";
    default:
      return "/hoc";
  }
}
