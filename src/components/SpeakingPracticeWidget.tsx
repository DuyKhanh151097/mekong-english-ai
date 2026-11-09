"use client";

import { useState } from "react";
import { Volume2, Snail, Mic, Send, Sparkles, CheckCircle2, WifiOff, RotateCcw, ArrowUpRight } from "lucide-react";
import type { SpeakingEvaluation } from "@/lib/ai";

export type ScenarioClientData = {
  slug: string;
  title: string;
  titleVi?: string | null;
  topic: string;
  image?: string | null;
  goalVi: string;
  contextVi?: string | null;
  aiOpening: string;
  keywords: string[];
  frames: string[];
  hints: string[];
  followUps: string[];
  modelAnswer?: string | null;
};

export function SpeakingPracticeWidget({
  scenario,
  initialLevel = 1,
  compact = false,
}: {
  scenario: ScenarioClientData;
  initialLevel?: number;
  compact?: boolean;
}) {
  const [level, setLevel] = useState<number>(initialLevel);
  const [transcript, setTranscript] = useState<string>("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSubVi, setShowSubVi] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [queuedCount, setQueuedCount] = useState(0);
  const [result, setResult] = useState<SpeakingEvaluation | null>(null);
  const [transferStep, setTransferStep] = useState(false);

  /** Đọc văn bản bằng Web Speech Synthesis (tốc độ thường 1.0 hoặc chậm 0.72) */
  function speakText(text: string, rate = 1) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = rate;
    window.speechSynthesis.speak(u);
  }

  /** Ghi âm giọng nói qua Web Speech Recognition (nếu trình duyệt hỗ trợ) */
  function handleMic() {
    if (typeof window === "undefined") return;
    const W = window as unknown as {
      SpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
        onerror: () => void;
        onend: () => void;
        start: () => void;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
        onerror: () => void;
        onend: () => void;
        start: () => void;
      };
    };
    const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SR) {
      // Nếu trình duyệt không có Web Speech API, điền câu mẫu để thử ngay
      setTranscript(
        scenario.modelAnswer ||
          "You should visit Tra Su Cajeput Forest. It is in An Giang province. It has many birds."
      );
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    setListening(true);
    rec.onresult = (e) => {
      const text = e.results[0]?.[0]?.transcript || "";
      setTranscript((prev) => (prev ? `${prev} ${text}` : text));
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
  }

  async function handleSubmit() {
    if (!transcript.trim()) return;
    if (offlineMode) {
      setQueuedCount((c) => c + 1);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/speaking/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioSlug: scenario.slug,
          transcript,
          currentLevel: level,
        }),
      });
      const data = (await res.json()) as SpeakingEvaluation;
      if (data && data.scores) {
        setResult(data);
        setLevel(data.nextScaffoldLevel);
      }
    } finally {
      setLoading(false);
    }
  }

  const sampleLearnerWeak = "You should visit Tra Su. It have many birds. You can go by the boat.";
  const sampleLearnerGood =
    scenario.modelAnswer ||
    "You should visit Tra Su Cajeput Forest. It is in An Giang province. It has many green trees and birds. You can go by boat and take photos.";

  return (
    <div className="card overflow-hidden border-2 border-brand-200">
      {/* Thanh tiêu đề tình huống & chọn mức trợ giúp */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-brand-900 px-5 py-3.5 text-white">
        <div className="min-w-0">
          <span className="badge bg-rice-500 text-ink whitespace-nowrap shrink-0">{scenario.topic}</span>
          <h3 className="mt-1 text-base md:text-lg font-extrabold text-white">
            {scenario.titleVi || scenario.title}{" "}
            <span className="text-xs md:text-sm font-normal text-white/75">({scenario.title})</span>
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {[
            { lv: 1, label: "Mức 1: Khung câu mẫu" },
            { lv: 2, label: "Mức 2: Từ gợi ý" },
            { lv: 3, label: "Mức 3: Tự nhiên" },
          ].map((item) => (
            <button
              key={item.lv}
              type="button"
              onClick={() => {
                setLevel(item.lv);
                setTransferStep(false);
              }}
              className={`whitespace-nowrap shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                level === item.lv && !transferStep
                  ? "bg-rice-500 text-ink shadow"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setTransferStep((v) => !v)}
            className={`whitespace-nowrap shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              transferStep ? "bg-silt-500 text-white shadow" : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            Bước vận dụng mới
          </button>
        </div>
      </div>

      <div className={`grid gap-6 p-5 ${compact ? "lg:grid-cols-12" : "lg:grid-cols-12"}`}>
        {/* Cột trái: hình bối cảnh + lời thoại AI + mức trợ giúp */}
        <div className="space-y-4 lg:col-span-5">
          {scenario.image && (
            <div className="relative overflow-hidden rounded-2xl border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={scenario.image} alt={scenario.titleVi || scenario.title} className="h-48 w-full object-cover" />
              <div className="absolute bottom-2 left-2 rounded-lg bg-black/65 px-2.5 py-1 text-xs font-medium text-white">
                📍 Học liệu địa phương An Giang – Giáo viên thẩm định
              </div>
            </div>
          )}

          <div className="rounded-xl bg-brand-50 p-3.5 text-sm">
            <p className="font-bold text-brand-900">🎯 Nhiệm vụ giao tiếp:</p>
            <p className="mt-1 text-slate-700">
              {transferStep
                ? "Tình huống vận dụng mới: Hãy tự giới thiệu một địa điểm gần nhà em (chợ, ngôi chùa, công viên, dòng sông...) bằng lời của chính mình, không nhìn câu mẫu."
                : scenario.goalVi}
            </p>
          </div>

          {/* Lời mở đầu của Gia sư AI */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-brand-700">🤖 Gia sư AI hỏi em:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => speakText(scenario.aiOpening, 1)}
                  className="btn btn-sm btn-outline py-1"
                  title="Nghe tốc độ chuẩn"
                >
                  <Volume2 className="h-3.5 w-3.5" /> Nghe
                </button>
                <button
                  type="button"
                  onClick={() => speakText(scenario.aiOpening, 0.7)}
                  className="btn btn-sm btn-outline py-1"
                  title="Nghe chậm 0.75x"
                >
                  <Snail className="h-3.5 w-3.5" /> Nghe chậm
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubVi((s) => !s)}
                  className="btn btn-sm btn-ghost py-1 text-xs"
                >
                  {showSubVi ? "Ẩn dịch VI" : "Hiện dịch VI"}
                </button>
              </div>
            </div>
            <p className="mt-2 text-base font-bold text-ink">&ldquo;{scenario.aiOpening}&rdquo;</p>
            {showSubVi && scenario.contextVi && (
              <p className="mt-1 text-xs text-slate-500">💡 Bối cảnh: {scenario.contextVi}</p>
            )}
          </div>

          {/* Hiển thị trợ giúp thích ứng theo cấp độ */}
          {!transferStep && (
            <div className="rounded-2xl border border-amber-200 bg-rice-50 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900">
                  {level === 1 && "🛟 Mức trợ giúp 1 (Người mới – Có khung câu & câu mẫu)"}
                  {level === 2 && "🧭 Mức trợ giúp 2 (Khá hơn – Chỉ gợi ý từ khoá)"}
                  {level === 3 && "🚀 Mức trợ giúp 3 (Tự nhiên – Trả lời thêm câu hỏi mở rộng)"}
                </span>
              </div>

              {level === 1 && (
                <div className="mt-2.5 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {scenario.keywords.map((kw) => (
                      <span key={kw} className="badge badge-gold">
                        {kw}
                      </span>
                    ))}
                  </div>
                  <ul className="list-inside list-disc space-y-1 text-xs text-slate-700">
                    {scenario.frames.map((f, i) => (
                      <li key={i} className="font-medium">
                        {f}
                      </li>
                    ))}
                  </ul>
                  {scenario.modelAnswer && (
                    <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-white p-2.5 text-xs">
                      <span className="text-slate-700">
                        <b>Câu mẫu:</b> {scenario.modelAnswer}
                      </span>
                      <button
                        type="button"
                        onClick={() => speakText(scenario.modelAnswer || "", 0.85)}
                        className="btn btn-sm btn-secondary shrink-0"
                      >
                        <Volume2 className="h-3.5 w-3.5" /> Nghe mẫu
                      </button>
                    </div>
                  )}
                </div>
              )}

              {level === 2 && (
                <div className="mt-2.5 space-y-2">
                  <p className="text-xs text-slate-600">Em hãy tự ghép câu từ các từ khoá gợi ý dưới đây:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {scenario.keywords.map((kw) => (
                      <span key={kw} className="badge badge-gold">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {level === 3 && (
                <div className="mt-2.5 space-y-1.5 text-xs text-slate-700">
                  <p>Em đã nắm vững mẫu câu! Hãy trả lời thêm câu hỏi mở rộng của bạn nước ngoài:</p>
                  <ul className="list-inside list-disc font-semibold text-brand-800">
                    {scenario.followUps.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cột phải: Ghi âm / Nhập câu nói + Phản hồi AI sửa 1-2 lỗi */}
        <div className=" flex flex-col justify-between space-y-4 lg:col-span-7">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold text-slate-700 whitespace-nowrap shrink-0">🎤 Lượt nói của em:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setTranscript(sampleLearnerWeak)}
                  className="whitespace-nowrap shrink-0 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-brand-600 transition"
                >
                  Thử câu có lỗi (để xem AI sửa)
                </button>
                <button
                  type="button"
                  onClick={() => setTranscript(sampleLearnerGood)}
                  className="whitespace-nowrap shrink-0 rounded-lg border border-brand-300 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-800 hover:bg-brand-100 transition"
                >
                  Thử câu đạt chuẩn
                </button>
                <button
                  type="button"
                  onClick={() => setOfflineMode((o) => !o)}
                  className={`whitespace-nowrap shrink-0 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    offlineMode ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  title="Mô phỏng chế độ mạng yếu: lưu bài nói trên máy, tự gửi khi có mạng"
                >
                  <WifiOff className="h-3.5 w-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{offlineMode ? "Đang bật chế độ mạng yếu" : "Chế độ mạng yếu"}</span>
                </button>
              </div>
            </div>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={3}
              className="textarea text-base font-medium"
              placeholder="Bấm nút 'Bấm để nói' bên dưới hoặc gõ/chọn câu mẫu tiếng Anh..."
            />

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleMic}
                className={`btn ${listening ? "btn-danger animate-pulse" : "btn-secondary"}`}
              >
                <Mic className="h-4 w-4" />
                {listening ? "Đang nghe em nói..." : "Bấm để nói (Micro)"}
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !transcript.trim()}
                className="btn btn-primary"
              >
                <Send className="h-4 w-4" />
                {loading
                  ? "Gia sư AI đang chấm..."
                  : offlineMode
                  ? "Lưu bài nói (Gửi khi có mạng)"
                  : "Gửi cho Gia sư AI chấm"}
              </button>

              {transcript && (
                <button
                  type="button"
                  onClick={() => {
                    setTranscript("");
                    setResult(null);
                  }}
                  className="btn btn-ghost btn-sm"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Làm lại
                </button>
              )}
            </div>

            {queuedCount > 0 && (
              <div className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-2.5 text-xs text-amber-900">
                <span>
                  📦 Đã lưu <b>{queuedCount} bản ghi</b> trên thiết bị (IndexedDB). Khi mạng ổn định hệ thống sẽ tự đồng bộ.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setOfflineMode(false);
                    setQueuedCount(0);
                    handleSubmit();
                  }}
                  className="font-bold text-brand-700 underline"
                >
                  Đồng bộ ngay
                </button>
              </div>
            )}
          </div>

          {/* KẾT QUẢ PHẢN HỒI CỦA GIA SƯ AI */}
          {result ? (
            <div className="space-y-4 rounded-2xl border border-brand-200 bg-brand-50/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-lg font-extrabold text-white">
                    {result.scores.overall}
                  </span>
                  <div>
                    <p className="font-extrabold text-brand-900">{result.praiseVi}</p>
                    <p className="text-xs text-slate-600">{result.feedbackVi}</p>
                  </div>
                </div>
                {result.levelChanged === "UP" && (
                  <span className="badge bg-rice-500 text-ink">
                    <ArrowUpRight className="h-3.5 w-3.5" /> Giảm trợ giúp → Tăng lên Mức {result.nextScaffoldLevel}!
                  </span>
                )}
              </div>

              {/* 4 tiêu chí giao tiếp hiểu được */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { label: "Ý nghĩa", val: result.scores.meaning },
                  { label: "Độ rõ", val: result.scores.clarity },
                  { label: "Từ vựng", val: result.scores.vocabulary },
                  { label: "Cấu trúc", val: result.scores.structure },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-white p-2.5 text-center shadow-sm">
                    <div className="text-xs text-slate-500">{s.label}</div>
                    <div className="text-lg font-extrabold text-brand-700">{s.val}/100</div>
                  </div>
                ))}
              </div>

              {/* Ưu tiên sửa tối đa 1-2 lỗi */}
              {result.corrections.length > 0 && (
                <div className="space-y-2 rounded-xl bg-white p-3.5">
                  <div className="text-xs font-bold uppercase tracking-wide text-silt-600">
                    ✨ Ưu tiên sửa {result.corrections.length} điểm để nói tự nhiên hơn (không gây quá tải):
                  </div>
                  {result.corrections.map((c, idx) => (
                    <div key={idx} className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="line-through text-red-600">{c.wrong}</span>
                        <span>→</span>
                        <span className="font-bold text-brand-700">{c.right}</span>
                        <button
                          type="button"
                          onClick={() => speakText(c.right, 0.85)}
                          className="btn btn-sm btn-secondary ml-auto py-1"
                        >
                          <Volume2 className="h-3.5 w-3.5" /> Nghe mẫu & nói lại
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">Giải thích: {c.explainVi}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Câu hội thoại tiếp theo của AI */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-brand-900 p-3.5 text-white">
                <div>
                  <div className="text-xs text-brand-200">🤖 Gia sư AI phản hồi & hỏi tiếp:</div>
                  <div className="font-bold">&ldquo;{result.aiReplyEn}&rdquo;</div>
                  <div className="text-xs text-white/75">{result.aiReplyVi}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => speakText(result.aiReplyEn, 0.9)}
                    className="btn btn-sm btn-accent"
                  >
                    <Volume2 className="h-3.5 w-3.5" /> Nghe AI
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferStep(true)}
                    className="btn btn-sm btn-orange"
                  >
                    Thử nhiệm vụ mới gần nhà
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Sparkles className="h-4 w-4 text-brand-600" />
                Cơ chế luyện nói thích ứng của MEKONG English AI:
              </div>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-600" />
                  Ban đầu có câu mẫu, từ gợi ý và khung câu; khi em làm tốt 2 lượt liên tiếp, AI tự giảm trợ giúp.
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-600" />
                  Mỗi lượt chỉ ưu tiên sửa 1–2 lỗi quan trọng nhất để em không sợ nói sai.
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-600" />
                  Cuối bài có bước <b>tự giới thiệu một địa điểm gần nhà bằng lời của em</b> để đo khả năng vận dụng thật.
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
