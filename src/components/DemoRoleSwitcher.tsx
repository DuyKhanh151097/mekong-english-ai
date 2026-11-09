import Link from "next/link";
import { UserCheck, LogOut, ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/lib/auth-actions";
import { quickSwitchAccountAction } from "@/lib/public-actions";
import { homeForRole } from "@/lib/session";
import { ROLE_LABELS } from "@/lib/utils";

const DEMO_ACCOUNTS = [
  { label: "Học sinh (Lớp 6A1)", email: "hocsinh@mekong.ai", role: "STUDENT" },
  { label: "Phụ huynh", email: "phuhuynh@mekong.ai", role: "PARENT" },
  { label: "GV Trường", email: "giaovien@mekong.ai", role: "TEACHER" },
  { label: "GV Live", email: "tutor@mekong.ai", role: "TUTOR" },
  { label: "Quản trị (Admin CMS)", email: "admin@mekong.ai", role: "ADMIN" },
];

/**
 * Thanh chuyển nhanh tài khoản dùng thử (1-click) để kiểm tra ngay mọi phân quyền:
 * Học sinh, Phụ huynh, Giáo viên trường, Giáo viên Live và Admin CMS.
 */
export async function DemoRoleSwitcher() {
  const user = await getCurrentUser();

  return (
    <div className="border-b border-slate-800 bg-slate-900 text-xs text-slate-200">
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 flex flex-wrap lg:flex-nowrap items-center justify-between gap-2 py-1.5">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-600/30 px-2 py-0.5 font-semibold text-brand-200 whitespace-nowrap shrink-0 text-[11px] sm:text-xs">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span className="whitespace-nowrap">Đổi nhanh Demo:</span>
          </span>
          {DEMO_ACCOUNTS.map((acc) => {
            const active = user?.email === acc.email;
            return (
              <form key={acc.email} action={quickSwitchAccountAction} className="inline shrink-0">
                <input type="hidden" name="email" value={acc.email} />
                <button
                  type="submit"
                  className={`whitespace-nowrap shrink-0 rounded-lg px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-medium transition ${
                    active
                      ? "bg-rice-500 font-bold text-ink shadow-sm"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <span className="whitespace-nowrap">{acc.label}</span>
                </button>
              </form>
            );
          })}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {user ? (
            <>
              <Link
                href={homeForRole(user.role)}
                className="inline-flex items-center gap-1 font-semibold text-rice-400 hover:underline whitespace-nowrap shrink-0 text-[11px] sm:text-xs"
                title={`${user.name} (${ROLE_LABELS[user.role] || user.role}) → Vào bảng điều khiển`}
              >
                <UserCheck className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap max-w-[200px] sm:max-w-[320px] truncate inline-block">
                  {user.name} ({ROLE_LABELS[user.role] || user.role}) → Vào bảng điều khiển
                </span>
              </Link>
              <form action={logoutAction} className="shrink-0 inline-flex">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 whitespace-nowrap shrink-0 rounded bg-red-600/80 px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-red-600"
                >
                  <LogOut className="h-3 w-3 shrink-0" />
                  <span className="whitespace-nowrap">Đăng xuất</span>
                </button>
              </form>
            </>
          ) : (
            <span className="text-slate-400 whitespace-nowrap shrink-0 text-[11px] sm:text-xs">
              Chưa đăng nhập – bấm 1 nút bên trái để vào thử ngay!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
