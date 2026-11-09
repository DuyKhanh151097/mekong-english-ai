import Link from "next/link";
import { BookOpen, Mic, Compass, BarChart3, Video, LogOut, Flame, Sparkles, Monitor } from "lucide-react";
import { requireUser, getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/auth-actions";
import { DemoRoleSwitcher } from "@/components/DemoRoleSwitcher";
import { Logo } from "@/components/Logo";

export default async function LearnerLayout({ children }: { children: React.ReactNode }) {
  const [user, session] = await Promise.all([requireUser(), getSession()]);

  const navItems = [
    { href: "/hoc", label: "Học hôm nay", shortLabel: "Học hôm nay", icon: BookOpen },
    { href: "/hoc/luyen-noi", label: "Luyện nói", shortLabel: "Luyện nói", icon: Mic },
    { href: "/hoc/nhiem-vu", label: "Nhiệm vụ thực tế", shortLabel: "Nhiệm vụ", icon: Compass },
    { href: "/hoc/tien-bo", label: "Tiến bộ của tôi", shortLabel: "Tiến bộ", icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-surface pb-20 lg:pb-0">
      <DemoRoleSwitcher />

      {/* Header gọn cho người học + Nút đăng xuất rõ ràng (phục vụ cả phòng máy trường học) */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 flex h-16 items-center justify-between gap-2 lg:gap-4">
          <div className="flex items-center gap-2 lg:gap-3 xl:gap-5 min-w-0 shrink-0">
            <Logo href="/hoc" />
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0" aria-label="4 mục chính">
              {navItems.map((it) => {
                const Icon = it.icon;
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition shrink-0"
                  >
                    <Icon className="h-4 w-4 text-brand-600 shrink-0" />
                    <span className="whitespace-nowrap hidden xl:inline">{it.label}</span>
                    <span className="whitespace-nowrap xl:hidden">{it.shortLabel}</span>
                  </Link>
                );
              })}
              <Link
                href="/hoc/live"
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-orange-50 px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-bold text-silt-600 hover:bg-orange-100 transition shrink-0"
              >
                <Video className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Live GV ({user.liveCredits})</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="badge badge-gold whitespace-nowrap shrink-0 px-2 sm:px-2.5" title="Chuỗi ngày học liên tiếp">
              <Flame className="h-3.5 w-3.5 text-orange-600 shrink-0" />
              <span className="whitespace-nowrap">{user.streak} ngày</span>
            </span>
            <span className="badge badge-green hidden sm:inline-flex whitespace-nowrap shrink-0 px-2 sm:px-2.5" title="Điểm kinh nghiệm">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">{user.xp} XP</span>
            </span>
            <span
              className="hidden text-xs font-bold text-slate-700 whitespace-nowrap shrink-0 xl:inline max-w-[120px] truncate"
              title={user.name}
            >
              {user.name}
            </span>
            <form action={logoutAction} className="shrink-0 inline-flex">
              <button
                type="submit"
                className="btn btn-sm btn-outline whitespace-nowrap shrink-0 border-red-200 text-red-700 hover:bg-red-50 px-2.5 sm:px-3"
                title="Đăng xuất tài khoản cá nhân"
              >
                <LogOut className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">Đăng xuất</span>
              </button>
            </form>
          </div>
        </div>

        {session?.shared && (
          <div className="bg-amber-100 px-4 py-1.5 text-center text-xs font-semibold text-amber-900">
            <Monitor className="mr-1 inline h-3.5 w-3.5" />
            Đang ở <b>Chế độ phòng máy dùng chung</b> – Nhớ bấm <b>Đăng xuất</b> góc phải sau khi kết thúc buổi học nhé!
          </div>
        )}
      </header>

      <main className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 flex-1 py-6">{children}</main>

      {/* Thanh điều hướng đáy màn hình trên điện thoại & tablet (<1024px) – ĐÚNG 4 MỤC CHÍNH */}
      <nav
        aria-label="Điều hướng học tập 4 mục"
        className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-slate-200 bg-white py-1.5 shadow-lg lg:hidden"
      >
        {navItems.map((it) => {
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className="flex flex-col items-center justify-center gap-0.5 py-1 text-[11px] font-bold text-slate-700 hover:text-brand-700 whitespace-nowrap"
            >
              <Icon className="h-5 w-5 text-brand-600 shrink-0" />
              <span className="whitespace-nowrap">{it.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
