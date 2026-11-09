import { PlusCircle, CheckCircle2, Video, BookOpen, Mic, Image } from "lucide-react";
import { db } from "@/lib/db";
import {
  adminCreateCourseAction,
  adminCreateMediaAssetAction,
  adminCreateScenarioAction,
  adminCreateVideoAction,
  adminVerifyMediaAssetAction,
} from "@/lib/admin-actions";
import { formatVnd, PACKAGE_LABELS } from "@/lib/utils";

export const metadata = { title: "Quản lý Học liệu, Video & Tình huống AI – Admin CMS" };

export default async function AdminContentPage() {
  const [courses, videos, scenarios, assets] = await Promise.all([
    db.course.findMany({
      include: { chapters: { include: { lessons: true } } },
      orderBy: { order: "asc" },
    }),
    db.video.findMany({ orderBy: { createdAt: "desc" } }),
    db.scenario.findMany({ orderBy: { order: "asc" } }),
    db.mediaAsset.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <span className="eyebrow">📚 Quản trị học liệu tập trung</span>
        <h1 className="text-2xl font-extrabold md:text-3xl">
          Khoá học, Video bài giảng, Tình huống Gia sư AI & Học liệu địa phương An Giang
        </h1>
      </div>

      {/* 1. KHOÁ HỌC */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="card p-6 lg:col-span-7 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-extrabold">
            <BookOpen className="h-5 w-5 text-brand-600" /> Danh sách Khoá học ({courses.length})
          </h2>
          <div className="space-y-2.5">
            {courses.map((c) => {
              const lessonCount = c.chapters.reduce((s, ch) => s + ch.lessons.length, 0);
              return (
                <div
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3.5 text-sm"
                >
                  <div>
                    <span className="badge badge-green mr-2">
                      {PACKAGE_LABELS[c.package] || c.package}
                    </span>
                    <b className="text-ink">{c.title}</b>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {c.levelLabel} · {c.chapters.length} chương · {lessonCount} bài · GV: {c.teacherName}
                    </div>
                  </div>
                  <span className="font-bold text-brand-700">
                    {c.isFree ? "Miễn phí" : formatVnd(c.salePrice ?? c.price)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-6 lg:col-span-5">
          <h2 className="text-lg font-extrabold">➕ Tạo Khoá học mới</h2>
          <form action={adminCreateCourseAction} className="mt-3 space-y-3">
            <div>
              <label className="label">Tên khoá học *</label>
              <input name="title" className="input" placeholder="VD: Tiếng Anh lớp 8 – Khám phá miền Tây" required />
            </div>
            <div>
              <label className="label">Mô tả ngắn</label>
              <input name="subtitle" className="input" placeholder="Bám sát SGK & luyện nói AI" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Gói sản phẩm</label>
                <select name="package" className="select">
                  <option value="SCHOOL">English School</option>
                  <option value="CAREER">English Career</option>
                  <option value="COMMUNITY">English Community</option>
                </select>
              </div>
              <div>
                <label className="label">Cấp độ / Lớp</label>
                <input name="levelLabel" className="input" defaultValue="Lớp 6" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Học phí (VND)</label>
                <input name="price" type="number" className="input" defaultValue={690000} />
              </div>
              <div>
                <label className="label">Giáo viên phụ trách</label>
                <input name="teacherName" className="input" defaultValue="Cô Nguyễn Thị Mai" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full">
              <PlusCircle className="h-4 w-4" /> Xuất bản Khoá học
            </button>
          </form>
        </div>
      </div>

      {/* 2. THƯ VIỆN VIDEO BÀI GIẢNG QUAY SẴN */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="card p-6 lg:col-span-7 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-extrabold">
            <Video className="h-5 w-5 text-brand-600" /> Kho Video bài giảng quay sẵn ({videos.length} video)
          </h2>
          <p className="text-xs text-slate-600">
            Đăng 1 lần, dùng lại cho nhiều lớp; hỗ trợ phụ đề song ngữ WebVTT và thống kê lượt xem.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {videos.map((v) => (
              <div key={v.id} className="rounded-xl border border-slate-200 p-3 text-xs space-y-1">
                <div className="font-bold text-sm text-ink">{v.title}</div>
                <div className="text-slate-500">
                  Lượt xem: <b>{v.views}</b> · Hoàn thành: <b>{v.completions}</b>
                </div>
                <div className="truncate text-[11px] text-slate-400">{v.url}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 lg:col-span-5">
          <h2 className="text-lg font-extrabold">➕ Đăng Video bài giảng mới</h2>
          <form action={adminCreateVideoAction} className="mt-3 space-y-3">
            <div>
              <label className="label">Tiêu đề video bài giảng *</label>
              <input name="title" className="input" placeholder="VD: Unit 6 – Giới thiệu lễ hội Vía Bà Chúa Xứ" required />
            </div>
            <div>
              <label className="label">Link file Video (MP4 / HLS Stream)</label>
              <input
                name="url"
                className="input"
                placeholder="https://... (để trống dùng video mẫu)"
              />
            </div>
            <div>
              <label className="label">Phụ đề tiếng Anh (WebVTT)</label>
              <textarea name="subtitleEn" rows={2} className="textarea text-xs" placeholder="00:00:00.000 --> 00:00:04.000&#10;Hello everyone!" />
            </div>
            <div>
              <label className="label">Phụ đề tiếng Việt (WebVTT)</label>
              <textarea name="subtitleVi" rows={2} className="textarea text-xs" placeholder="00:00:00.000 --> 00:00:04.000&#10;Xin chào các em!" />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              <PlusCircle className="h-4 w-4" /> Lưu Video bài giảng
            </button>
          </form>
        </div>
      </div>

      {/* 3. TÌNH HUỐNG HỘI THOẠI GIA SƯ AI (3 MỨC TRỢ GIÚP) */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="card p-6 lg:col-span-7 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-extrabold">
            <Mic className="h-5 w-5 text-brand-600" /> Tình huống luyện nói Gia sư AI ({scenarios.length})
          </h2>
          <div className="space-y-2.5">
            {scenarios.map((s) => (
              <div key={s.id} className="rounded-xl border border-slate-200 p-3.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold">
                    {s.titleVi} <span className="text-xs text-slate-500">({s.title})</span>
                  </span>
                  <span className="badge badge-gold">{s.topic}</span>
                </div>
                <p className="mt-1 text-xs text-slate-600">🎯 {s.goalVi}</p>
                <p className="mt-0.5 text-xs text-brand-700">🤖 Mở đầu: “{s.aiOpening}”</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 lg:col-span-5">
          <h2 className="text-lg font-extrabold">➕ Thêm Tình huống Hội thoại AI</h2>
          <form action={adminCreateScenarioAction} className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Tên tiếng Việt *</label>
                <input name="titleVi" className="input" placeholder="Giới thiệu lụa Tân Châu" required />
              </div>
              <div>
                <label className="label">Chủ đề</label>
                <input name="topic" className="input" defaultValue="Làng nghề An Giang" />
              </div>
            </div>
            <div>
              <label className="label">Mục tiêu giao tiếp (tiếng Việt) *</label>
              <input name="goalVi" className="input" placeholder="Giới thiệu đặc điểm lụa lãnh Mỹ A Tân Châu" required />
            </div>
            <div>
              <label className="label">Câu hỏi mở đầu của AI (tiếng Anh)</label>
              <input name="aiOpening" className="input" defaultValue="What is Tan Chau famous for?" />
            </div>
            <div>
              <label className="label">Từ khoá gợi ý (cách nhau dấu phẩy)</label>
              <input name="keywords" className="input" placeholder="silk, traditional, soft, black, gift" />
            </div>
            <div>
              <label className="label">Khung câu Mức 1 (mỗi dòng 1 khung)</label>
              <textarea
                name="frames"
                rows={2}
                className="textarea text-xs"
                placeholder={"Tan Chau is famous for ___.\nIt is very ___ and ___."}
              />
            </div>
            <div>
              <label className="label">Câu trả lời mẫu chuẩn</label>
              <input
                name="modelAnswer"
                className="input"
                placeholder="Tan Chau is famous for silk. It is very soft and cool."
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              <PlusCircle className="h-4 w-4" /> Tạo tình huống AI
            </button>
          </form>
        </div>
      </div>

      {/* 4. THƯ VIỆN HỌC LIỆU ĐỊA PHƯƠNG AN GIANG (CÓ BẢN QUYỀN & GIÁO VIÊN THẨM ĐỊNH) */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="card p-6 lg:col-span-7 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-extrabold">
            <Image className="h-5 w-5 text-brand-600" /> Kho Học liệu địa phương & Nguồn bản quyền ({assets.length})
          </h2>
          <p className="text-xs text-slate-600">
            Quản lý rõ nguồn gốc học liệu (Tự sản xuất, SmartTourism AI, Coop360, TraceHub) và trạng thái Giáo viên thẩm định.
          </p>
          <div className="space-y-2.5">
            {assets.map((a) => (
              <div
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3.5 text-sm"
              >
                <div>
                  <div className="font-bold">{a.title}</div>
                  <div className="text-xs text-slate-500">
                    Chủ đề: {a.topic} · Nguồn: <b>{a.source}</b> · Bản quyền: {a.license}
                  </div>
                </div>
                {a.verified ? (
                  <span className="badge badge-green">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Đã thẩm định ({a.verifiedBy})
                  </span>
                ) : (
                  <form action={adminVerifyMediaAssetAction}>
                    <input type="hidden" name="id" value={a.id} />
                    <button type="submit" className="btn btn-sm btn-primary">
                      Duyệt thẩm định
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 lg:col-span-5">
          <h2 className="text-lg font-extrabold">
            ➕ Đồng bộ / Thêm Học liệu từ SmartTourism AI · Coop360 · TraceHub
          </h2>
          <form action={adminCreateMediaAssetAction} className="mt-3 space-y-3">
            <div>
              <label className="label">Tên học liệu địa phương *</label>
              <input name="title" className="input" placeholder="VD: Hồ Tà Pạ – Tri Tôn" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Nguồn hệ thống</label>
                <select name="source" className="select">
                  <option value="SmartTourism AI">SmartTourism AI</option>
                  <option value="Coop360">Coop360 (Hợp tác xã)</option>
                  <option value="TraceHub">TraceHub (OCOP)</option>
                  <option value="Tự biên soạn">Tự biên soạn</option>
                </select>
              </div>
              <div>
                <label className="label">Chủ đề</label>
                <input name="topic" className="input" defaultValue="Du lịch An Giang" />
              </div>
            </div>
            <div>
              <label className="label">Giấy phép / Quyền sử dụng</label>
              <input
                name="license"
                className="input"
                defaultValue="Thuộc quyền khai thác của Công ty TNHH Công nghệ Mekong Green AI"
              />
            </div>
            <div>
              <label className="label">Nội dung / Mô tả ngắn</label>
              <textarea name="content" rows={2} className="textarea text-xs" placeholder="Thông tin điểm đến/sản phẩm..." />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Lưu & Xác nhận thẩm định
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
