import "server-only";
import { db } from "./db";

/**
 * Cấu hình website (quản lý trong Admin > Website > Cấu hình).
 * Mỗi key lưu một chuỗi JSON trong bảng SiteSetting; nếu chưa có thì dùng giá trị mặc định dưới đây.
 */
export const DEFAULT_SETTINGS = {
  company: {
    brand: "MEKONG English AI",
    name: "Công ty TNHH Công nghệ Mekong Green AI",
    taxCode: "0000000000",
    address: "Long Xuyên, An Giang",
    hotline: "0900 000 000",
    email: "hello@mekongenglish.ai",
    zalo: "https://zalo.me/0900000000",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
  },
  hero: {
    eyebrow: "Ứng dụng học tiếng Anh thông minh cho học sinh An Giang",
    title: "Mỗi ngày 15 phút – Nói tiếng Anh tự tin từ những điều gần gũi",
    subtitle:
      "Học qua hình ảnh, câu chuyện về trường học, chợ nổi, món ăn, điểm đến An Giang. Luyện nói có hướng dẫn cùng gia sư AI và nhìn thấy tiến bộ mỗi tuần.",
    image: "/images/hero.jpg",
    ctaPrimary: "Học thử miễn phí",
    ctaSecondary: "Xem buổi học mẫu",
    videoUrl: "",
  },
  slogan: "Học gần gũi – Nói tự tin – Dùng được mỗi ngày.",
  stats: {
    show: true,
    items: [
      { value: "60+", label: "Bài học ngắn lớp 6–7" },
      { value: "30", label: "Tình huống giao tiếp" },
      { value: "15'", label: "Mỗi ngày là đủ" },
      { value: "4–6", label: "Trường thí điểm 2026–2027" },
    ],
  },
  sections: {
    howItWorks: true,
    differentiators: true,
    packages: true,
    videos: true,
    live: true,
    demo: true,
    parents: true,
    schools: true,
    tutors: true,
    testimonials: true,
    pricing: true,
    faq: true,
    leadForm: true,
  },
  tracking: { ga4: "", fbPixel: "", gtm: "" },
  ai: {
    provider: "RULES", // RULES | GEMINI
    freeDailyLimit: 5,
    costPerSttMinute: 300, // VND/phút audio (ước tính)
    costPerLlmCall: 50, // VND/lượt phản hồi
    monthlyBudget: 5000000,
  },
  privacy: { voiceRetentionDays: 180, requireParentConsentUnder: 16 },
};

export type SiteSettings = typeof DEFAULT_SETTINGS;
export type SettingKey = keyof SiteSettings;

export async function getSettings(): Promise<SiteSettings> {
  const rows = await db.siteSetting.findMany();
  const result = structuredClone(DEFAULT_SETTINGS) as Record<string, unknown>;
  for (const r of rows) {
    try {
      const v = JSON.parse(r.value);
      const def = (DEFAULT_SETTINGS as Record<string, unknown>)[r.key];
      result[r.key] = def && typeof def === "object" && !Array.isArray(def) ? { ...(def as object), ...v } : v;
    } catch {
      /* bỏ qua giá trị lỗi */
    }
  }
  return result as SiteSettings;
}

export async function getSetting<K extends SettingKey>(key: K): Promise<SiteSettings[K]> {
  const s = await getSettings();
  return s[key];
}

export async function saveSetting<K extends SettingKey>(key: K, value: SiteSettings[K]) {
  const str = JSON.stringify(value);
  await db.siteSetting.upsert({ where: { key }, update: { value: str }, create: { key, value: str } });
}
