import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  Users,
  School,
  CreditCard,
  Headphones,
  Globe,
  Cpu,
  ExternalLink,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/session";
import { DemoRoleSwitcher } from "@/components/DemoRoleSwitcher";
import { Logo } from "@/components/Logo";

const ADMIN_MENU = [
  { href: "/admin", label: "1. Tổng quan & Chỉ số thí điểm", icon: LayoutDashboard },
  { href: "/admin/hoc-lieu", label: "2. Quản lý Học liệu & Video", icon: BookOpen },
  { href: "/admin/live", label: "3. Live Speaking & Giáo viên", icon: Video },
  { href: "/admin/nguoi-dung", label: "4. Người dùng & Phân quyền", icon: Users },
  { href: "/admin/truong-hoc", label: "5. Trường học & Lớp thí điểm", icon: School },
  { href: "/admin/ban-hang", label: "6. Bảng giá & Đơn hàng", icon: CreditCard },
  { href: "/admin/crm", label: "7. Lead tư vấn & Phụ huynh", icon: Headphones },
  { href: "/admin/website", label: "8. Quản trị Website & Blog", icon: Globe },
  { href: "/admin/ai-thi-diem", label: "9. AI, Đánh giá Blind & Bảo mật", icon: Cpu },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser(ADMIN_ROLES);

  return (
    <div className="min-h-screen bg-surface">
      <DemoRoleSwitcher />

      <div className="grid min-h-[calc(100vh-36px)] lg:grid-cols-12">
        {/* Sidebar trái */}
        <aside className="border-r border-slate-200 bg-white p-4 lg:col-span-3 xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <Logo href="/admin" />
          </div>

          <div className="mb-3 rounded-xl bg-brand-50 px-3 py-2 text-xs">
            <div className="font-bold text-brand-900">Admin CMS</div>
            <div className="text-slate-600">{user.name} ({user.role})</div>
          </div>

          <nav className="space-y-1">
            {ADMIN_MENU.map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.href}
                  href={m.href}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                >
                  <Icon className="h-4 w-4 shrink-0 text-brand-600" />
                  <span>{m.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 border-t border-slate-100 pt-4 space-y-2 text-xs">
            <Link href="/" className="flex items-center justify-between rounded-lg px-3 py-2 font-semibold text-slate-600 hover:bg-slate-100">
              <span>Xem Website công khai</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <Link href="/hoc" className="flex items-center justify-between rounded-lg px-3 py-2 font-semibold text-slate-600 hover:bg-slate-100">
              <span>Mở App Học sinh</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <Link href="/lop-hoc" className="flex items-center justify-between rounded-lg px-3 py-2 font-semibold text-slate-600 hover:bg-slate-100">
              <span>Mở Cổng Giáo viên</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>

        {/* Nội dung chính */}
        <main className="p-5 md:p-8 lg:col-span-9 xl:col-span-10">{children}</main>
      </div>
    </div>
  );
}
