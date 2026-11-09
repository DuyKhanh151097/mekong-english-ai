import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { evaluateSpeaking } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const scenarioSlug = String(body.scenarioSlug || "gioi-thieu-tra-su");
    const transcript = String(body.transcript || "").trim();
    const currentLevel = Number(body.currentLevel || 1);

    if (!transcript) {
      return NextResponse.json({ error: "Vui lòng nói hoặc nhập câu tiếng Anh trước khi chấm." }, { status: 400 });
    }

    const scenario =
      (await db.scenario.findUnique({ where: { slug: scenarioSlug } })) ||
      (await db.scenario.findFirst());

    if (!scenario) {
      return NextResponse.json({ error: "Không tìm thấy tình huống luyện nói." }, { status: 404 });
    }

    const user = await getCurrentUser();
    const result = await evaluateSpeaking({
      userId: user?.id ?? null,
      scenario,
      transcript,
      currentLevel,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Có lỗi khi chấm câu nói." }, { status: 500 });
  }
}
