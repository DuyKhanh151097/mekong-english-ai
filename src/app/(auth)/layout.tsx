import { Logo } from "@/components/Logo";
import Link from "next/link";
import { DemoRoleSwitcher } from "@/components/DemoRoleSwitcher";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DemoRoleSwitcher />
      <div className="grid flex-1 lg:grid-cols-2">
        <div className="flex flex-col px-5 py-6 sm:px-10">
          <Logo />
          <div className="flex flex-1 items-center justify-center py-10">
            <div className="w-full max-w-md">{children}</div>
          </div>
          <p className="text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Công ty TNHH Công nghệ Mekong Green AI ·{" "}
            <Link href="/chinh-sach-bao-mat" className="hover:underline">
              Chính sách bảo mật
            </Link>
          </p>
        </div>
        <div className="relative hidden overflow-hidden bg-mekong lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-luminosity" />
          <div className="relative flex h-full flex-col justify-end p-12 text-white">
            <p className="text-3xl font-extrabold leading-tight text-balance">Mỗi ngày 15 phút, học điều gần gũi, luyện nói có hướng dẫn và nhìn thấy tiến bộ.</p>
            <p className="mt-4 text-white/80">Học gần gũi – Nói tự tin – Dùng được mỗi ngày.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
