import { UserPlus, LogIn } from "lucide-react";
import { db } from "@/lib/db";
import { impersonateAction } from "@/lib/auth-actions";
import { adminCreateUserAction, adminToggleUserStatusAction } from "@/lib/admin-actions";
import { ROLE_LABELS } from "@/lib/utils";

export const metadata = { title: "Quản lý Người dùng & Phân quyền RBAC – Admin CMS" };

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    include: { organization: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <div className="space-y-8">
      <div>
        <span className="eyebrow">👥 Quản trị Tài khoản & Phân quyền (RBAC)</span>
        <h1 className="text-2xl font-extrabold md:text-3xl">
          Danh sách Người dùng & Chức năng “Đăng nhập thay” (Impersonate)
        </h1>
        <p className="text-sm text-slate-600">
          Quản trị viên có thể bấm <b>Đăng nhập thay</b> ở bất kỳ tài khoản nào để kiểm tra giao diện của Học sinh, Phụ huynh hoặc Giáo viên (mọi thao tác đều ghi vào Audit Log).
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="card overflow-hidden lg:col-span-8">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Họ tên</th>
                  <th>Liên hệ / Mã HS</th>
                  <th>Vai trò</th>
                  <th>Trường / Đơn vị</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="font-bold">{u.name}</td>
                    <td className="text-xs text-slate-600">
                      {u.email || u.phone || <code>{u.username}</code>}
                    </td>
                    <td>
                      <span className="badge badge-green">{ROLE_LABELS[u.role] || u.role}</span>
                    </td>
                    <td className="text-xs">{u.organization?.name || "-"}</td>
                    <td>
                      <span className={`badge ${u.status === "ACTIVE" ? "badge-green" : "badge-red"}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <form
                          action={async () => {
                            "use server";
                            await impersonateAction(u.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="btn btn-sm btn-secondary py-1"
                            title="Đăng nhập thay người dùng này"
                          >
                            <LogIn className="h-3.5 w-3.5" /> Đăng nhập thay
                          </button>
                        </form>
                        <form action={adminToggleUserStatusAction}>
                          <input type="hidden" name="id" value={u.id} />
                          <input type="hidden" name="status" value={u.status} />
                          <button type="submit" className="btn btn-sm btn-outline py-1">
                            {u.status === "ACTIVE" ? "Khoá" : "Mở"}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tạo tài khoản mới */}
        <div className="card p-6 lg:col-span-4 h-fit">
          <h2 className="flex items-center gap-2 text-lg font-extrabold">
            <UserPlus className="h-5 w-5 text-brand-600" /> Tạo tài khoản mới
          </h2>
          <form action={adminCreateUserAction} className="mt-4 space-y-3">
            <div>
              <label className="label">Họ và tên *</label>
              <input name="name" className="input" required placeholder="Nguyễn Văn B" />
            </div>
            <div>
              <label className="label">Email đăng nhập *</label>
              <input name="email" type="email" className="input" required placeholder="user@mekong.ai" />
            </div>
            <div>
              <label className="label">Vai trò (RBAC)</label>
              <select name="role" className="select" defaultValue="STUDENT">
                {Object.entries(ROLE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v} ({k})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Mật khẩu khởi tạo</label>
              <input name="password" className="input" defaultValue="123456" />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Tạo người dùng
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
