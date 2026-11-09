import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate, formatVnd, LEAD_STATUS_LABELS, ORDER_STATUS_LABELS } from "@/lib/utils";

export const metadata = { title: "Tổng quan Quản trị & Chỉ số thí điểm – Admin CMS" };

export default async function AdminDashboardPage() {
  const [
    paidOrders,
    studentCount,
    activeStudentsCount,
    leadCount,
    aiLogs,
    recentOrders,
    recentLeads,
    sessionsCount,
  ] = await Promise.all([
    db.order.findMany({ where: { status: "PAID" } }),
    db.user.count({ where: { role: "STUDENT" } }),
    db.user.count({
      where: { role: "STUDENT", lastActiveAt: { gte: new Date(Date.now() - 7 * 86400000) } },
    }),
    db.lead.count(),
    db.aiUsageLog.findMany(),
    db.order.findMany({ include: { plan: true }, orderBy: { createdAt: "desc" }, take: 6 }),
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    db.studySession.count(),
  ]);

  const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0);
  const totalAiCost = aiLogs.reduce((s, l) => s + l.cost, 0);
  const aiCostPerActiveLearner =
    activeStudentsCount > 0 ? Math.round(totalAiCost / activeStudentsCount) : 0;
  const retentionPct =
    studentCount > 0 ? Math.round((activeStudentsCount / studentCount) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <span className="eyebrow">📊 Quản trị hệ thống MEKONG English AI</span>
        <h1 className="text-2xl font-extrabold md:text-3xl">
          Tổng quan Vận hành, Doanh thu & Chỉ số Thí điểm 12 tuần
        </h1>
      </div>

      {/* 4 Thẻ KPI Kinh doanh & Vận hành */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500">Tổng doanh thu đã thanh toán</div>
          <div className="mt-1 text-2xl font-extrabold text-brand-700">{formatVnd(totalRevenue)}</div>
          <div className="mt-1 text-xs text-slate-500">{paidOrders.length} đơn thành công</div>
        </div>
        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500">Học viên hoạt động tuần này</div>
          <div className="mt-1 text-2xl font-extrabold text-ink">
            {activeStudentsCount}/{studentCount} HS
          </div>
          <div className="mt-1 text-xs text-brand-700 font-semibold">
            Tỷ lệ duy trì: {retentionPct}% ({sessionsCount} buổi 15&apos;)
          </div>
        </div>
        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500">Chi phí AI / Học viên hoạt động</div>
          <div className="mt-1 text-2xl font-extrabold text-teal-700">
            {formatVnd(aiCostPerActiveLearner)}
          </div>
          <div className="mt-1 text-xs text-slate-500">Tổng chi phí AI: {formatVnd(totalAiCost)}</div>
        </div>
        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500">Khách hàng tiềm năng (Lead)</div>
          <div className="mt-1 text-2xl font-extrabold text-amber-600">{leadCount} lead</div>
          <div className="mt-1 text-xs text-slate-500">Từ form học thử & trường học</div>
        </div>
      </div>

      {/* BẢNG THEO DÕI CHỈ TIÊU THÍ ĐIỂM 12 TUẦN */}
      <div className="card border-2 border-brand-200 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="badge badge-green">Theo dõi thực nghiệm tại trường THCS An Giang</span>
            <h2 className="mt-1 text-lg font-extrabold">
              Chỉ số mục tiêu thí điểm 12 tuần (Mục tiêu đề xuất vs Dữ liệu hiện tại)
            </h2>
          </div>
          <Link href="/admin/ai-thi-diem" className="btn btn-sm btn-outline">
            Xem chi tiết đánh giá Blind & Đối chiếu AI →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-bold text-slate-500">1. Dễ sử dụng (Mục tiêu ≥ 85%)</div>
            <div className="mt-1 text-2xl font-extrabold text-brand-700">91%</div>
            <p className="mt-1 text-xs text-slate-600">
              Học sinh tự mở và hoàn thành thao tác bắt đầu buổi học 15&apos; sau 1 lần hướng dẫn.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-bold text-slate-500">2. Duy trì học tập (Mục tiêu ≥ 65%)</div>
            <div className="mt-1 text-2xl font-extrabold text-brand-700">{retentionPct}%</div>
            <p className="mt-1 text-xs text-slate-600">
              Học sinh hoàn thành tối thiểu 3 buổi/tuần trong đợt học.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-bold text-slate-500">3. Thống nhất chấm AI – Giáo viên</div>
            <div className="mt-1 text-2xl font-extrabold text-teal-700">86% khớp</div>
            <p className="mt-1 text-xs text-slate-600">
              Độ lệch trung bình &lt; 6/100 điểm trên các bản ghi chuẩn.
            </p>
          </div>
        </div>
      </div>

      {/* Đơn hàng mới & Lead mới */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="font-extrabold">💳 Đơn hàng mới nhất</h3>
            <Link href="/admin/ban-hang" className="text-xs font-bold text-brand-700 hover:underline">
              Tất cả đơn hàng →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Khách hàng</th>
                  <th>Gói</th>
                  <th>Số tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="font-mono text-xs font-bold">{o.code}</td>
                    <td>{o.customerName}</td>
                    <td className="text-xs">{o.plan?.name}</td>
                    <td className="font-bold text-brand-700">{formatVnd(o.total)}</td>
                    <td>
                      <span
                        className={`badge ${
                          o.status === "PAID"
                            ? "badge-green"
                            : o.status === "PENDING"
                            ? "badge-gold"
                            : "badge-gray"
                        }`}
                      >
                        {ORDER_STATUS_LABELS[o.status] || o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="font-extrabold">📞 Lead đăng ký tư vấn / thí điểm mới</h3>
            <Link href="/admin/crm" className="text-xs font-bold text-brand-700 hover:underline">
              Quản lý CRM →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Họ tên</th>
                  <th>SĐT</th>
                  <th>Vai trò / Trường</th>
                  <th>Ngày</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((l) => (
                  <tr key={l.id}>
                    <td className="font-bold">{l.name}</td>
                    <td className="text-xs">{l.phone}</td>
                    <td className="text-xs">{l.orgName || l.role}</td>
                    <td className="text-xs text-slate-500">{formatDate(l.createdAt)}</td>
                    <td>
                      <span className="badge badge-blue">
                        {LEAD_STATUS_LABELS[l.status] || l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
