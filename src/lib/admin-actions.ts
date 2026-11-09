"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { requireUser, audit } from "./auth";
import { ADMIN_ROLES } from "./session";
import { saveSetting } from "./settings";
import { slugify } from "./utils";

/** 1. HỌC LIỆU: Tạo khoá học mới */
export async function adminCreateCourseAction(formData: FormData) {
  const admin = await requireUser(ADMIN_ROLES);
  const title = String(formData.get("title") || "").trim();
  const subtitle = String(formData.get("subtitle") || "").trim();
  const pkg = String(formData.get("package") || "SCHOOL");
  const levelLabel = String(formData.get("levelLabel") || "Lớp 6");
  const price = Number(formData.get("price") || 690000);
  const teacherName = String(formData.get("teacherName") || "Đội ngũ MEKONG English AI");
  if (!title) return;

  const slug = slugify(title) + "-" + Math.floor(Math.random() * 90 + 10);
  const course = await db.course.create({
    data: {
      slug,
      title,
      subtitle,
      package: pkg,
      levelLabel,
      price,
      isFree: price === 0,
      status: "PUBLISHED",
      coverImage: "/images/classroom.jpg",
      teacherName,
      objectivesJson: JSON.stringify(["Nắm vững từ vựng chủ đề", "Luyện nói tự tin với Gia sư AI"]),
    },
  });
  await audit(admin.id, "CREATE", "Course", course.id, title);
  revalidatePath("/admin/hoc-lieu");
  revalidatePath("/khoa-hoc");
}

/** Thêm Video bài giảng mới (hỗ trợ URL MP4/HLS + phụ đề song ngữ EN/VI) */
export async function adminCreateVideoAction(formData: FormData) {
  const admin = await requireUser(ADMIN_ROLES);
  const title = String(formData.get("title") || "").trim();
  const url =
    String(formData.get("url") || "").trim() ||
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
  const subtitleEn = String(formData.get("subtitleEn") || "").trim();
  const subtitleVi = String(formData.get("subtitleVi") || "").trim();
  if (!title) return;

  const v = await db.video.create({
    data: {
      title,
      url,
      provider: "MP4",
      thumbnail: "/images/tra-su.jpg",
      durationSec: 180,
      subtitleEn: subtitleEn || "WEBVTT\n\n00:00:00.000 --> 00:00:05.000\nWelcome to MEKONG English AI",
      subtitleVi: subtitleVi || "WEBVTT\n\n00:00:00.000 --> 00:00:05.000\nChào mừng đến với MEKONG English AI",
    },
  });
  await audit(admin.id, "CREATE", "Video", v.id, title);
  revalidatePath("/admin/hoc-lieu");
  revalidatePath("/khoa-hoc");
}

