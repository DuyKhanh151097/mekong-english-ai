import { db } from "@/lib/db";
import { adminUpdateLeadStatusAction } from "@/lib/admin-actions";
import { formatDate, LEAD_STATUS_LABELS } from "@/lib/utils";

export const metadata = { title: "Quản lý Lead tư vấn & Báo cáo tuần Phụ huynh – Admin CMS" };

export default async function AdminCrmPage() {
  const [leads, reports] = await Promise.all([
    db.lead.findMany({ orderBy: { createdAt: "desc" } }),
    db.weeklyReport.findMany({
      include: { student: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <span className="eyebrow">📞 CRM & Chăm sóc Phụ huynh / Nhà trường</span>
        <h1 className="text-2xl font-extrabold md:text-3xl">
          Quản lý Lead đăng ký học thử & Báo cáo tuần Phụ huynh
        </h1>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-extrabold">Danh sách Lead từ Website & Bài test trình độ ({leads.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>SĐT / Zalo</th>
                <th>Vai trò · Đơn vị</th>
                <th>Ghi chú nhu cầu</th>
                <th>Nguồn</th>
                <th>Cập nhật trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td className="font-bold">{l.name}</td>
                  <td className="text-xs font-semibold text-brand-700">{l.phone}</td>
                  <td className="text-xs">
                    {l.role} {l.orgName ? `· ${l.orgName}` : ""} ({l.province})
                  </td>
                  <td className="max-w-xs text-xs text-slate-600">{l.message || "-"}</td>
                  <td className="text-xs text-slate-500">
                    {l.source} · {formatDate(l.createdAt)}
                  </td>
                  <td>
                    <form action={adminUpdateLeadStatusAction} className="flex items-center gap-1.5">
                      <input type="hidden" name="id" value={l.id} />
                      <select name="status" defaultValue={l.status} className="select py-1 text-xs">
                        {Object.entries(LEAD_STATUS_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>
                            {v}
                          </option>
                        ))}
                      </select>
                      <input
                        name="note"
                        defaultValue={l.note || ""}
                        placeholder="Ghi chú gọi..."
                        className="input py-1 text-xs w-32"
                      />
                      <button type="submit" className="btn btn-sm btn-primary py-1">
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

      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-extrabold">📩 Nhật ký Báo cáo tuần đã gửi cho Phụ huynh</h2>
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="rounded-xl border border-slate-200 p-4 text-sm">
              <div className="flex items-center justify-between font-bold">
                <span>Học sinh: {r.student.name}</span>
                <span className="text-xs text-slate-500">Tuần: {formatDate(r.weekStart)}</span>
              </div>
              <p className="mt-1 text-xs text-slate-700">
                Con đã luyện <b>{r.sessions} buổi ({r.minutes} phút)</b>. {r.canDoVi} {r.needVi}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
