import Link from "next/link";

export const metadata = { title: "Quên mật khẩu" };

export default function ForgotPage() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Quên mật khẩu?</h1>
      <div className="mt-6 space-y-4 text-slate-700">
        <div className="card p-5">
          <b>Học sinh dùng tài khoản do trường cấp</b>
          <p className="mt-1 text-sm">Nhờ giáo viên chủ nhiệm/giáo viên tiếng Anh đặt lại mật khẩu trong Cổng giáo viên.</p>
        </div>
        <div className="card p-5">
          <b>Tài khoản cá nhân</b>
          <p className="mt-1 text-sm">Liên hệ hotline hoặc Zalo OA của MEKONG English AI để được xác minh và đặt lại mật khẩu. (Đặt lại qua OTP sẽ được kích hoạt khi tích hợp nhà cung cấp SMS/Zalo ZNS.)</p>
        </div>
      </div>
      <Link href="/dang-nhap" className="btn btn-outline mt-6 w-full">Quay lại đăng nhập</Link>
    </div>
  );
}
