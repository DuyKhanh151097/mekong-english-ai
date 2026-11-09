import { db } from "@/lib/db";
import { adminUpdateOrderStatusAction, adminUpdatePlanPriceAction } from "@/lib/admin-actions";
import { formatDate, formatVnd, ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/lib/utils";

export const metadata = { title: "Bảng giá, Mã giảm giá & Đơn hàng – Admin CMS" };

export default async function AdminSalesPage() {
  const [plans, orders, coupons] = await Promise.all([
    db.plan.findMany({ orderBy: { order: "asc" } }),
    db.order.findMany({ include: { plan: true }, orderBy: { createdAt: "desc" }, take: 25 }),
    db.coupon.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <span className="eyebrow">💳 Thương mại hoá & Tài chính</span>
        <h1 className="text-2xl font-extrabold md:text-3xl">
          Điều chỉnh Bảng giá Gói dịch vụ, Mã ưu đãi & Đối soát Đơn hàng
        </h1>
        <p className="text-sm text-slate-600">
          Giá bán có thể cập nhật trực tiếp tại đây dựa trên mức sẵn sàng chi trả và chi phí hội thoại thực tế trong thí điểm.
        </p>
      </div>

      {/* 1. Chỉnh giá gói dịch vụ */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-extrabold">📦 Cấu hình Giá các gói sản phẩm & gói buổi Live Speaking</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((p) => (
            <form
              key={p.id}
              action={adminUpdatePlanPriceAction}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 text-sm"
            >
              <input type="hidden" name="id" value={p.id} />
              <div>
                <div className="font-extrabold text-ink">
                  {p.name} <span className="text-xs text-slate-400">({p.code})</span>
                </div>
                <div className="text-xs text-slate-500">{p.description}</div>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500">Giá gốc</label>
                  <input
                    name="price"
                    type="number"
                    defaultValue={p.price}
                    className="input w-28 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500">Giá ưu đãi</label>
                  <input
                    name="salePrice"
                    type="number"
                    defaultValue={p.salePrice ?? ""}
                    className="input w-28 py-1.5 text-xs"
                  />
                </div>
                <button type="submit" className="btn btn-sm btn-primary mt-3">
                  Lưu giá
                </button>
              </div>
            </form>
          ))}
        </div>
      </div>

      {/* 2. Mã giảm giá */}
      <div className="card p-6">
        <h2 className="text-lg font-extrabold">🎟️ Mã ưu đãi đang hoạt động</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {coupons.map((c) => (
            <div key={c.id} className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-xs">
              <b className="text-sm text-brand-800">{c.code}</b> ·{" "}
              {c.percent > 0 ? `Giảm ${c.percent}%` : `Giảm ${formatVnd(c.amount)}`} · Đã dùng:{" "}
              {c.used}/{c.maxUses}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Đơn hàng */}
      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-extrabold">🧾 Danh sách Đơn hàng & Đối soát thanh toán ({orders.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Gói</th>
                <th>Cổng TT</th>
                <th>Tổng tiền</th>
                <th>Ngày tạo</th>
                <th>Trạng thái / Duyệt</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="font-mono text-xs font-bold">{o.code}</td>
                  <td>
                    <div className="font-bold">{o.customerName}</div>
                    <div className="text-xs text-slate-500">{o.phone}</div>
                  </td>
                  <td className="text-xs">{o.plan?.name}</td>
                  <td className="text-xs">{PAYMENT_METHOD_LABELS[o.method] || o.method}</td>
                  <td className="font-bold text-brand-700">{formatVnd(o.total)}</td>
                  <td className="text-xs text-slate-500">{formatDate(o.createdAt)}</td>
                  <td>
                    <form action={adminUpdateOrderStatusAction} className="flex items-center gap-1.5">
                      <input type="hidden" name="id" value={o.id} />
                      <select
                        name="status"
                        defaultValue={o.status}
                        className="select py-1 text-xs"
                      >
                        {Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>
                            {v}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className="btn btn-sm btn-outline py-1">
                        Lưu
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
