"use client";

import { useActionState, useState } from "react";
import { registerAction } from "@/lib/auth-actions";
import { FormMessage, SubmitButton } from "@/components/SubmitButton";
import { cn } from "@/lib/utils";

export function RegisterForm({ classCode }: { classCode?: string }) {
  const [state, action] = useActionState(registerAction, undefined);
  const [role, setRole] = useState<"STUDENT" | "PARENT">("STUDENT");
  return (
    <form action={action} className="space-y-4">
      <FormMessage state={state} />
      <input type="hidden" name="role" value={role} />
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
        {(["STUDENT", "PARENT"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={cn("rounded-lg py-2 text-sm font-semibold transition", role === r ? "bg-white text-brand-700 shadow" : "text-slate-600")}
          >
            {r === "STUDENT" ? "Em là học sinh" : "Tôi là phụ huynh"}
          </button>
        ))}
      </div>
      <div>
        <label className="label" htmlFor="name">Họ và tên</label>
        <input id="name" name="name" className="input" required placeholder="Nguyễn Văn A" />
      </div>
      <div>
        <label className="label" htmlFor="contact">Số điện thoại hoặc email</label>
        <input id="contact" name="contact" className="input" required placeholder="0901234567" />
      </div>
      {role === "STUDENT" && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="grade">Lớp</label>
            <select id="grade" name="grade" className="select" defaultValue="6">
              {[6, 7, 8, 9].map((g) => (
                <option key={g} value={g}>Lớp {g}</option>
              ))}
              <option value="0">Khác</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="classCode">Mã lớp (nếu có)</label>
            <input id="classCode" name="classCode" className="input uppercase" defaultValue={classCode} placeholder="VD: AG6A01" />
          </div>
        </div>
      )}
      <div>
        <label className="label" htmlFor="password">Mật khẩu</label>
        <input id="password" name="password" type="password" className="input" required minLength={6} />
        <p className="help">Ít nhất 6 ký tự.</p>
      </div>
      <p className="text-xs text-slate-500">
        Bằng việc đăng ký, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo vệ dữ liệu. Học sinh dưới 16 tuổi cần phụ huynh đồng ý trước khi lưu bản ghi giọng nói.
      </p>
      <SubmitButton className="btn-lg w-full" pendingText="Đang tạo tài khoản...">Tạo tài khoản & học thử</SubmitButton>
    </form>
  );
}
