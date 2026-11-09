import "server-only";
import { db } from "./db";
import { parseJson } from "./utils";

export type SpeakingMistake = {
  wrong: string;
  right: string;
  explainVi: string;
};

export type SpeakingEvaluation = {
  scores: {
    meaning: number;
    clarity: number;
    vocabulary: number;
    structure: number;
    overall: number;
  };
  praiseVi: string;
  feedbackVi: string;
  corrections: SpeakingMistake[]; // Tối đa 1-2 lỗi ưu tiên mỗi lượt
  aiReplyEn: string;
  aiReplyVi: string;
  nextScaffoldLevel: number;
  levelChanged?: "UP" | "DOWN" | "SAME";
  provider: "RULES" | "GEMINI";
};

const COMMON_GRAMMAR_RULES: Array<{
  pattern: RegExp;
  wrong: string;
  right: string;
  explainVi: string;
}> = [
  {
    pattern: /\bi\s+(eleven|twelve|thirteen|ten|\d+)\s+years?\s+old\b/i,
    wrong: "I eleven years old",
    right: "I am eleven years old",
    explainVi: "Thiếu động từ to be 'am' sau chủ ngữ 'I' khi nói tuổi.",
  },
  {
    pattern: /\bit\s+have\b/i,
    wrong: "It have",
    right: "It has",
    explainVi: "Chủ ngữ số ít 'It' đi với 'has', không dùng 'have'.",
  },
  {
    pattern: /\bby\s+the\s+(boat|bus|bike|motorbike|car)\b/i,
    wrong: "by the boat/bus",
    right: "by boat / by bus",
    explainVi: "Khi nói phương tiện đi lại với 'by', không thêm 'the' ở giữa.",
  },
  {
    pattern: /\bthere\s+is\s+many\b/i,
    wrong: "There is many...",
    right: "There are many...",
    explainVi: "Danh từ số nhiều ('many...') đi với 'There are'.",
  },
  {
    pattern: /\byou\s+should\s+to\s+\w+/i,
    wrong: "You should to visit",
    right: "You should visit",
    explainVi: "Sau động từ khuyết thiếu 'should' là động từ nguyên mẫu không 'to'.",
  },
  {
    pattern: /\bi\s+like\s+(play|watch|eat|go|cook)\b/i,
    wrong: "I like play...",
    right: "I like playing...",
    explainVi: "Sau 'like' nên dùng V-ing (ví dụ: playing, watching) để nói sở thích.",
  },
];

/**
 * Chấm câu nói của học sinh theo 4 tiêu chí (Ý nghĩa, Độ rõ, Từ vựng, Cấu trúc),
 * ưu tiên sửa tối đa 1-2 lỗi quan trọng nhất và điều chỉnh mức trợ giúp (Scaffolding 1 -> 2 -> 3).
 */
