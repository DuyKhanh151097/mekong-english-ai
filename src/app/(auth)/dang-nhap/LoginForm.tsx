"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/auth-actions";
import { FormMessage, SubmitButton } from "@/components/SubmitButton";

export function LoginForm({ next, loggedOut }: { next?: string; loggedOut?: boolean }) {
  const [state, action] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="space-y-4">
      {loggedOut && !state && <FormMessage state={{ ok: "Bạn đã đăng xuất an toàn." }} />}
      <FormMessage state={state} />
      <input type="hidden" name="next" value={next || ""} />
      <div>
        <label className="label" htmlFor="identifier">Số điện thoại, email hoặc tên đăng nhập</label>
        <input id="identifier" name="identifier" className="input" autoComplete="username" required placeholder="VD: 0901234567" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label className="label" htmlFor="password">Mật khẩu</label>
          <Link href="/quen-mat-khau" className="mb-1.5 text-xs font-medium text-brand-700 hover:underline">Quên mật khẩu?</Link>
        </div>
        <input id="password" name="password" type="password" className="input" autoComplete="current-password" required />
      </div>
      <label className="flex items-start gap-2 rounded-xl bg-rice-50 p-3 text-sm text-slate-700">
        <input type="checkbox" name="shared" className="mt-0.5 h-4 w-4 accent-brand-600" />
        <span>
          <b>Đây là máy dùng chung</b> (phòng máy trường học) – không ghi nhớ đăng nhập, tự đăng xuất khi đóng trình duyệt.
        </span>
      </label>
      <SubmitButton className="btn-lg w-full" pendingText="Đang đăng nhập...">Đăng nhập</SubmitButton>
    </form>
  );
}
