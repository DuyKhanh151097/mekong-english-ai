import Link from "next/link";
import { RegisterForm } from "./RegisterForm";

export const metadata = { title: "Đăng ký học thử miễn phí" };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ class?: string }> }) {
  const sp = await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Bắt đầu học miễn phí</h1>
      <p className="mt-1 text-slate-600">Chỉ mất 1 phút. Học thử ngay bài &ldquo;Giới thiệu Rừng tràm Trà Sư&rdquo;.</p>
      <div className="mt-6">
        <RegisterForm classCode={sp.class} />
      </div>
      <p className="mt-6 text-center text-sm text-slate-600">
        Đã có tài khoản?{" "}
        <Link href="/dang-nhap" className="font-semibold text-brand-700 hover:underline">Đăng nhập</Link>
      </p>
    </div>
  );
}
