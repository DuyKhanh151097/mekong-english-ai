import Link from "next/link";
import { JoinForm } from "./JoinForm";

export const metadata = { title: "Vào lớp bằng mã lớp / QR" };

export default async function JoinClassPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const sp = await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Vào lớp học</h1>
      <p className="mt-1 text-slate-600">Nhập mã lớp giáo viên cung cấp hoặc quét mã QR. Em không cần tự viết câu lệnh cho AI – mọi bài học đã sẵn sàng.</p>
      <div className="mt-6">
        <JoinForm initialCode={sp.code} />
      </div>
      <p className="mt-6 text-center text-sm text-slate-600">
        Đã có tài khoản? <Link href="/dang-nhap" className="font-semibold text-brand-700 hover:underline">Đăng nhập</Link>
      </p>
    </div>
  );
}
