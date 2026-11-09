import Link from "next/link";
import { CheckCircle2, Sparkles, School, QrCode } from "lucide-react";
import { db } from "@/lib/db";
import { formatVnd } from "@/lib/utils";
import { LeadForm } from "@/components/LeadForm";

export const metadata = { title: "English School – Tiếng Anh THCS lớp 6–7 An Giang" };

export default async function EnglishSchoolPage() {
  const courses = await db.course.findMany({ where: { package: "SCHOOL" }, orderBy: { order: "asc" } });

  return (
    <div className="py-12">
      <div className="container space-y-12">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <span className="badge badge-green">Gói ưu tiên phát triển đầu tiên</span>
            <h1 className="text-3xl font-extrabold md:text-5xl">
              English School – Dành cho học sinh THCS (Lớp 6–7)
            </h1>
            <p className="text-slate-600 md:text-lg">
              Củng cố kiến thức trên lớp theo SGK Global Success, tăng thời gian nghe – nói mỗi ngày 15 phút với học liệu gắn liền đời sống An Giang, và giúp giáo viên theo dõi sát tiến độ cả lớp.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/hoc" className="btn btn-lg btn-primary">
                <Sparkles className="h-5 w-5" /> Vào học buổi 15 phút
              </Link>
              <Link href="/vao-lop" className="btn btn-lg btn-outline">
                <QrCode className="h-5 w-5" /> Học sinh nhập mã lớp
              </Link>
              <Link href="/nha-truong" className="btn btn-lg btn-secondary">
                <School className="h-5 w-5" /> Đăng ký thí điểm trường
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/classroom.jpg" alt="English School" className="rounded-3xl shadow-card" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Với Học sinh lớp 6–7",
              items: [
                "Mỗi ngày 15 phút: 2' ôn lại – 3' xem & nghe – 6' luyện nói AI – 3' sửa lỗi – 1' kết quả",
                "Không cần viết câu lệnh cho AI, có nút nghe chậm 0.75x & gợi ý tiếng Việt",
                "Dùng tốt cả trên điện thoại tầm thấp và phòng máy tính của trường",
              ],
            },
            {
              title: "Với Giáo viên tiếng Anh",
              items: [
                "Tạo lớp & mã QR trong 30 giây, giao bài theo chủ đề SGK",
                "Xem ngay 3 thông tin: Ai chưa học – Nhóm sai lỗi gì – Ai cần hỗ trợ",
                "Được sửa phản hồi của AI và nhận gợi ý hoạt động cho tiết học tới",
              ],
            },
            {
              title: "Với Phụ huynh",
              items: [
                "Nhận báo cáo ngắn theo tuần bằng tiếng Việt dễ hiểu",
                "Nghe lại bản ghi tiến bộ trước – sau của con",
                "Kiểm soát quyền đồng ý thu thập & thời hạn lưu bản ghi giọng nói",
              ],
            },
          ].map((b) => (
            <div key={b.title} className="card p-6">
              <h3 className="text-lg font-extrabold text-brand-800">{b.title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {b.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((c) => (
            <div key={c.id} className="card flex flex-col justify-between p-6">
              <div>
                <span className="badge badge-gold">{c.levelLabel}</span>
                <h2 className="mt-2 text-xl font-extrabold">{c.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{c.description}</p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xl font-extrabold text-brand-700">{formatVnd(c.salePrice ?? c.price)}</span>
                <Link href={`/khoa-hoc/${c.slug}`} className="btn btn-primary">
                  Xem chi tiết khoá học
                </Link>
              </div>
            </div>
          ))}
        </div>

        <LeadForm source="ENGLISH_SCHOOL" defaultRole="PARENT" title="Đăng ký học thử gói English School (Lớp 6–7)" />
      </div>
    </div>
  );
}
