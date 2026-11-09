"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, CheckCircle2, Volume2 } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";

const QUESTIONS = [
  {
    q: "1. Câu nào giới thiệu tuổi đúng ngữ pháp?",
    options: ["I eleven years old.", "I am eleven years old.", "My is eleven years old.", "I have eleven old."],
    ans: "I am eleven years old.",
  },
  {
    q: "2. Khi bạn nước ngoài hỏi 'Where should I go in An Giang?', em trả lời thế nào tự nhiên nhất?",
    options: [
      "You should visit Tra Su Cajeput Forest.",
      "You should to visit Tra Su.",
      "Tra Su is go boat.",
      "Yes, I am.",
    ],
    ans: "You should visit Tra Su Cajeput Forest.",
  },
  {
    q: "3. 'Cặp sách' và 'Giờ ra chơi' trong tiếng Anh lần lượt là:",
    options: ["school bag – break time", "notebook – bed time", "uniform – lunch time", "bridge – market"],
    ans: "school bag – break time",
  },
  {
    q: "4. Chọn từ điền vào chỗ trống: 'There ___ many birds in Tra Su forest.'",
    options: ["are", "is", "am", "be"],
    ans: "are",
  },
  {
    q: "5. Để chỉ đường 'Đi thẳng rồi rẽ trái', em nói:",
    options: [
      "Go straight and turn left.",
      "Go left and turn straight.",
      "Come back and sit down.",
      "How much is it?",
    ],
    ans: "Go straight and turn left.",
  },
];

export default function PlacementTestPage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [speakingText, setSpeakingText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const score = QUESTIONS.reduce((s, item, idx) => s + (answers[idx] === item.ans ? 1 : 0), 0);
  const speakingBonus = speakingText.trim().split(/\s+/).length >= 5 ? 1 : 0;
  const total = score + speakingBonus;

  const recommended =
    total <= 2
      ? {
          level: "Mức khởi đầu (A0 – Nên bắt đầu với Trợ giúp Mức 1)",
          courseSlug: "tieng-anh-lop-6",
          courseTitle: "Tiếng Anh lớp 6 – Nói tự tin từ điều gần gũi (Kèm khung câu mẫu)",
        }
      : total <= 4
      ? {
          level: "Mức cơ bản (A1 – Bắt đầu với Trợ giúp Mức 2)",
          courseSlug: "tieng-anh-lop-6",
          courseTitle: "Tiếng Anh lớp 6 – Luyện nói theo từ khoá gợi ý",
        }
      : {
          level: "Mức khá (A1+ / A2 – Sẵn sàng hội thoại tự nhiên Mức 3)",
          courseSlug: "tieng-anh-lop-7",
          courseTitle: "Tiếng Anh lớp 7 – Giao tiếp đời sống miền Tây & Tình huống mở rộng",
        };

  function speakPrompt() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance("Hi! Tell me your name, your grade, and one place in An Giang you like.");
    u.lang = "en-US";
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  }

  return (
    <div className="py-12">
      <div className="container max-w-4xl space-y-8">
        <div className="text-center">
          <span className="eyebrow">🎯 Bài kiểm tra nhanh đầu vào (5–10 phút)</span>
          <h1 className="text-3xl font-extrabold md:text-4xl">
            Kiểm tra trình độ & Xác định mức trợ giúp AI phù hợp
          </h1>
          <p className="mt-2 text-slate-600">
            Hoàn thành 5 câu trắc nghiệm và 1 câu tự giới thiệu để hệ thống gợi ý lộ trình và mức trợ giúp (Mức 1, 2 hay 3).
          </p>
        </div>

        <div className="card space-y-6 p-6 md:p-8">
          {QUESTIONS.map((item, idx) => (
            <div key={idx} className="space-y-2 border-b border-slate-100 pb-5 last:border-0">
              <div className="font-bold text-ink">{item.q}</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {item.options.map((opt) => {
                  const chosen = answers[idx] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, [idx]: opt }))}
                      className={`rounded-xl border p-3 text-left text-sm transition ${
                        chosen
                          ? "border-brand-600 bg-brand-50 font-bold text-brand-800"
                          : "border-slate-200 hover:border-brand-400"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Câu 6: Tự diễn đạt ngắn */}
          <div className="space-y-2 rounded-2xl bg-rice-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-bold text-amber-900">
                6. Câu hỏi nói/viết ngắn: Giới thiệu tên, lớp và 1 địa điểm ở An Giang mà em thích
              </div>
              <button type="button" onClick={speakPrompt} className="btn btn-sm btn-outline">
                <Volume2 className="h-4 w-4" /> Nghe câu hỏi
              </button>
            </div>
            <input
              value={speakingText}
              onChange={(e) => setSpeakingText(e.target.value)}
              className="input"
              placeholder="VD: My name is Bao. I am in grade 6. I like Tra Su forest."
            />
          </div>

          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="btn btn-lg btn-primary w-full"
          >
            <Sparkles className="h-5 w-5" /> Xem kết quả & Lộ trình đề xuất
          </button>
        </div>

        {submitted && (
          <div className="card space-y-4 border-2 border-brand-500 bg-brand-50/50 p-6 md:p-8">
            <div className="flex items-center gap-2 text-brand-800 font-bold">
              <CheckCircle2 className="h-6 w-6 text-brand-600" />
              Kết quả của em: {total}/6 điểm — {recommended.level}
            </div>
            <p className="text-sm text-slate-700">
              Khoá học đề xuất: <b>{recommended.courseTitle}</b>
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/khoa-hoc/${recommended.courseSlug}`} className="btn btn-primary">
                Vào khoá học đề xuất
              </Link>
              <Link href="/hoc" className="btn btn-outline">
                Vào buổi học 15 phút ngay
              </Link>
            </div>
          </div>
        )}

        <LeadForm
          source="PLACEMENT_TEST"
          title="Nhận kết quả chi tiết & Tư vấn lộ trình qua Zalo"
        />
      </div>
    </div>
  );
}
