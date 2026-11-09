"use client";

import { useActionState } from "react";
import { createOrderAction } from "@/lib/public-actions";
import { FormMessage, SubmitButton } from "@/components/SubmitButton";

export function CheckoutForm({
  planId,
  defaultName,
  defaultPhone,
  defaultEmail,
}: {
  planId: string;
  defaultName?: string;
  defaultPhone?: string | null;
  defaultEmail?: string | null;
}) {
  const [state, action] = useActionState(createOrderAction, undefined);

  return (
    <form action={action} className="card space-y-4 p-6">
      <h2 className="text-lg font-extrabold">Thông tin người mua & Phương thức thanh toán</h2>
      <FormMessage state={state} />
      <input type="hidden" name="planId" value={planId} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="customerName">Họ và tên *</label>
          <input id="customerName" name="customerName" className="input" defaultValue={defaultName} required />
        </div>
        <div>
          <label className="label" htmlFor="phone">Số điện thoại *</label>
          <input id="phone" name="phone" className="input" defaultValue={defaultPhone || ""} required placeholder="0901234567" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="email">Email (nhận biên lai)</label>
          <input id="email" name="email" type="email" className="input" defaultValue={defaultEmail || ""} />
        </div>
        <div>
          <label className="label" htmlFor="couponCode">Mã ưu đãi (thử: MEKONG30)</label>
          <input id="couponCode" name="couponCode" className="input uppercase" placeholder="MEKONG30" />
        </div>
      </div>

      <div>
        <label className="label">Chọn cổng thanh toán</label>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {[
            { code: "VIETQR", label: "Chuyển khoản VietQR" },
            { code: "VNPAY", label: "VNPay QR / Thẻ" },
            { code: "MOMO", label: "Ví MoMo" },
            { code: "ZALOPAY", label: "ZaloPay" },
          ].map((m, idx) => (
            <label
              key={m.code}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 p-3 text-xs font-semibold hover:border-brand-600"
            >
              <input type="radio" name="method" value={m.code} defaultChecked={idx === 0} className="accent-brand-600" />
              <span>{m.label}</span>
            </label>
          ))}
        </div>
      </div>

      <SubmitButton className="btn-lg w-full" pendingText="Đang xử lý thanh toán...">
        Xác nhận thanh toán & Kích hoạt ngay
      </SubmitButton>
    </form>
  );
}
