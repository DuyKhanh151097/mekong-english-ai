import Link from "next/link";
import {
  AlertCircle,
  HelpCircle,
  UserMinus,
  Sparkles,
  QrCode,
  PlusCircle,
  CheckCircle2,
  Edit3,
} from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import {
  createAssignmentAction,
  createClassroomAction,
  gradeTaskSubmissionAction,
  updateSpeakingAttemptByTeacherAction,
} from "@/lib/portal-actions";
import { DemoRoleSwitcher } from "@/components/DemoRoleSwitcher";
import { PublicHeader } from "@/components/PublicHeader";
import { formatDate, parseJson } from "@/lib/utils";

export const metadata = { title: "Cổng Giáo viên trường – Quản lý lớp thật gọn" };

export default async function TeacherPortalPage() {
  await requireUser(["TEACHER", "SCHOOL_ADMIN", "ADMIN"]);

  const [classrooms, lessons, scenarios, submissions, recentAttempts] = await Promise.all([
    db.classroom.findMany({
      include: {
        organization: true,
        members: { include: { student: true } },
        assignments: { include: { lesson: true, scenario: true }, orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "asc" },
    }),
    db.lesson.findMany({ orderBy: { title: "asc" }, take: 20 }),
    db.scenario.findMany({ orderBy: { order: "asc" } }),
    db.taskSubmission.findMany({
      include: { user: true, task: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    db.speakingAttempt.findMany({
      include: { user: true, scenario: true },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
  ]);

  const allStudents = classrooms.flatMap((c) => c.members.map((m) => m.student));
  const fiveDaysAgo = new Date(Date.now() - 5 * 86400000);

  // 1. Ai chưa tham gia tuần này
  const inactiveStudents = allStudents.filter((s) => !s.lastActiveAt || s.lastActiveAt < fiveDaysAgo);

  // 2. Nhóm đang gặp lỗi gì (tổng hợp từ các lượt luyện nói gần đây)
  const errorCounts = new Map<string, { explainVi: string; example: string; count: number }>();
  for (const att of recentAttempts) {
    const list = parseJson<Array<{ wrong: string; right: string; explainVi: string }>>(
      att.correctionsJson,
      []
    );
    for (const c of list) {
      const key = c.explainVi;
      const cur = errorCounts.get(key);
      if (cur) cur.count += 1;
      else errorCounts.set(key, { explainVi: c.explainVi, example: `${c.wrong} → ${c.right}`, count: 1 });
    }
  }
  const topErrors = Array.from(errorCounts.values()).sort((a, b) => b.count - a.count).slice(0, 4);

  // 3. Ai cần hỗ trợ thêm (điểm nói thấp hoặc streak = 0)
  const needHelpStudents = allStudents.filter((s) => s.streak <= 1 || s.xp < 500).slice(0, 6);

  return (
    <div className="min-h-screen bg-surface">
      <DemoRoleSwitcher />
      <PublicHeader />

      <div className="container space-y-8 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">👩‍🏫 Cổng Giáo viên thật gọn</span>
            <h1 className="text-2xl font-extrabold md:text-4xl">
              Quản lý lớp học, Giao bài & Theo dõi 3 thông tin cốt lõi
            </h1>
            <p className="text-sm text-slate-600">
              Giáo viên chọn chủ đề, giao bài và nắm ngay: Ai chưa tham gia – Nhóm gặp lỗi gì – Ai cần hỗ trợ thêm.
            </p>
          </div>
          <Link href="/admin/ai-thi-diem" className="btn btn-outline">
            Mở trang Chấm độc lập (Blind) & Đối chiếu AI
          </Link>
        </div>

        {/* 3 THÔNG TIN QUAN TRỌNG NHẤT TRÊN MÀN HÌNH ĐẦU */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* 1. Ai chưa tham gia */}
          <div className="card border-t-4 border-t-red-500 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-extrabold text-red-800">
                <UserMinus className="h-5 w-5" /> 1. Ai chưa tham gia ({inactiveStudents.length} HS)
              </h2>
              <span className="badge badge-red">Trên 5 ngày chưa mở bài</span>
            </div>
            <div className="space-y-2 text-sm">
              {inactiveStudents.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between rounded-xl bg-red-50/70 px-3 py-2"
                >
                  <div>
                    <div className="font-bold text-ink">{st.name}</div>
                    <div className="text-xs text-slate-500">
                      Mã HS: <code>{st.username}</code> · Lần cuối: {formatDate(st.lastActiveAt)}
                    </div>
                  </div>
                  <span className="badge badge-red">Nhắc phụ huynh</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Nhóm đang gặp lỗi gì */}
          <div className="card border-t-4 border-t-amber-500 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-extrabold text-amber-900">
                <AlertCircle className="h-5 w-5" /> 2. Nhóm đang gặp lỗi gì
              </h2>
              <span className="badge badge-gold">Tổng hợp từ AI</span>
            </div>
            <div className="space-y-2.5 text-sm">
              {topErrors.map((e, idx) => (
                <div key={idx} className="rounded-xl bg-amber-50/70 p-3">
                  <div className="font-bold text-ink">{e.explainVi}</div>
                  <div className="mt-0.5 text-xs text-slate-600">Ví dụ: {e.example}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Ai cần hỗ trợ thêm */}
          <div className="card border-t-4 border-t-sky-500 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-extrabold text-sky-900">
                <HelpCircle className="h-5 w-5" /> 3. Ai cần hỗ trợ thêm ({needHelpStudents.length} HS)
              </h2>
              <span className="badge badge-blue">Đang ở Mức trợ giúp 1</span>
            </div>
            <div className="space-y-2 text-sm">
              {needHelpStudents.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between rounded-xl bg-sky-50/70 px-3 py-2"
                >
                  <div>
                    <div className="font-bold text-ink">{st.name}</div>
                    <div className="text-xs text-slate-500">
                      Chuỗi ngày: {st.streak} · {st.xp} XP
                    </div>
                  </div>
                  <span className="badge badge-blue">Giữ khung câu mẫu</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ĐỀ XUẤT HOẠT ĐỘNG CHO BUỔI HỌC TIẾP THEO */}
        <div className="card border-2 border-brand-200 bg-brand-50/50 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="badge badge-green">
                <Sparkles className="h-3.5 w-3.5" /> Hệ thống đề xuất cho tiết học tiếp theo trên lớp
              </span>
              <h2 className="text-lg font-extrabold text-brand-900">
                Hoạt động 7 phút đầu giờ: Chữa nhanh 2 lỗi cả lớp hay gặp & Thực hành cặp đôi “Giới thiệu Trà Sư”
              </h2>
              <p className="text-sm text-slate-700">
                1) Cho cả lớp đồng thanh sửa <i>“It have → It has”</i> và <i>“by the boat → by boat”</i> (2 phút). 2) Ghép cặp hỏi – đáp <i>“Where should I go in An Giang?”</i> với 4 từ khoá trên bảng (5 phút).
              </p>
            </div>
          </div>
        </div>

        {/* DANH SÁCH LỚP, MÃ LỚP / QR & GIAO BÀI */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="card p-6 lg:col-span-7 space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-extrabold">
              <QrCode className="h-5 w-5 text-brand-600" /> Lớp học đang phụ trách & Mã tham gia
            </h2>
            <div className="space-y-3">
              {classrooms.map((cls) => (
                <div key={cls.id} className="rounded-2xl border border-slate-200 p-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-extrabold text-base">{cls.name}</span>
                      <span className="ml-2 badge badge-gray">
                        Nhóm thí điểm: {cls.pilotGroup}
                      </span>
                    </div>
                    <div className="rounded-xl bg-brand-50 px-3 py-1 text-sm font-extrabold text-brand-800">
                      Mã lớp: <code>{cls.code}</code> · Link QR: <code>/vao-lop?code={cls.code}</code>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    Sĩ số: {cls.members.length} học sinh · Trường: {cls.organization?.name || "An Giang"}
                  </div>
                </div>
              ))}
            </div>

            {/* Tạo lớp mới */}
            <form action={createClassroomAction} className="rounded-2xl bg-slate-50 p-4 space-y-3">
              <div className="text-sm font-bold">➕ Tạo lớp học mới (Tự sinh mã lớp & QR)</div>
              <div className="grid gap-3 sm:grid-cols-3">
                <input name="name" className="input" placeholder="VD: 6A2 – THCS Mỹ Hoà Hưng" required />
                <select name="grade" className="select" defaultValue="6">
                  <option value="6">Khối 6</option>
                  <option value="7">Khối 7</option>
                </select>
                <select name="pilotGroup" className="select" defaultValue="EXPERIMENT">
                  <option value="EXPERIMENT">Nhóm Thực nghiệm (Dùng App)</option>
                  <option value="CONTROL">Nhóm Đối chứng</option>
                </select>
              </div>
              <button type="submit" className="btn btn-sm btn-primary">
                <PlusCircle className="h-4 w-4" /> Tạo lớp
              </button>
            </form>
          </div>

          {/* Form Giao bài theo chủ đề */}
          <div className="card p-6 lg:col-span-5">
            <h2 className="text-lg font-extrabold">📌 Chọn chủ đề & Giao bài cho lớp</h2>
            <form action={createAssignmentAction} className="mt-4 space-y-3">
              <div>
                <label className="label">Chọn lớp</label>
                <select name="classroomId" className="select" required>
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Tiêu đề nhiệm vụ giao cho học sinh</label>
                <input
                  name="title"
                  className="input"
                  placeholder="VD: Luyện nói giới thiệu Rừng tràm Trà Sư (3 lượt)"
                  required
                />
              </div>
              <div>
                <label className="label">Gắn bài học 15 phút (tuỳ chọn)</label>
                <select name="lessonId" className="select" defaultValue="">
                  <option value="">-- Không chọn --</option>
                  {lessons.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Hoặc gắn tình huống luyện nói AI</label>
                <select name="scenarioId" className="select" defaultValue="">
                  <option value="">-- Không chọn --</option>
                  {scenarios.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.titleVi || s.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Dặn dò của giáo viên</label>
                <input name="note" className="input" placeholder="VD: Chú ý phát âm âm cuối /s/" />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Giao bài cho lớp
              </button>
            </form>
          </div>
        </div>

        {/* CHẤM NHIỆM VỤ THỰC TẾ & QUYỀN SỬA PHẢN HỒI CỦA AI */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-extrabold">
              🎯 Chấm bài Nhiệm vụ thực tế ({submissions.length} bài nộp)
            </h2>
            <div className="space-y-3">
              {submissions.map((sub) => (
                <form
                  key={sub.id}
                  action={gradeTaskSubmissionAction}
                  className="rounded-2xl border border-slate-200 p-4 text-sm space-y-2"
                >
                  <input type="hidden" name="submissionId" value={sub.id} />
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold">
                      {sub.user.name} · <span className="text-brand-700">{sub.task.title}</span>
                    </span>
                    <span className="badge badge-green">AI chấm sơ bộ: {sub.aiScore}/10</span>
                  </div>
                  <p className="rounded-xl bg-slate-50 p-2.5 text-xs text-slate-700">
                    &ldquo;{sub.transcript}&rdquo;
                  </p>
                  <div className="grid gap-2 sm:grid-cols-4">
                    <input
                      name="teacherScore"
                      type="number"
                      min={1}
                      max={10}
                      defaultValue={sub.teacherScore ?? sub.aiScore}
                      className="input"
                      placeholder="Điểm /10"
                    />
                    <input
                      name="teacherFeedback"
                      defaultValue={sub.teacherFeedback ?? sub.aiFeedbackVi ?? ""}
                      className="input sm:col-span-2"
                      placeholder="Nhận xét của giáo viên..."
                    />
                    <button type="submit" className="btn btn-sm btn-primary">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Lưu điểm
                    </button>
                  </div>
                </form>
              ))}
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-extrabold">
              <Edit3 className="h-5 w-5 text-brand-600" /> Giáo viên kiểm tra & sửa phản hồi của Gia sư AI
            </h2>
            <p className="text-xs text-slate-600">
              Đảm bảo điểm nhận dạng giọng nói của máy không thay thế hoàn toàn đánh giá sư phạm của giáo viên.
            </p>
            <div className="space-y-3">
              {recentAttempts.slice(0, 5).map((att) => (
                <form
                  key={att.id}
                  action={updateSpeakingAttemptByTeacherAction}
                  className="rounded-2xl border border-slate-200 p-4 text-sm space-y-2"
                >
                  <input type="hidden" name="attemptId" value={att.id} />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-ink">
                      {att.user.name} · {att.scenario?.titleVi}
                    </span>
                    <span>
                      Điểm AI: <b>{att.overall}/100</b>{" "}
                      {att.noisy && <span className="badge badge-orange ml-1">Bản ghi ồn</span>}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">Câu học sinh nói: “{att.transcript}”</div>
                  <div className="grid gap-2 sm:grid-cols-4">
                    <input
                      name="teacherScore"
                      type="number"
                      min={0}
                      max={100}
                      defaultValue={att.teacherScore ?? att.overall}
                      className="input"
                      title="Điểm của Giáo viên (/100)"
                    />
                    <input
                      name="feedbackVi"
                      defaultValue={att.feedbackVi || ""}
                      className="input sm:col-span-2"
                      placeholder="Sửa phản hồi gửi cho học sinh..."
                    />
                    <button type="submit" className="btn btn-sm btn-outline">
                      Cập nhật
                    </button>
                  </div>
                </form>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
