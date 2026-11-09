import { Cpu, ShieldCheck, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";
import { adminSaveBlindAssessmentAction } from "@/lib/admin-actions";
import { formatDate, formatVnd } from "@/lib/utils";

export const metadata = {
  title: "AI & Chi phí, Đối chiếu AI – Giáo viên, Chấm Blind & Bảo mật – Admin CMS",
};

export default async function AdminAiPilotPage() {
  const [aiLogs, attemptsWithTeacher, assessments, consents, auditLogs] = await Promise.all([
    db.aiUsageLog.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    db.speakingAttempt.findMany({
      include: { user: true, scenario: true },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    db.assessment.findMany({
      include: { student: true },
      orderBy: { createdAt: "desc" },
      take: 14,
    }),
    db.consent.findMany({ include: { student: true } }),
    db.auditLog.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 12 }),
  ]);

  const sttCost = aiLogs.filter((l) => l.kind === "STT").reduce((s, l) => s + l.cost, 0);
  const llmCost = aiLogs.filter((l) => l.kind === "LLM").reduce((s, l) => s + l.cost, 0);

  return (
    <div className="space-y-8">
      <div>
        <span className="eyebrow">🔬 Nghiên cứu thực nghiệm & Kiểm soát vận hành</span>
        <h1 className="text-2xl font-extrabold md:text-3xl">
          Chi phí AI, Mức thống nhất AI – Giáo viên, Chấm Blind Pre/Post & Bảo vệ dữ liệu (NĐ 13/2023)
        </h1>
      </div>

      {/* 1. Chi phí AI */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500">Chi phí Nhận dạng giọng nói (STT)</div>
          <div className="mt-1 text-2xl font-extrabold text-brand-700">{formatVnd(sttCost)}</div>
          <div className="mt-1 text-xs text-slate-500">Hỗ trợ lọc bản ghi nhiều tiếng ồn</div>
        </div>
        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500">Chi phí Hội thoại & Phản hồi (LLM)</div>
          <div className="mt-1 text-2xl font-extrabold text-teal-700">{formatVnd(llmCost)}</div>
          <div className="mt-1 text-xs text-slate-500">Giới hạn lượt/ngày theo gói (Fair-use)</div>
        </div>
        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500">Chế độ Gia sư AI hiện tại</div>
          <div className="mt-1 flex items-center gap-2 text-lg font-extrabold text-ink">
            <Cpu className="h-5 w-5 text-brand-600" /> Adapter: Sư phạm nội bộ + Gemini
          </div>
          <div className="mt-1 text-xs text-slate-500">Khoá chặt chủ đề theo bài học cho trẻ em</div>
        </div>
      </div>

      {/* 2. Kiểm tra mức thống nhất giữa phản hồi AI và Giáo viên (đặc biệt bản ghi nhiều tiếng ồn) */}
      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-extrabold">
            🔍 Đối chiếu mức thống nhất giữa Điểm AI và Điểm Giáo viên (Kiểm tra bản ghi có tiếng ồn)
          </h2>
          <p className="text-xs text-slate-500">
            Điểm nhận dạng giọng nói của máy không dùng thay hoàn toàn cho đánh giá năng lực nói. Bảng dưới đây theo dõi độ lệch giữa AI và giáo viên.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Học sinh</th>
                <th>Tình huống</th>
                <th>Câu nói (Transcript)</th>
                <th>Môi trường âm thanh</th>
                <th>Điểm AI</th>
                <th>Điểm GV</th>
                <th>Độ lệch</th>
              </tr>
            </thead>
            <tbody>
              {attemptsWithTeacher.map((a) => {
                const diff = a.teacherScore != null ? Math.abs(a.overall - a.teacherScore) : null;
                return (
                  <tr key={a.id}>
                    <td className="font-bold">{a.user.name}</td>
                    <td className="text-xs">{a.scenario?.titleVi}</td>
                    <td className="text-xs italic">“{a.transcript}”</td>
                    <td>
                      {a.noisy ? (
                        <span className="badge badge-orange">Có tiếng ồn</span>
                      ) : (
                        <span className="badge badge-green">Rõ ràng</span>
                      )}
                    </td>
                    <td className="font-bold text-brand-700">{a.overall}/100</td>
                    <td className="font-bold">{a.teacherScore != null ? `${a.teacherScore}/100` : "Chưa chấm"}</td>
                    <td>
                      {diff != null ? (
                        <span className={`badge ${diff <= 8 ? "badge-green" : "badge-red"}`}>
                          Lệch {diff}đ
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Đánh giá nói trước – sau (Pre-test / Post-test) ở chế độ Blind (Giáo viên không biết nhóm nào) */}
      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-extrabold">
            🎯 Chấm điểm nói Trước – Sau (Pre/Post) chế độ Ẩn danh nhóm (Blind Scoring)
          </h2>
          <p className="text-xs text-slate-500">
            Mã học sinh được ẩn danh (`BLIND-#`) để người chấm không biết học sinh thuộc nhóm Thực nghiệm hay Đối chứng, cũng không biết bài Pre hay Post.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Mã ẩn danh (Blind ID)</th>
                <th>Nhiệm vụ đánh giá tương đương</th>
                <th>Điểm AI tham khảo</th>
                <th>Điểm Giáo viên độc lập (/10)</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((as, idx) => (
                <tr key={as.id}>
                  <td className="font-mono text-xs font-bold">
                    BLIND-{String(100 + idx)}
                  </td>
                  <td className="text-xs">{as.taskTitle}</td>
                  <td className="text-xs font-bold text-slate-600">{as.aiScore ?? 6}/10</td>
                  <td>
                    <form action={adminSaveBlindAssessmentAction} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={as.id} />
                      <input
                        name="score"
                        type="number"
                        min={1}
                        max={10}
                        defaultValue={as.score ?? 6}
                        className="input w-20 py-1 text-xs"
                      />
                      <input
                        name="raterName"
                        defaultValue={as.raterName || "GV chấm độc lập"}
                        className="input w-40 py-1 text-xs"
                      />
                      <button type="submit" className="btn btn-sm btn-primary py-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Lưu
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Bảo vệ dữ liệu cá nhân (Nghị định 13/2023) & Nhật ký hệ thống (Audit Log) */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6 space-y-3">
          <h3 className="flex items-center gap-2 font-extrabold">
            <ShieldCheck className="h-5 w-5 text-brand-600" /> Trạng thái Đồng ý thu thập giọng nói (NĐ 13/2023)
          </h3>
          {consents.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-xs"
            >
              <div>
                <div className="font-bold text-ink">Học sinh: {c.student.name}</div>
                <div className="text-slate-500">Thời hạn lưu trữ tối đa: {c.retentionDays} ngày</div>
              </div>
              <span className={`badge ${c.granted ? "badge-green" : "badge-red"}`}>
                {c.granted ? "Phụ huynh đã đồng ý" : "Đã rút đồng ý"}
              </span>
            </div>
          ))}
        </div>

        <div className="card p-6 space-y-3">
          <h3 className="font-extrabold">📜 Nhật ký thao tác quản trị (Audit Log)</h3>
          <div className="space-y-2 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <div>
                  <b className="text-brand-800">{log.action}</b> · {log.entity}{" "}
                  {log.detail ? `(${log.detail})` : ""}
                </div>
                <span className="text-slate-400">
                  {log.user?.name || "Hệ thống"} · {formatDate(log.createdAt, true)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
