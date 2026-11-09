import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { logoutAction } from "@/lib/auth-actions";

export const metadata = { title: "Không có quyền truy cập" };

export default function ForbiddenPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-mekong-soft p-6">
      <div className="card max-w-md p-8 text-center">
        <ShieldAlert className="mx-auto h-12 w-12 text-silt-500" />
        <h1 className="mt-4 text-xl font-extrabold">Bạn không có quyền truy cập trang này</h1>
        <p className="mt-2 text-slate-600">Tài khoản hiện tại không thuộc vai trò được phép. Hãy đăng nhập bằng tài khoản khác.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="btn btn-outline">Về trang chủ</Link>
          <form action={logoutAction}>
            <button className="btn btn-primary">Đăng nhập tài khoản khác</button>
          </form>
        </div>
      </div>
    </div>
  );
}
