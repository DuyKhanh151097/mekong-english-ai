import { PlusCircle, Save } from "lucide-react";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { adminCreatePostAction, adminUpdateHeroAction } from "@/lib/admin-actions";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Website CMS & Quản trị Blog – Admin CMS" };

export default async function AdminWebsiteCmsPage() {
  const [settings, posts, faqs] = await Promise.all([
    getSettings(),
    db.post.findMany({ orderBy: { createdAt: "desc" } }),
    db.faq.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <span className="eyebrow">🌐 Quản trị nội dung Website (CMS)</span>
        <h1 className="text-2xl font-extrabold md:text-3xl">
          Chỉnh sửa Trang chủ, Thông tin Công ty & Đăng bài Blog SEO
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Cấu hình Hero & Thông tin công ty */}
        <div className="card p-6 lg:col-span-6">
          <h2 className="text-lg font-extrabold">🏠 Cấu hình Banner Hero Trang chủ & Thông tin liên hệ</h2>
          <form action={adminUpdateHeroAction} className="mt-4 space-y-3">
            <div>
              <label className="label">Dòng giới thiệu nhỏ (Eyebrow)</label>
              <input name="eyebrow" className="input" defaultValue={settings.hero.eyebrow} />
            </div>
            <div>
              <label className="label">Tiêu đề chính (H1)</label>
              <input name="title" className="input" defaultValue={settings.hero.title} required />
            </div>
            <div>
              <label className="label">Mô tả phụ</label>
              <textarea name="subtitle" rows={3} className="textarea" defaultValue={settings.hero.subtitle} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Hotline tư vấn</label>
                <input name="hotline" className="input" defaultValue={settings.company.hotline} />
              </div>
              <div>
                <label className="label">Địa chỉ công ty</label>
                <input name="address" className="input" defaultValue={settings.company.address} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full">
              <Save className="h-4 w-4" /> Lưu cấu hình Website
            </button>
          </form>
        </div>

        {/* Đăng bài Blog mới */}
        <div className="card p-6 lg:col-span-6">
          <h2 className="text-lg font-extrabold">✍️ Viết bài Blog mới (Chuẩn SEO)</h2>
          <form action={adminCreatePostAction} className="mt-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="label">Tiêu đề bài viết *</label>
                <input
                  name="title"
                  className="input"
                  placeholder="VD: Mẫu câu giới thiệu Núi Sam bằng tiếng Anh"
                  required
                />
              </div>
              <div>
                <label className="label">Chuyên mục</label>
                <select name="category" className="select">
                  <option value="Tiếng Anh về An Giang">Tiếng Anh về An Giang</option>
                  <option value="Mẹo học">Mẹo học</option>
                  <option value="Tin tức">Tin tức thí điểm</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Tóm tắt ngắn (Meta description)</label>
              <input name="excerpt" className="input" placeholder="Tóm tắt 1–2 câu..." />
            </div>
            <div>
              <label className="label">Nội dung bài viết *</label>
              <textarea
                name="content"
                rows={4}
                className="textarea"
                placeholder="Nội dung chi tiết..."
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              <PlusCircle className="h-4 w-4" /> Đăng bài viết
            </button>
          </form>
        </div>
      </div>

      {/* Danh sách bài Blog & FAQ */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6 space-y-3">
          <h3 className="font-extrabold">📰 Bài viết đã xuất bản ({posts.length})</h3>
          {posts.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm">
              <div>
                <div className="font-bold">{p.title}</div>
                <div className="text-xs text-slate-500">
                  {p.category} · {formatDate(p.publishedAt)} · {p.views} lượt xem
                </div>
              </div>
              <span className="badge badge-green">{p.status}</span>
            </div>
          ))}
        </div>

        <div className="card p-6 space-y-3">
          <h3 className="font-extrabold">❓ Câu hỏi thường gặp trên Trang chủ ({faqs.length})</h3>
          {faqs.map((f) => (
            <div key={f.id} className="rounded-xl border border-slate-200 p-3 text-xs">
              <div className="font-bold text-ink">{f.question}</div>
              <div className="mt-1 text-slate-600">{f.answer}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
