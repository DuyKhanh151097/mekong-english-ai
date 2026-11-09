import Link from "next/link";
import { Sparkles, Video, School, QrCode, LayoutDashboard } from "lucide-react";
import { Logo } from "./Logo";
import { getCurrentUser } from "@/lib/auth";
import { homeForRole } from "@/lib/session";

export async function PublicHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 flex h-16 items-center justify-between gap-2 lg:gap-4">
        <Logo href="/" />

        <nav className="hidden items-center gap-1 xl:gap-1.5 lg:flex shrink-0" aria-label="Điều hướng chính">
          <Link
            href="/khoa-hoc"
            className="whitespace-nowrap shrink-0 rounded-lg px-2 xl:px-2.5 py-1.5 text-xs xl:text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-brand-700 transition"
          >
            Khoá học &amp; Video
          </Link>
          <Link
            href="/english-school"
            className="whitespace-nowrap shrink-0 rounded-lg px-2 xl:px-2.5 py-1.5 text-xs xl:text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-brand-700 transition"
          >
            English School
          </Link>
          <Link
            href="/english-career"
            className="whitespace-nowrap shrink-0 rounded-lg px-2 xl:px-2.5 py-1.5 text-xs xl:text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-brand-700 transition"
          >
            English Career
          </Link>
          <Link
            href="/luyen-noi-truc-tiep"
            className="whitespace-nowrap shrink-0 inline-flex items-center gap-1 rounded-lg px-2 xl:px-2.5 py-1.5 text-xs xl:text-sm font-semibold text-silt-600 hover:bg-orange-50 transition"
          >
            <Video className="h-3.5 w-3.5 shrink-0" />
            <span>Live Speaking</span>
          </Link>
          <Link
            href="/nha-truong"
            className="whitespace-nowrap shrink-0 inline-flex items-center gap-1 rounded-lg px-2 xl:px-2.5 py-1.5 text-xs xl:text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-brand-700 transition"
          >
            <School className="h-3.5 w-3.5 shrink-0 text-brand-600" />
            <span>Nhà trường</span>
          </Link>
          <Link
            href="/bang-gia"
            className="whitespace-nowrap shrink-0 rounded-lg px-2 xl:px-2.5 py-1.5 text-xs xl:text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-brand-700 transition"
          >
            Bảng giá
          </Link>
          <Link
            href="/kiem-tra-trinh-do"
            className="whitespace-nowrap shrink-0 rounded-lg px-2 xl:px-2.5 py-1.5 text-xs xl:text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-brand-700 transition"
          >
            Test 10&apos;
          </Link>
          <Link
            href="/blog"
            className="whitespace-nowrap shrink-0 rounded-lg px-2 xl:px-2.5 py-1.5 text-xs xl:text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-brand-700 transition"
          >
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            href="/vao-lop"
            className="btn btn-sm btn-outline whitespace-nowrap shrink-0 hidden sm:inline-flex"
            title="Học sinh nhập mã lớp hoặc quét QR"
          >
            <QrCode className="h-3.5 w-3.5 shrink-0 text-brand-600" />
            <span className="whitespace-nowrap">Mã lớp</span>
          </Link>

          {user ? (
            <>
              <Link href="/hoc" className="btn btn-sm btn-secondary whitespace-nowrap shrink-0">
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">Vào App học</span>
              </Link>
              <Link href={homeForRole(user.role)} className="btn btn-sm btn-primary whitespace-nowrap shrink-0">
                <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">
                  {user.role === "ADMIN" ? "Admin CMS" : "Bảng điều khiển"}
                </span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dang-nhap" className="btn btn-sm btn-ghost whitespace-nowrap shrink-0">
                <span className="whitespace-nowrap">Đăng nhập</span>
              </Link>
              <Link href="/dang-ky" className="btn btn-sm btn-primary whitespace-nowrap shrink-0">
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">Học thử</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Thanh điều hướng cuộn ngang trên điện thoại */}
      <div className="scrollbar-none flex items-center gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 text-xs font-semibold lg:hidden">
        <Link href="/khoa-hoc" className="shrink-0 whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-slate-700">Khoá học &amp; Video</Link>
        <Link href="/english-school" className="shrink-0 whitespace-nowrap rounded-full bg-brand-50 px-3 py-1 text-brand-700">English School (Lớp 6–7)</Link>
        <Link href="/luyen-noi-truc-tiep" className="shrink-0 whitespace-nowrap rounded-full bg-orange-50 px-3 py-1 text-silt-600">Live Speaking (GV)</Link>
        <Link href="/english-career" className="shrink-0 whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-slate-700">English Career</Link>
        <Link href="/nha-truong" className="shrink-0 whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-slate-700">Dành cho Trường</Link>
        <Link href="/bang-gia" className="shrink-0 whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-slate-700">Bảng giá</Link>
        <Link href="/kiem-tra-trinh-do" className="shrink-0 whitespace-nowrap rounded-full bg-rice-100 px-3 py-1 text-amber-900">Test 10&apos;</Link>
      </div>
    </header>
  );
}
