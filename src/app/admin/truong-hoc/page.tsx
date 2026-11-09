import { PlusCircle } from "lucide-react";
import { db } from "@/lib/db";
import { adminCreateOrgAction } from "@/lib/admin-actions";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Quản lý Trường học, License & Lớp thí điểm – Admin CMS" };

export default async function AdminSchoolsPage() {
  const [orgs, classrooms] = await Promise.all([
    db.organization.findMany({
      include: { classrooms: true, users: true },
      orderBy: { createdAt: "desc" },
    }),
    db.classroom.findMany({
      include: { organization: true, teacher: true, members: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <span className="eyebrow">🏫 Triển khai B2B & Thí điểm Trường học</span>
        <h1 className="text-2xl font-extrabold md:text-3xl">
          Quản lý Trường THCS, Doanh nghiệp, License & Phân nhóm Thực nghiệm / Đối chứng
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="card p-6 lg:col-span-8 space-y-4">
          <h2 className="text-lg font-extrabold">Danh sách Trường / Đơn vị ({orgs.length})</h2>
          <div className="space-y-3">
            {orgs.map((o) => (
              <div
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 text-sm"
              >
                <div>
                  <span className="badge badge-green mr-2">{o.type}</span>
                  <b className="text-base">{o.name}</b>
                  <div className="mt-1 text-xs text-slate-500">
                    Địa chỉ: {o.address} · Liên hệ: {o.contactName || "Ban Giám hiệu"} ({o.contactPhone || "-"})
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-bold text-brand-700">
                    License: {o.users.length}/{o.licenseSeats} chỗ
                  </div>
                  <div className="text-slate-500">Hạn: {formatDate(o.licenseExpiresAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 lg:col-span-4 h-fit">
          <h2 className="text-lg font-extrabold">➕ Cấp License Trường / Đơn vị mới</h2>
          <form action={adminCreateOrgAction} className="mt-4 space-y-3">
            <div>
              <label className="label">Tên Trường / Doanh nghiệp *</label>
              <input name="name" className="input" placeholder="VD: Trường THCS Nguyễn Trãi" required />
            </div>
            <div>
              <label className="label">Loại đơn vị</label>
              <select name="type" className="select">
                <option value="SCHOOL">Trường THCS (SCHOOL)</option>
                <option value="CENTER">Trung tâm ngoại ngữ (CENTER)</option>
                <option value="COMPANY">Doanh nghiệp du lịch/dịch vụ (COMPANY)</option>
              </select>
            </div>
            <div>
              <label className="label">Địa bàn</label>
              <input name="address" className="input" defaultValue="Châu Đốc, An Giang" />
            </div>
            <div>
              <label className="label">Số chỗ (Seats) cấp phát</label>
              <input name="licenseSeats" type="number" className="input" defaultValue={150} />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              <PlusCircle className="h-4 w-4" /> Tạo đơn vị & Cấp License
            </button>
          </form>
        </div>
      </div>

      {/* Bảng lớp học & phân nhóm thí điểm */}
      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-extrabold">📋 Các lớp học & Phân nhóm nghiên cứu thí điểm</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Tên lớp</th>
                <th>Mã lớp (QR)</th>
                <th>Trường</th>
                <th>Giáo viên</th>
                <th>Sĩ số</th>
                <th>Nhóm thí điểm</th>
              </tr>
            </thead>
            <tbody>
              {classrooms.map((c) => (
                <tr key={c.id}>
                  <td className="font-bold">{c.name}</td>
                  <td>
                    <code className="rounded bg-brand-50 px-2 py-0.5 font-bold text-brand-800">
                      {c.code}
                    </code>
                  </td>
                  <td className="text-xs">{c.organization?.name}</td>
                  <td className="text-xs">{c.teacher?.name}</td>
                  <td>{c.members.length} HS</td>
                  <td>
                    <span
                      className={`badge ${
                        c.pilotGroup === "EXPERIMENT" ? "badge-green" : "badge-gold"
                      }`}
                    >
                      {c.pilotGroup === "EXPERIMENT" ? "Nhóm Thực nghiệm (App)" : "Nhóm Đối chứng"}
                    </span>
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
