"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import { audit, getCurrentUser, getSession } from "./auth";
import { homeForRole, SESSION_COOKIE, SESSION_MAX_AGE, SHARED_DEVICE_MAX_AGE, signSession, type SessionPayload } from "./session";

export type FormState = { error?: string; ok?: string } | undefined;

async function setSessionCookie(payload: SessionPayload, shared = false) {
  const maxAge = shared ? SHARED_DEVICE_MAX_AGE : SESSION_MAX_AGE;
  const token = await signSession({ ...payload, shared }, maxAge);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // Máy dùng chung: cookie phiên (mất khi đóng trình duyệt)
    ...(shared ? {} : { maxAge }),
  });
}

function findByIdentifier(identifier: string) {
  const id = identifier.trim().toLowerCase();
  const emailCandidate = id.includes("@") ? id : `${id}@mekong.ai`;
  return db.user.findFirst({
    where: {
      OR: [
        { email: id },
        { email: emailCandidate },
        { phone: identifier.trim() },
        { username: id },
      ],
    },
  });
}

/** Đăng nhập bằng email / số điện thoại / tên đăng nhập do trường cấp */
export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const identifier = String(formData.get("identifier") || "");
  const rawPassword = String(formData.get("password") || "");
  const shared = formData.get("shared") === "on";
  const next = String(formData.get("next") || "");
  if (!identifier || !rawPassword) return { error: "Vui lòng nhập tài khoản và mật khẩu." };

  const user = await findByIdentifier(identifier);
  if (!user) {
    return { error: "Không tìm thấy tài khoản. Hãy kiểm tra lại email hoặc số điện thoại." };
  }

  const ok = (await bcrypt.compare(rawPassword, user.passwordHash)) || (await bcrypt.compare(rawPassword.trim(), user.passwordHash));
  if (!ok) {
    return { error: "Mật khẩu không đúng. Với tài khoản mẫu, mật khẩu là 123456 (hoặc admin123 cho admin)." };
  }
  if (user.status !== "ACTIVE") return { error: "Tài khoản đang bị khoá. Vui lòng liên hệ hỗ trợ." };

  await setSessionCookie({ uid: user.id, role: user.role, name: user.name }, shared);
  await db.user.update({ where: { id: user.id }, data: { lastActiveAt: new Date() } });
  await audit(user.id, "LOGIN", "User", user.id, shared ? "Máy dùng chung" : undefined);

  redirect(next && next.startsWith("/") ? next : homeForRole(user.role));
}

/** Đăng ký tài khoản học viên / phụ huynh */
export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") || "").trim();
  const contact = String(formData.get("contact") || "").trim();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "STUDENT") === "PARENT" ? "PARENT" : "STUDENT";
  const grade = Number(formData.get("grade") || 0) || null;
  const classCode = String(formData.get("classCode") || "").trim().toUpperCase();

  if (name.length < 2) return { error: "Vui lòng nhập họ tên." };
  if (!contact) return { error: "Vui lòng nhập số điện thoại hoặc email." };
  if (password.length < 6) return { error: "Mật khẩu cần ít nhất 6 ký tự." };

  const isEmail = contact.includes("@");
  const exists = await db.user.findFirst({ where: isEmail ? { email: contact.toLowerCase() } : { phone: contact } });
  if (exists) return { error: "Số điện thoại/email đã được đăng ký. Vui lòng đăng nhập." };

  const user = await db.user.create({
    data: {
      name,
      role,
      grade,
      email: isEmail ? contact.toLowerCase() : null,
      phone: isEmail ? null : contact,
      passwordHash: await bcrypt.hash(password, 10),
    },
  });

  if (classCode && role === "STUDENT") {
    const cls = await db.classroom.findUnique({ where: { code: classCode } });
    if (cls) {
      await db.classMember.create({ data: { classroomId: cls.id, studentId: user.id } });
      if (cls.organizationId) await db.user.update({ where: { id: user.id }, data: { organizationId: cls.organizationId } });
    }
  }

  await setSessionCookie({ uid: user.id, role: user.role, name: user.name });
  redirect(homeForRole(user.role));
}

/** Tham gia lớp bằng mã lớp / QR. Nếu chưa đăng nhập => chuyển sang đăng ký kèm mã lớp. */
export async function joinClassAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const code = String(formData.get("code") || "").trim().toUpperCase();
  if (!code) return { error: "Vui lòng nhập mã lớp." };
  const cls = await db.classroom.findUnique({ where: { code } });
  if (!cls) return { error: "Không tìm thấy lớp với mã này. Kiểm tra lại với giáo viên nhé!" };

  const user = await getCurrentUser();
  if (!user) redirect(`/dang-ky?class=${code}`);

  await db.classMember.upsert({
    where: { classroomId_studentId: { classroomId: cls.id, studentId: user.id } },
    update: {},
    create: { classroomId: cls.id, studentId: user.id },
  });
  if (cls.organizationId && !user.organizationId) {
    await db.user.update({ where: { id: user.id }, data: { organizationId: cls.organizationId } });
  }
  redirect("/hoc?joined=" + encodeURIComponent(cls.name));
}

export async function logoutAction() {
  const store = await cookies();
  const session = await getSession();
  // Nếu admin đang "đăng nhập thay" => quay lại tài khoản admin
  if (session?.imp) {
    const admin = await db.user.findUnique({ where: { id: session.imp } });
    if (admin) {
      await setSessionCookie({ uid: admin.id, role: admin.role, name: admin.name });
      redirect("/admin/nguoi-dung");
    }
  }
  store.delete(SESSION_COOKIE);
  redirect("/dang-nhap?loggedout=1");
}

/** Quản trị viên đăng nhập thay người dùng (có ghi audit log) */
export async function impersonateAction(userId: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") redirect("/khong-co-quyen");
  const target = await db.user.findUnique({ where: { id: userId } });
  if (!target) return;
  await audit(admin.id, "IMPERSONATE", "User", target.id, `Đăng nhập thay ${target.name}`);
  await setSessionCookie({ uid: target.id, role: target.role, name: target.name, imp: admin.id });
  redirect(homeForRole(target.role));
}
