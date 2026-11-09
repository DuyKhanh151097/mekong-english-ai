/** Tiện ích dùng chung */

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Định dạng tiền VND: 199000 -> "199.000đ" */
export function formatVnd(n: number | null | undefined) {
  if (n == null) return "";
  return new Intl.NumberFormat("vi-VN").format(n) + "đ";
}

export function formatDate(d: Date | string | null | undefined, withTime = false) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);
}

export function formatTime(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" }).format(date);
}

/** Parse chuỗi JSON an toàn */
export function parseJson<T>(s: string | null | undefined, fallback: T): T {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

/** Chuyển tiếng Việt có dấu thành slug không dấu */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Sinh mã ngẫu nhiên (mã lớp, mã đơn hàng) – bỏ ký tự dễ nhầm */
export function randomCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export const PACKAGE_LABELS: Record<string, string> = {
  SCHOOL: "English School",
  CAREER: "English Career",
  COMMUNITY: "English Community",
};

export const ROLE_LABELS: Record<string, string> = {
  STUDENT: "Học viên",
  PARENT: "Phụ huynh",
  TEACHER: "Giáo viên trường",
  TUTOR: "Giáo viên Live",
  SCHOOL_ADMIN: "Quản trị trường",
  EDITOR: "Biên tập học liệu",
  SALES: "Kinh doanh / CSKH",
  ADMIN: "Quản trị hệ thống",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  CANCELLED: "Đã huỷ",
  REFUNDED: "Đã hoàn tiền",
};

export const LEAD_STATUS_LABELS: Record<string, string> = {
  NEW: "Mới",
  CONTACTED: "Đã liên hệ",
  TRIAL: "Hẹn học thử",
  WON: "Đã chốt",
  LOST: "Huỷ",
};

export const LESSON_TYPE_LABELS: Record<string, string> = {
  DAILY: "Buổi học 15 phút",
  VIDEO: "Video bài giảng",
  EXERCISE: "Bài tập",
  SPEAKING: "Luyện nói AI",
  TASK: "Nhiệm vụ thực tế",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  VIETQR: "Chuyển khoản VietQR",
  VNPAY: "VNPay",
  MOMO: "Ví MoMo",
  ZALOPAY: "ZaloPay",
};
