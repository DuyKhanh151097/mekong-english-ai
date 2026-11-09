import Link from "next/link";
import { CheckCircle2, Sparkles, Video } from "lucide-react";
import { db } from "@/lib/db";
import { formatVnd, PAYMENT_METHOD_LABELS } from "@/lib/utils";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const sp = await searchParams;
  const order = sp.code
    ? await db.order.findUnique({ where: { code: sp.code }, include: { plan: true } })
    : null;

  return (
    <div className="py-16">
      <div className="container max-w-lg">
        <div className="card space-y-4 p-8 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-brand-600" />
          <h1 className="text-2xl font-extrabold">Thanh toán & Kích hoạt thành công!</h1>
          {order ? (
            <div className="rounded-xl bg-slate-50 p-4 text-left text-sm space-y-1">
              <div><b>Mã đơn hàng:</b> {order.code}</div>
              <div><b>Khách hàng:</b> {order.customerName} ({order.phone})</div>
              <div><b>Gói dịch vụ:</b> {order.plan?.name}</div>
              <div><b>Phương thức:</b> {PAYMENT_METHOD_LABELS[order.method] || order.method}</div>
              <div><b>Tổng thanh toán:</b> <span className="font-bold text-brand-700">{formatVnd(order.total)}</span></div>
            </div>
          ) : (
            <p className="text-sm text-slate-600">Quyền truy cập gói học của bạn đã được kích hoạt.</p>
          )}

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/hoc" className="btn btn-primary">
              <Sparkles className="h-4 w-4" /> Vào App học ngay
            </Link>
            <Link href="/luyen-noi-truc-tiep" className="btn btn-outline">
              <Video className="h-4 w-4" /> Đặt lịch Live Speaking
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