/** Tạo tình huống hội thoại AI mới (có 3 mức trợ giúp) */
export async function adminCreateScenarioAction(formData: FormData) {
  const admin = await requireUser(ADMIN_ROLES);
  const titleVi = String(formData.get("titleVi") || "").trim();
  const title = String(formData.get("title") || "").trim() || titleVi;
  const topic = String(formData.get("topic") || "Du lịch An Giang");
  const goalVi = String(formData.get("goalVi") || "").trim();
  const aiOpening = String(formData.get("aiOpening") || "Hello! Tell me about this place.").trim();
  const keywords = String(formData.get("keywords") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const frames = String(formData.get("frames") || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const modelAnswer = String(formData.get("modelAnswer") || "").trim();
  if (!titleVi || !goalVi) return;

  const sc = await db.scenario.create({
    data: {
      slug: slugify(titleVi) + "-" + Math.floor(Math.random() * 90 + 10),
      title,
      titleVi,
      topic,
      image: "/images/tra-su.jpg",
      goalVi,
      aiOpening,
      keywordsJson: JSON.stringify(keywords),
      framesJson: JSON.stringify(frames),
      hintsJson: JSON.stringify(keywords),
      followUpsJson: JSON.stringify(["What else can we do there?", "Why do you like it?"]),
      modelAnswer,
      status: "PUBLISHED",
    },
  });
  await audit(admin.id, "CREATE", "Scenario", sc.id, titleVi);
  revalidatePath("/admin/hoc-lieu");
  revalidatePath("/hoc/luyen-noi");
}

/** Duyệt thẩm định học liệu địa phương (Giáo viên / Biên tập viên thẩm định) */
export async function adminVerifyMediaAssetAction(formData: FormData) {
  const admin = await requireUser(ADMIN_ROLES);
  const id = String(formData.get("id") || "");
  if (!id) return;
  await db.mediaAsset.update({
    where: { id },
    data: { verified: true, verifiedBy: admin.name },
  });
  await audit(admin.id, "VERIFY_MEDIA", "MediaAsset", id, "Đã thẩm định học liệu địa phương");
  revalidatePath("/admin/hoc-lieu");
}

export async function adminCreateMediaAssetAction(formData: FormData) {
  const admin = await requireUser(ADMIN_ROLES);
  const title = String(formData.get("title") || "").trim();
  const topic = String(formData.get("topic") || "Du lịch An Giang");
  const source = String(formData.get("source") || "SmartTourism AI");
  const license = String(formData.get("license") || "Được phép khai thác nội bộ Mekong Green AI");
  const content = String(formData.get("content") || "").trim();
  if (!title) return;

  await db.mediaAsset.create({
    data: {
      title,
      type: "STORY",
      url: "/images/nui-sam.jpg",
      topic,
      source,
      license,
      content,
      verified: true,
      verifiedBy: admin.name,
    },
  });
  revalidatePath("/admin/hoc-lieu");
}

/** 2. NGƯỜI DÙNG & TRƯỜNG HỌC */
export async function adminCreateUserAction(formData: FormData) {
  const admin = await requireUser(ADMIN_ROLES);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase() || null;
  const role = String(formData.get("role") || "STUDENT");
  const password = String(formData.get("password") || "123456");
  if (!name) return;

  const u = await db.user.create({
    data: {
      name,
      email,
      role,
      passwordHash: await bcrypt.hash(password, 10),
    },
  });
  await audit(admin.id, "CREATE", "User", u.id, `${name} (${role})`);
  revalidatePath("/admin/nguoi-dung");
}

export async function adminToggleUserStatusAction(formData: FormData) {
  const admin = await requireUser(ADMIN_ROLES);
  const id = String(formData.get("id") || "");
  const current = String(formData.get("status") || "ACTIVE");
  if (!id) return;
  const next = current === "ACTIVE" ? "LOCKED" : "ACTIVE";
  await db.user.update({ where: { id }, data: { status: next } });
  await audit(admin.id, "UPDATE_STATUS", "User", id, next);
  revalidatePath("/admin/nguoi-dung");
}

export async function adminCreateOrgAction(formData: FormData) {
  const admin = await requireUser(ADMIN_ROLES);
  const name = String(formData.get("name") || "").trim();
  const type = String(formData.get("type") || "SCHOOL");
  const address = String(formData.get("address") || "An Giang").trim();
  const licenseSeats = Number(formData.get("licenseSeats") || 150);
  if (!name) return;

  const org = await db.organization.create({
    data: {
      name,
      type,
      address,
      licenseSeats,
      status: "ACTIVE",
      licenseExpiresAt: new Date(Date.now() + 365 * 86400000),
    },
  });
  await audit(admin.id, "CREATE", "Organization", org.id, name);
  revalidatePath("/admin/truong-hoc");
}

/** 3. BÁN HÀNG & BẢNG GIÁ */
export async function adminUpdatePlanPriceAction(formData: FormData) {
  const admin = await requireUser(ADMIN_ROLES);
  const id = String(formData.get("id") || "");
  const price = Number(formData.get("price") || 0);
  const salePriceRaw = String(formData.get("salePrice") || "").trim();
  const salePrice = salePriceRaw ? Number(salePriceRaw) : null;
  if (!id) return;

  await db.plan.update({ where: { id }, data: { price, salePrice } });
  await audit(admin.id, "UPDATE_PRICE", "Plan", id, `price=${price}, sale=${salePrice}`);
  revalidatePath("/admin/ban-hang");
  revalidatePath("/bang-gia");
  revalidatePath("/");
}

export async function adminUpdateOrderStatusAction(formData: FormData) {
  const admin = await requireUser(ADMIN_ROLES);
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "PAID");
  if (!id) return;

  await db.order.update({
    where: { id },
    data: { status, ...(status === "PAID" ? { paidAt: new Date() } : {}) },
  });
  await audit(admin.id, "UPDATE_ORDER", "Order", id, status);
  revalidatePath("/admin/ban-hang");
}

/** 4. CRM & HỖ TRỢ */
export async function adminUpdateLeadStatusAction(formData: FormData) {
  const admin = await requireUser(ADMIN_ROLES);
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "CONTACTED");
  const note = String(formData.get("note") || "").trim();
  if (!id) return;

  await db.lead.update({ where: { id }, data: { status, note, assignee: admin.name } });
  revalidatePath("/admin/crm");
}

/** 5. WEBSITE CMS & BLOG */
export async function adminUpdateHeroAction(formData: FormData) {
  const admin = await requireUser(ADMIN_ROLES);
  const eyebrow = String(formData.get("eyebrow") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const subtitle = String(formData.get("subtitle") || "").trim();
  const hotline = String(formData.get("hotline") || "0900 000 000").trim();
  const address = String(formData.get("address") || "Long Xuyên, An Giang").trim();

  await saveSetting("hero", {
    eyebrow,
    title,
    subtitle,
    image: "/images/hero.jpg",
    ctaPrimary: "Học thử miễn phí",
    ctaSecondary: "Xem buổi học mẫu",
    videoUrl: "",
  });
  await saveSetting("company", {
    brand: "MEKONG English AI",
    name: "Công ty TNHH Công nghệ Mekong Green AI",
    taxCode: "0000000000",
    address,
    hotline,
    email: "hello@mekongenglish.ai",
    zalo: "https://zalo.me/0900000000",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
  });
  await audit(admin.id, "UPDATE", "SiteSetting", "hero", title);
  revalidatePath("/");
  revalidatePath("/admin/website");
}

export async function adminCreatePostAction(formData: FormData) {
  const admin = await requireUser(ADMIN_ROLES);
  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "Mẹo học");
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "").trim();
  if (!title || !content) return;

  await db.post.create({
    data: {
      slug: slugify(title) + "-" + Math.floor(Math.random() * 90 + 10),
      title,
      category,
      excerpt,
      content,
      cover: "/images/tra-su.jpg",
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });
  await audit(admin.id, "CREATE", "Post", null, title);
  revalidatePath("/blog");
  revalidatePath("/admin/website");
}

/** 6. ĐÁNH GIÁ THÍ ĐIỂM: Chấm điểm nói độc lập (Blind Pre/Post) */
export async function adminSaveBlindAssessmentAction(formData: FormData) {
  const admin = await requireUser(ADMIN_ROLES);
  const id = String(formData.get("id") || "");
  const score = Number(formData.get("score") || 7);
  const raterName = String(formData.get("raterName") || admin.name);
  if (!id) return;

  await db.assessment.update({
    where: { id },
    data: { score, raterName, blind: true },
  });
  revalidatePath("/admin/ai-thi-diem");
}
