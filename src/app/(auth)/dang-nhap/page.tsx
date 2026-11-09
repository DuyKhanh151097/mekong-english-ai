import Link from "next/link";
import { QrCode, Sparkles } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { quickSwitchAccountAction } from "@/lib/public-actions";

export const metadata = { title: "Đăng nhập" };

const DEMO_BUTTONS = [
  { label: "👨‍🎓 Học sinh (Lớp 6A1)", email: "hocsinh@mekong.ai", hint: "Vào app học 4 mục" },
  { label: "👨‍👩‍👧 Phụ huynh", email: "phuhuynh@mekong.ai", hint: "Xem báo cáo tuần" },
  { label: "👩‍🏫 Giáo viên trường", email: "giaovien@mekong.ai", hint: "Quản lý lớp & giao bài" },
  { label: "🎥 Giáo viên Live", email: "tutor@mekong.ai", hint: "Dạy trực tiếp 25 phút" },
  { label: "🛡️ Quản trị (Admin CMS)", email: "admin@mekong.ai", hint: "Quản trị toàn hệ thống" },
];

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; loggedout?: string }> }) {
  const sp = await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Chào mừng trở lại 👋</h1>
      <p className="mt-1 text-slate-600">Đăng nhập để tiếp tục buổi học 15 phút hôm nay.</p>

      {/* Box 1-Click Demo Login */}
      <div className="mt-6 rounded-2xl border-2 border-brand-500 bg-brand-50/70 p-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-900">
          <Sparkles className="h-4 w-4 text-brand-600" /> Bấm 1-Click để vào ngay tài khoản Demo:
        </div>
        <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {DEMO_BUTTONS.map((acc) => (
            <form key={acc.email} action={quickSwitchAccountAction}>
              <input type="hidden" name="email" value={acc.email} />
              <button
                type="submit"
                className="flex w-full flex-col items-start rounded-xl border border-brand-200 bg-white p-2.5 text-left text-xs transition hover:border-brand-500 hover:shadow-sm"
              >
                <span className="font-bold text-ink">{acc.label}</span>
                <span className="text-[11px] text-slate-500">{acc.hint}</span>
              </button>
            </form>
          ))}
        </div>
      </div>

      <Link href="/vao-lop" className="mt-4 flex items-center gap-3 rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/50 p-4 text-brand-800 hover:bg-brand-100">
        <QrCode className="h-8 w-8 shrink-0" />
        <span>
          <b className="block">Học sinh có mã lớp?</b>
          <span className="text-sm">Nhập mã lớp hoặc quét mã QR giáo viên đưa</span>
        </span>
      </Link>

      <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" /> hoặc nhập tài khoản & mật khẩu <span className="h-px flex-1 bg-slate-200" />
      </div>

      <LoginForm next={sp.next} loggedOut={!!sp.loggedout} />

      <p className="mt-6 text-center text-sm text-slate-600">
        Chưa có tài khoản?{" "}
        <Link href="/dang-ky" className="font-semibold text-brand-700 hover:underline">Đăng ký học thử miễn phí</Link>
      </p>

      <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
        <div className="font-semibold text-slate-800">Danh sách tài khoản & mật khẩu mẫu:</div>
        <ul className="mt-2 space-y-1">
          <li>• Quản trị: <code>admin@mekong.ai</code> (hoặc gõ <code>admin</code>) / <code>admin123</code></li>
          <li>• Giáo viên: <code>giaovien@mekong.ai</code> (hoặc gõ <code>giaovien</code>) / <code>123456</code></li>
          <li>• Học sinh: <code>hocsinh@mekong.ai</code> (hoặc gõ <code>hocsinh</code>) / <code>123456</code></li>
          <li>• Phụ huynh: <code>phuhuynh@mekong.ai</code> (hoặc gõ <code>phuhuynh</code>) / <code>123456</code></li>
          <li>• Giáo viên Live: <code>tutor@mekong.ai</code> (hoặc gõ <code>tutor</code>) / <code>123456</code></li>
        </ul>
      </div>
    </div>
  );
}
