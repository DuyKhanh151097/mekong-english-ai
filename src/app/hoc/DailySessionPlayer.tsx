"use client";

import { useState, useRef } from "react";
import {
  Clock,
  Volume2,
  Snail,
  CheckCircle2,
  ArrowRight,
  Download,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { SpeakingPracticeWidget, type ScenarioClientData } from "@/components/SpeakingPracticeWidget";
import { completeDailySessionAction } from "@/lib/learner-actions";

type VocabItem = { word: string; ipa: string; meaning: string; example: string };
type SentenceItem = { en: string; vi: string };
type DialogueItem = { speaker: string; en: string; vi: string };
type QuestionItem = {
  id: string;
  type: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation?: string | null;
};

export function DailySessionPlayer({
  lesson,
  scenario,
}: {
  lesson: {
    id: string;
    title: string;
    summary?: string | null;
    image?: string | null;
    videoUrl?: string | null;
    vocab: VocabItem[];
    sentences: SentenceItem[];
    dialogue: DialogueItem[];
    tipVi?: string;
    questions: QuestionItem[];
  };
  scenario: ScenarioClientData;
}) {
  const [step, setStep] = useState<number>(1);
  const [showViSub, setShowViSub] = useState(true);
  const [downloadedOffline, setDownloadedOffline] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function speak(text: string, rate = 1) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = rate;
    window.speechSynthesis.speak(u);
  }

  function setVideoRate(rate: number) {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      videoRef.current.play();
    }
  }

  const steps = [
    { n: 1, min: "2 phút", label: "Ôn lại" },
    { n: 2, min: "3 phút", label: "Xem & nghe" },
    { n: 3, min: "6 phút", label: "Luyện nói với AI" },
    { n: 4, min: "3 phút", label: "Sửa lỗi & bài tập" },
    { n: 5, min: "1 phút", label: "Xem kết quả" },
  ];

  const correctCount = lesson.questions.filter(
    (q) => (quizAnswers[q.id] || "").trim().toLowerCase() === q.answer.trim().toLowerCase()
  ).length;

  return (
    <div className="card overflow-hidden border-2 border-brand-500">
      {/* Thanh tiến trình 5 bước của buổi học 15 phút */}
      <div className="bg-brand-900 px-5 py-4 text-white">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="badge bg-rice-500 text-ink">
              <Clock className="h-3.5 w-3.5" /> Buổi học 15 phút hôm nay
            </span>
            <h2 className="mt-1 text-xl font-extrabold text-white">{lesson.title}</h2>
          </div>

          <button
            type="button"
            onClick={() => setDownloadedOffline(true)}
            className="btn btn-sm bg-white/15 text-white hover:bg-white/25"
          >
            <Download className="h-4 w-4" />
            {downloadedOffline ? "Đã tải sẵn (Học được khi mất mạng)" : "Tải trước bài nghe & ảnh"}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-1.5 sm:gap-2">
          {steps.map((s) => {
            const active = step === s.n;
            const done = step > s.n || completed;
            return (
              <button
                key={s.n}
                type="button"
                onClick={() => setStep(s.n)}
                className={`rounded-xl p-2 text-left transition ${
                  active
                    ? "bg-rice-500 text-ink font-extrabold shadow"
                    : done
                    ? "bg-brand-700 text-white"
                    : "bg-white/10 text-white/75 hover:bg-white/20"
                }`}
              >
                <div className="text-[11px] opacity-80 whitespace-nowrap truncate">
                  Bước {s.n} · {s.min}
                </div>
                <div className="truncate text-xs font-bold whitespace-nowrap">{s.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nội dung từng bước */}
      <div className="p-5 md:p-6">
        {/* BƯỚC 1: 2 PHÚT ÔN LẠI */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="badge badge-green">Bước 1/5 · 2 phút ôn lại</span>
                <h3 className="mt-1 text-lg font-extrabold">
                  Nghe và nói lại các từ & mẫu câu trọng tâm
                </h3>
              </div>
              <button type="button" onClick={() => setStep(2)} className="btn btn-primary">
                Sang Bước 2: Xem & nghe <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {lesson.vocab.map((v) => (
                <div key={v.word} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-extrabold text-brand-800">{v.word}</span>
                      <span className="ml-2 text-xs text-slate-500">{v.ipa}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => speak(v.word, 1)}
                        className="btn btn-sm btn-outline py-1"
                      >
                        <Volume2 className="h-3.5 w-3.5" /> Nghe
                      </button>
                      <button
                        type="button"
                        onClick={() => speak(v.word, 0.65)}
                        className="btn btn-sm btn-outline py-1"
                        title="Nghe chậm"
                      >
                        <Snail className="h-3.5 w-3.5" /> Chậm
                      </button>
                    </div>
                  </div>
                  <div className="mt-1 text-sm font-semibold text-ink">Nghĩa: {v.meaning}</div>
                  <div className="mt-1 text-xs text-slate-600">Ví dụ: “{v.example}”</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BƯỚC 2: 3 PHÚT XEM VÀ NGHE */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="badge badge-green">Bước 2/5 · 3 phút xem và nghe</span>
                <h3 className="mt-1 text-lg font-extrabold">
                  Xem video bài giảng / hội thoại mẫu (Có nút nghe chậm & phụ đề)
                </h3>
              </div>
              <button type="button" onClick={() => setStep(3)} className="btn btn-primary">
                Sang Bước 3: Luyện nói với AI <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
              <div className="space-y-3 lg:col-span-7">
                {lesson.videoUrl ? (
                  <video
                    ref={videoRef}
                    controls
                    poster={lesson.image || "/images/tra-su.jpg"}
                    src={lesson.videoUrl}
                    className="aspect-video w-full rounded-2xl bg-black"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={lesson.image || "/images/tra-su.jpg"}
                    alt={lesson.title}
                    className="aspect-video w-full rounded-2xl object-cover"
                  />
                )}
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setVideoRate(1)} className="btn btn-sm btn-outline">
                    <Volume2 className="h-3.5 w-3.5" /> Tốc độ chuẩn 1.0x
                  </button>
                  <button type="button" onClick={() => setVideoRate(0.75)} className="btn btn-sm btn-outline">
                    <Snail className="h-3.5 w-3.5" /> Nghe chậm 0.75x
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = 0;
                        videoRef.current.play();
                      }
                    }}
                    className="btn btn-sm btn-outline"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Nghe lại
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowViSub((s) => !s)}
                    className="btn btn-sm btn-secondary"
                  >
                    {showViSub ? "Đang bật phụ đề Tiếng Việt" : "Bật phụ đề Tiếng Việt"}
                  </button>
                </div>
              </div>

              <div className="space-y-3 lg:col-span-5">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-bold uppercase text-brand-700">💬 Đoạn hội thoại mẫu:</div>
                  <div className="mt-3 space-y-2.5">
                    {(lesson.dialogue.length > 0
                      ? lesson.dialogue
                      : lesson.sentences.map((s, idx) => ({
                          speaker: idx % 2 === 0 ? "A" : "B",
                          en: s.en,
                          vi: s.vi,
                        }))
                    ).map((d, idx) => (
                      <div key={idx} className="rounded-xl bg-white p-3 shadow-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-ink">
                            <b>{d.speaker}:</b> {d.en}
                          </span>
                          <button
                            type="button"
                            onClick={() => speak(d.en, 0.85)}
                            className="btn btn-sm btn-ghost py-1"
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {showViSub && <div className="mt-0.5 text-xs text-slate-500">{d.vi}</div>}
                      </div>
                    ))}
                  </div>
                </div>
                {lesson.tipVi && (
                  <div className="rounded-xl bg-rice-50 p-3.5 text-xs font-semibold text-amber-900">
                    💡 Mẹo ghi nhớ bằng tiếng Việt: {lesson.tipVi}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* BƯỚC 3: 6 PHÚT LUYỆN NÓI VỚI AI */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="badge badge-gold">Bước 3/5 · 6 phút luyện nói với Gia sư AI</span>
                <h3 className="mt-1 text-lg font-extrabold">
                  Thực hiện nhiệm vụ nói có gợi ý theo trình độ
                </h3>
              </div>
              <button type="button" onClick={() => setStep(4)} className="btn btn-primary">
                Sang Bước 4: Sửa lỗi & bài tập <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <SpeakingPracticeWidget scenario={scenario} compact />
          </div>
        )}

        {/* BƯỚC 4: 3 PHÚT SỬA LỖI, NÓI LẠI & BÀI TẬP NHANH */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="badge badge-orange">Bước 4/5 · 3 phút sửa lỗi & nói lại</span>
                <h3 className="mt-1 text-lg font-extrabold">
                  Nghe mẫu chuẩn, giải thích ngắn bằng tiếng Việt & kiểm tra nhanh
                </h3>
              </div>
              <button type="button" onClick={() => setStep(5)} className="btn btn-primary">
                Sang Bước 5: Xem kết quả <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {lesson.sentences.map((s, idx) => (
                <div key={idx} className="rounded-2xl border border-brand-200 bg-brand-50/50 p-4">
                  <div className="text-xs font-bold text-brand-700">Câu chuẩn cần nhớ #{idx + 1}:</div>
                  <div className="mt-1 text-base font-extrabold text-ink">{s.en}</div>
                  <div className="text-xs text-slate-600">{s.vi}</div>
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => speak(s.en, 1)} className="btn btn-sm btn-secondary">
                      <Volume2 className="h-3.5 w-3.5" /> Nghe mẫu
                    </button>
                    <button type="button" onClick={() => speak(s.en, 0.7)} className="btn btn-sm btn-outline">
                      <Snail className="h-3.5 w-3.5" /> Nghe chậm & nói theo
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {lesson.questions.length > 0 && (
              <div className="space-y-4 rounded-2xl bg-slate-50 p-4">
                <h4 className="font-extrabold">📝 Bài tập tương tác củng cố ({lesson.questions.length} câu):</h4>
                {lesson.questions.map((q, qi) => (
                  <div key={q.id} className="rounded-xl bg-white p-4 shadow-sm space-y-2">
                    <div className="font-bold text-sm">
                      Câu {qi + 1}: {q.prompt}
                    </div>
                    {q.options.length > 0 ? (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {q.options.map((opt) => {
                          const chosen = quizAnswers[q.id] === opt;
                          const isCorrect = opt === q.answer;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setQuizAnswers((p) => ({ ...p, [q.id]: opt }))}
                              className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold ${
                                chosen
                                  ? isCorrect
                                    ? "border-brand-600 bg-brand-50 text-brand-800"
                                    : "border-red-400 bg-red-50 text-red-700"
                                  : "border-slate-200 hover:border-brand-400"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <input
                        value={quizAnswers[q.id] || ""}
                        onChange={(e) => setQuizAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                        placeholder="Nhập đáp án..."
                        className="input max-w-xs"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BƯỚC 5: 1 PHÚT XEM KẾT QUẢ */}
        {step === 5 && (
          <div className="space-y-5">
            <span className="badge badge-green">Bước 5/5 · 1 phút tổng kết</span>
            <h3 className="text-2xl font-extrabold">🎉 Tổng kết buổi học 15 phút hôm nay!</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
                <div className="text-xs font-bold uppercase text-brand-700">✅ Hôm nay em vừa làm được:</div>
                <ul className="mt-2 space-y-1.5 text-sm font-medium text-ink">
                  <li>• Ôn lại {lesson.vocab.length} từ vựng và mẫu câu chủ đề {scenario.topic}</li>
                  <li>• Luyện nói tình huống “{scenario.titleVi || scenario.title}” với Gia sư AI</li>
                  {lesson.questions.length > 0 && (
                    <li>
                      • Hoàn thành bài tập củng cố ({correctCount}/{lesson.questions.length} câu đúng)
                    </li>
                  )}
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-rice-50 p-5">
                <div className="text-xs font-bold uppercase text-amber-900">📌 Ngày mai em cần luyện gì:</div>
                <p className="mt-2 text-sm text-slate-700">
                  • Luyện nói ở <b>Mức trợ giúp 2–3</b> (chỉ nhìn từ khoá gợi ý) và thử ghi âm <b>Nhiệm vụ thực tế</b> giới thiệu một địa điểm gần nhà em.
                </p>
              </div>
            </div>

            {completed ? (
              <div className="rounded-2xl bg-brand-600 p-4 text-center font-bold text-white">
                <CheckCircle2 className="mr-1.5 inline h-5 w-5" />
                Đã lưu tiến bộ hôm nay (+50 XP, +1 ngày chuỗi học)!
              </div>
            ) : (
              <form
                action={async (fd) => {
                  await completeDailySessionAction(fd);
                  setCompleted(true);
                }}
              >
                <input type="hidden" name="lessonId" value={lesson.id} />
                <input type="hidden" name="score" value={88} />
                <input
                  type="hidden"
                  name="summaryVi"
                  value={`Hoàn thành bài "${lesson.title}" và luyện nói "${scenario.titleVi}"`}
                />
                <input
                  type="hidden"
                  name="nextFocusVi"
                  value="Luyện thêm câu hỏi mở rộng và nhiệm vụ thực tế gần nhà"
                />
                <button type="submit" className="btn btn-lg btn-primary w-full">
                  <Sparkles className="h-5 w-5" /> Hoàn thành buổi học 15 phút (+50 XP)
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
