"use client";

import { useActionState } from "react";
import { submitLeadAction } from "@/lib/public-actions";
import { FormMessage, SubmitButton } from "@/components/SubmitButton";

export function LeadForm({
  source = "HOME_FORM",
  defaultRole = "PARENT",
  title = "Đăng ký học thử miễn phí / Nhận tư vấn lộ trình",
  subtitle = "Để lại thông tin, đội ngũ MEKONG English AI sẽ gửi tài khoản học thử và tư vấn qua Zalo/SĐT trong 24 giờ.",
}: {
  source?: string;
  defaultRole?: string;
  title?: string;
  subtitle?: string;
}) {
  const [state, action] = useActionState(submitLeadAction, undefined);

  return (
    <form action={action} className="card space-y-4 p-6 md:p-8">
      <div>
        <h3 className="text-xl font-extrabold text-ink">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>
      <FormMessage state={state} />
      <input type="hidden" name="source" value={source} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="lead-name">Họ và tên *</label>
          <input id="lead-name" name="name" className="input" required placeholder="Nguyễn Văn A" />
        </div>
        <div>
          <label className="label" htmlFor="lead-phone">Số điện thoại / Zalo *</label>
          <input id="lead-phone" name="phone" className="input" required placeholder="0901234567" />
        </div>
        <div>
          <label className="label" htmlFor="lead-role">Bạn là</label>
          <select id="lead-role" name="role" className="select" defaultValue={defaultRole}>
            <option value="PARENT">Phụ huynh</option>
            <option value="STUDENT">Học sinh / Sinh viên</option>
            <option value="TEACHER">Giáo viên</option>
            <option value="SCHOOL">Đại diện Nhà trường / Phòng GD</option>
            <option value="COMPANY">Doanh nghiệp du lịch / dịch vụ</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="lead-grade">Khối lớp / Nhu cầu</label>
          <select id="lead-grade" name="grade" className="select" defaultValue="6">
            <option value="6">Học sinh lớp 6</option>
            <option value="7">Học sinh lớp 7</option>
            <option value="8-9">Học sinh lớp 8–9</option>
            <option value="CAREER">English Career (Du lịch – dịch vụ)</option>
            <option value="COMMUNITY">English Community (Mới bắt đầu)</option>
            <option value="PILOT">Thí điểm cấp Trường THCS</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="lead-province">Tỉnh / Thành phố</label>
          <input id="lead-province" name="province" className="input" defaultValue="An Giang" />
        </div>
        <div>
          <label className="label" htmlFor="lead-org">Trường / Đơn vị (nếu có)</label>
          <input id="lead-org" name="orgName" className="input" placeholder="VD: THCS Mỹ Hoà Hưng" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="lead-msg">Ghi chú thêm</label>
        <input
          id="lead-msg"
          name="message"
          className="input"
          placeholder="VD: Con còn ngại nói tiếng Anh, muốn học thử gói AI + Live Speaking..."
        />
      </div>
      <SubmitButton className="btn-lg w-full" pendingText="Đang gửi đăng ký...">
        Gửi đăng ký ngay
      </SubmitButton>
    </form>
  );
}
