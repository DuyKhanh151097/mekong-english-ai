import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_ROLES, SESSION_COOKIE, TEACHER_ROLES, verifySession } from "@/lib/session";

/** Bảo vệ các khu vực cần đăng nhập theo vai trò */
const RULES: Array<{ prefix: string; roles?: string[] }> = [
  { prefix: "/admin", roles: ADMIN_ROLES },
  { prefix: "/lop-hoc", roles: TEACHER_ROLES },
  { prefix: "/phu-huynh", roles: ["PARENT", "ADMIN"] },
  { prefix: "/giang-vien", roles: ["TUTOR", "ADMIN"] },
  { prefix: "/hoc" }, // mọi người dùng đã đăng nhập
  { prefix: "/tai-khoan" },
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const rule = RULES.find((r) => pathname === r.prefix || pathname.startsWith(r.prefix + "/"));
  if (!rule) return NextResponse.next();

  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/dang-nhap";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (rule.roles && !rule.roles.includes(session.role)) {
    const url = req.nextUrl.clone();
    url.pathname = "/khong-co-quyen";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/lop-hoc/:path*", "/phu-huynh/:path*", "/giang-vien/:path*", "/hoc/:path*", "/tai-khoan/:path*"],
};
