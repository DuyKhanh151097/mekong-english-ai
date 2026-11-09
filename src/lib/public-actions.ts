"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import { getCurrentUser } from "./auth";
import { homeForRole, SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "./session";
import { randomCode } from "./utils";
import type { FormState } from "./auth-actions";

/** Chuyển nhanh tài khoản demo (1-click trên thanh DemoBar để kiểm thử các vai trò) */
export async function quickSwitchAccountAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email) return;
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return;
  const token = await signSession({ uid: user.id, role: user.role, name: user.name }, SESSION_MAX_AGE);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect(homeForRole(user.role));
}

/** Lưu form đăng ký tư vấn / học thử / thí điểm trường học */
export async function submitLeadAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim() || null;
  const role = String(formData.get("role") || "PARENT");
  const grade = String(formData.get("grade") || "").trim() || null;
  const province = String(formData.get("province") || "An Giang").trim();
  const orgName = String(formData.get("orgName") || "").trim() || null;
  const message = String(formData.get("message") || "").trim() || null;
  const source = String(formData.get("source") || "HOME_FORM");

  if (name.length < 2) return { error: "Vui lòng nhập họ và tên." };
  if (phone.length < 8) return { error: "Vui lòng nhập số điện thoại hợp lệ." };

  await db.lead.create({
    data: { name, phone, email, role, grade, province, orgName, message, source, status: "NEW" },
  });
  revalidatePath("/admin/crm");
  return {
    ok: "Đã gửi đăng ký thành công! Đội ngũ MEKONG English AI sẽ liên hệ qua Zalo/SĐT của bạn trong 24 giờ.",
  };
}

/** Tạo đơn hàng mua gói học hoặc gói buổi Live Speaking */
export async function createOrderAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const planId = String(formData.get("planId") || "");
  const customerName = String(formData.get("customerName") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim() || null;
  const method = String(formData.get("method") || "VIETQR");
  const couponCode = String(formData.get("couponCode") || "").trim().toUpperCase() || null;

  if (!planId) return { error: "Không tìm thấy gói dịch vụ." };
  if (customerName.length < 2 || phone.length < 8) {
    return { error: "Vui lòng nhập đầy đủ họ tên và số điện thoại." };
  }

  const plan = await db.plan.findUnique({ where: { id: planId } });
  if (!plan) return { error: "Gói dịch vụ không tồn tại." };

  const baseAmount = plan.salePrice ?? plan.price;
  let discount = 0;
  if (couponCode) {
    const coupon = await db.coupon.findUnique({ where: { code: couponCode } });
    if (coupon && coupon.active && coupon.used < coupon.maxUses) {
      discount = coupon.percent > 0 ? Math.round((baseAmount * coupon.percent) / 100) : coupon.amount;
      await db.coupon.update({ where: { id: coupon.id }, data: { used: { increment: 1 } } });
    }
  }
  const total = Math.max(0, baseAmount - discount);
  const user = await getCurrentUser();

  const order = await db.order.create({
    data: {
      code: "MK" + randomCode(6),
      userId: user?.id ?? null,
      planId: plan.id,
      customerName,
      phone,
      email,
      amount: baseAmount,
      discount,
      total,
      couponCode,
      method,
      status: "PAID", // Tự động kích hoạt trong bản demo để trải nghiệm trọn luồng
      paidAt: new Date(),
    },
  });

  if (user) {
    if (plan.type === "LIVE_PACK" && plan.sessions > 0) {
      await db.user.update({
        where: { id: user.id },
        data: { liveCredits: { increment: plan.sessions } },
      });
    } else {
      const endAt = new Date(Date.now() + plan.durationDays * 86400000);
      await db.subscription.create({
        data: { userId: user.id, planId: plan.id, endAt, status: "ACTIVE" },
      });
      if (plan.tier === "AI") {
        await db.user.update({ where: { id: user.id }, data: { liveCredits: { increment: 1 } } });
      }
    }
  }

  revalidatePath("/admin/ban-hang");
  redirect(`/thanh-toan/thanh-cong?code=${order.code}`);
}

/** Đặt lịch học trực tiếp (Live Speaking) với giáo viên */
export async function bookLiveSlotAction(formData: FormData) {
  const slotId = String(formData.get("slotId") || "");
  const note = String(formData.get("note") || "").trim() || null;
  const user = await getCurrentUser();
  if (!user) redirect("/dang-nhap?next=/luyen-noi-truc-tiep");

  const slot = await db.tutorSlot.findUnique({
    where: { id: slotId },
    include: { bookings: true },
  });
  if (!slot || slot.status !== "OPEN") {
    redirect("/hoc/live?error=Khung+gio+da+het+cho");
  }

  if (user.liveCredits <= 0) {
    redirect("/bang-gia?highlight=LIVE_4");
  }

  await db.$transaction([
    db.booking.create({
      data: { slotId: slot.id, userId: user.id, status: "BOOKED", note },
    }),
    db.user.update({
      where: { id: user.id },
      data: { liveCredits: { decrement: 1 } },
    }),
    ...(slot.bookings.length + 1 >= slot.capacity
      ? [db.tutorSlot.update({ where: { id: slot.id }, data: { status: "FULL" } })]
      : []),
  ]);

  revalidatePath("/luyen-noi-truc-tiep");
  revalidatePath("/hoc/live");
  redirect("/hoc/live?booked=1");
}