export async function evaluateSpeaking(params: {
  userId?: string | null;
  scenario: {
    id: string;
    title: string;
    titleVi?: string | null;
    goalVi: string;
    keywordsJson: string;
    framesJson: string;
    followUpsJson: string;
    modelAnswer?: string | null;
    passThreshold: number;
  };
  transcript: string;
  currentLevel: number;
}): Promise<SpeakingEvaluation> {
  const { userId, scenario, transcript, currentLevel } = params;
  const clean = transcript.trim();
  const words = clean.split(/\s+/).filter(Boolean);
  const lower = clean.toLowerCase();

  const keywords = parseJson<string[]>(scenario.keywordsJson, []);
  const followUps = parseJson<string[]>(scenario.followUpsJson, []);

  // 1. Đánh giá từ khoá & ý nghĩa
  const matchedKeywords = keywords.filter((kw) => lower.includes(kw.toLowerCase()));
  const kwRatio = keywords.length > 0 ? matchedKeywords.length / Math.min(keywords.length, 4) : 0.75;

  // 2. Phát hiện tối đa 1-2 lỗi phổ biến
  const corrections: SpeakingMistake[] = [];
  for (const r of COMMON_GRAMMAR_RULES) {
    if (r.pattern.test(clean)) {
      corrections.push({ wrong: r.wrong, right: r.right, explainVi: r.explainVi });
      if (corrections.length >= 2) break;
    }
  }

  const missingKeywords = keywords.filter((kw) => !lower.includes(kw.toLowerCase())).slice(0, 2);
  if (corrections.length < 2 && words.length < 6 && scenario.modelAnswer) {
    corrections.push({
      wrong: clean || "(Câu còn quá ngắn)",
      right: scenario.modelAnswer.split(".")[0] + ".",
      explainVi: "Em hãy nói thành câu trọn vẹn hơn theo gợi ý nhé.",
    });
  } else if (corrections.length === 0 && missingKeywords.length > 0) {
    corrections.push({
      wrong: clean,
      right: `${clean.replace(/\.$/, "")} (${missingKeywords.join(", ")})`,
      explainVi: `Em có thể thêm từ khoá "${missingKeywords.join('", "')}" để câu đầy đủ ý hơn.`,
    });
  }

  // 3. Điểm 4 tiêu chí
  const lengthFactor = Math.min(1, words.length / 10);
  const meaning = Math.round(Math.min(96, Math.max(40, 45 + kwRatio * 40 + lengthFactor * 15)));
  const clarity = Math.round(Math.min(95, Math.max(45, 55 + lengthFactor * 35 - corrections.length * 5)));
  const vocabulary = Math.round(Math.min(96, Math.max(42, 48 + kwRatio * 45)));
  const structure = Math.round(Math.min(95, Math.max(40, 82 - corrections.length * 14 + (words.length >= 6 ? 10 : -10))));
  const overall = Math.round((meaning * 0.35 + clarity * 0.25 + vocabulary * 0.2 + structure * 0.2));

  // 4. Lời khen + nhận xét ngắn gọn bằng tiếng Việt
  const praiseVi =
    overall >= 80
      ? "Tuyệt vời! Người nghe hoàn toàn hiểu ý của em."
      : overall >= 65
      ? "Khá tốt! Em đã truyền đạt được ý chính."
      : "Khởi đầu tốt! Đừng sợ sai, mình thử nói rõ từng câu nhé.";

  const feedbackVi =
    matchedKeywords.length > 0
      ? `Em đã dùng tốt từ khoá: ${matchedKeywords.join(", ")}. ${
          corrections[0] ? corrections[0].explainVi : "Hãy thử mở rộng thêm 1 câu nữa nhé!"
        }`
      : `Em hãy dùng thêm các từ gợi ý (${keywords.slice(0, 3).join(", ")}) để bám sát tình huống nhé.`;

  // 5. Câu trả lời hội thoại tiếp theo của AI
  const followUp = followUps[Math.floor(Math.random() * Math.max(1, followUps.length))] || "Can you tell me one more thing about it?";
  const aiReplyEn =
    overall >= 70
      ? `That sounds wonderful! ${followUp}`
      : `Good try! Let's say it one more time clearly. ${followUp}`;
  const aiReplyVi =
    overall >= 70
      ? `Nghe thú vị quá! Em trả lời thêm câu hỏi mở rộng này nhé.`
      : `Cố lên! Em nghe mẫu rồi thử nói lại lần nữa nhé.`;

  // 6. Điều chỉnh mức trợ giúp (Scaffolding 1 -> 2 -> 3)
  let nextScaffoldLevel = currentLevel;
  let levelChanged: "UP" | "DOWN" | "SAME" = "SAME";
  const passed = overall >= (scenario.passThreshold || 70);

  if (userId) {
    const existing = await db.scenarioProgress.findUnique({
      where: { userId_scenarioId: { userId, scenarioId: scenario.id } },
    });
    const passStreak = passed ? (existing?.passStreak ?? 0) + 1 : 0;
    const failStreak = !passed ? (existing?.failStreak ?? 0) + 1 : 0;
    let newLevel = existing?.scaffoldLevel ?? currentLevel;

    // Làm tốt 2 lượt liên tiếp -> tăng cấp (giảm trợ giúp, chuyển sang hội thoại tự nhiên)
    if (passStreak >= 2 && newLevel < 3) {
      newLevel += 1;
      levelChanged = "UP";
    } else if (failStreak >= 2 && newLevel > 1) {
      // Gặp khó 2 lượt -> tăng trợ giúp (hạ về mức có khung câu)
      newLevel -= 1;
      levelChanged = "DOWN";
    }

    nextScaffoldLevel = newLevel;
    await db.scenarioProgress.upsert({
      where: { userId_scenarioId: { userId, scenarioId: scenario.id } },
      update: {
        scaffoldLevel: newLevel,
        passStreak: levelChanged !== "SAME" ? 0 : passStreak,
        failStreak: levelChanged !== "SAME" ? 0 : failStreak,
        bestScore: Math.max(existing?.bestScore ?? 0, overall),
        attempts: { increment: 1 },
      },
      create: {
        userId,
        scenarioId: scenario.id,
        scaffoldLevel: newLevel,
        passStreak,
        failStreak,
        bestScore: overall,
        attempts: 1,
      },
    });

    await db.speakingAttempt.create({
      data: {
        userId,
        scenarioId: scenario.id,
        scaffoldLevel: currentLevel,
        transcript: clean,
        scoresJson: JSON.stringify({ meaning, clarity, vocabulary, structure, overall }),
        overall,
        feedbackVi: `${praiseVi} ${feedbackVi}`,
        correctionsJson: JSON.stringify(corrections),
        provider: "RULES",
      },
    });

    await db.aiUsageLog.createMany({
      data: [
        { userId, kind: "STT", provider: "RULES", units: Math.max(5, words.length * 2), cost: 80 },
        { userId, kind: "LLM", provider: "RULES", units: 450, cost: 40 },
      ],
    });
  } else {
    if (passed && currentLevel < 3) {
      nextScaffoldLevel = currentLevel + 1;
      levelChanged = "UP";
    }
  }

  return {
    scores: { meaning, clarity, vocabulary, structure, overall },
    praiseVi,
    feedbackVi,
    corrections: corrections.slice(0, 2),
    aiReplyEn,
    aiReplyVi,
    nextScaffoldLevel,
    levelChanged,
    provider: "RULES",
  };
}
