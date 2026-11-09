import Link from "next/link";
import {
  Sparkles,
  PlayCircle,
  CheckCircle2,
  Mic,
  WifiOff,
  Compass,
  Sliders,
  MessageSquareHeart,
  Video,
  School,
  QrCode,
  Star,
  ArrowRight,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { formatVnd, PACKAGE_LABELS, parseJson } from "@/lib/utils";
import { SpeakingPracticeWidget } from "@/components/SpeakingPracticeWidget";
import { LeadForm } from "@/components/LeadForm";

export default async function HomePage() {
  const [settings, courses, traSuScenario, tutors, plans, testimonials, faqs, videos] = await Promise.all([
    getSettings(),
    db.course.findMany({
      where: { status: "PUBLISHED" },
      include: { chapters: { include: { lessons: true } } },
      orderBy: { order: "asc" },
    }),
    db.scenario.findUnique({ where: { slug: "gioi-thieu-tra-su" } }),
    db.tutor.findMany({ where: { status: "APPROVED" }, include: { slots: { where: { status: "OPEN" }, take: 3 } } }),
    db.plan.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    db.testimonial.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    db.faq.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    db.video.findMany({ take: 4, orderBy: { views: "desc" } }),
  ]);

  const demoScenario = traSuScenario
    ? {
        slug: traSuScenario.slug,
        title: traSuScenario.title,
        titleVi: traSuScenario.titleVi,
        topic: traSuScenario.topic,
        image: traSuScenario.image,
        goalVi: traSuScenario.goalVi,
        contextVi: traSuScenario.contextVi,
        aiOpening: traSuScenario.aiOpening,
        keywords: parseJson<string[]>(traSuScenario.keywordsJson, []),
        frames: parseJson<string[]>(traSuScenario.framesJson, []),
        hints: parseJson<string[]>(traSuScenario.hintsJson, []),
        followUps: parseJson<string[]>(traSuScenario.followUpsJson, []),
        modelAnswer: traSuScenario.modelAnswer,
      }
    : null;

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="bg-mekong-soft border-b border-slate-200/70 py-12 md:py-20">
        <div className="container grid items-center gap-10 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-7">
            <span className="eyebrow">
              🌱 {settings.hero.eyebrow} · Công ty TNHH Công nghệ Mekong Green AI
            </span>
            <h1 className="text-3xl font-extrabold leading-tight md:text-5xl text-balance">
              {settings.hero.title}
            </h1>
            <p className="text-base text-slate-600 md:text-lg">{settings.hero.subtitle}</p>

            <div className="rounded-2xl border border-brand-200 bg-white/90 p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-brand-700">
                Định vị sản phẩm rõ ràng:
              </div>
              <p className="mt-1 text-base font-bold text-ink">
                “Mỗi ngày 15 phút, học điều gần gũi, luyện nói có hướng dẫn và nhìn thấy tiến bộ.”
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Thông điệp: <b>{settings.slogan}</b> · Trọng tâm THCS lớp 6–7 tại tỉnh An Giang, mở rộng sang sinh viên & nhân sự du lịch – dịch vụ.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/hoc" className="btn btn-lg btn-primary">
                <Sparkles className="h-5 w-5" /> Vào học buổi 15 phút ngay
              </Link>
              <a href="#demo-tra-su" className="btn btn-lg btn-outline">
                <Mic className="h-5 w-5 text-brand-600" /> Thử luyện nói bài “Rừng tràm Trà Sư”
              </a>
              <Link href="/vao-lop" className="btn btn-lg btn-secondary">
                <QrCode className="h-5 w-5" /> Nhập mã lớp / QR
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-brand-600" /> Không cần tự viết câu lệnh cho AI
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-brand-600" /> Học được cả khi mạng yếu & tại phòng máy
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-brand-600" /> Có Video bài giảng + Phiên luyện nói trực tiếp với GV
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-lg overflow-hidden rounded-3xl border-4 border-white shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.hero.image || "/images/hero.jpg"}
                alt="Học sinh An Giang luyện nói tiếng Anh cùng MEKONG English AI"
                className="aspect-[16/11] w-full object-cover"
              />
              <div className="bg-white p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>📱 Màn hình chính chỉ 4 mục đơn giản:</span>
                  <span className="badge badge-green">Dễ dùng ngay lần đầu</span>
                </div>
                <div className="mt-2.5 grid grid-cols-4 gap-1.5 text-center text-xs font-bold">
                  <Link href="/hoc" className="rounded-xl bg-brand-50 p-2 text-brand-800 hover:bg-brand-100">
                    1. Học hôm nay
                  </Link>
                  <Link href="/hoc/luyen-noi" className="rounded-xl bg-brand-50 p-2 text-brand-800 hover:bg-brand-100">
                    2. Luyện nói
                  </Link>
                  <Link href="/hoc/nhiem-vu" className="rounded-xl bg-brand-50 p-2 text-brand-800 hover:bg-brand-100">
                    3. Nhiệm vụ
                  </Link>
                  <Link href="/hoc/tien-bo" className="rounded-xl bg-brand-50 p-2 text-brand-800 hover:bg-brand-100">
                    4. Tiến bộ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DẢI SỐ LIỆU */}
      {settings.stats.show && (
        <section className="border-b border-slate-200 bg-white py-8">
          <div className="container grid grid-cols-2 gap-6 md:grid-cols-4">
            {settings.stats.items.map((st, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-extrabold text-brand-600 md:text-4xl">{st.value}</div>
                <div className="mt-1 text-sm font-medium text-slate-600">{st.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. BUỔI HỌC 15 PHÚT HOẠT ĐỘNG THẾ NÀO */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center">
            <span className="eyebrow">⏱️ Thiết kế sư phạm rõ ràng</span>
            <h2 className="section-title">Một buổi học 15 phút diễn ra như thế nào?</h2>
            <p className="section-sub mx-auto">
              Người học mở ứng dụng lên là biết ngay cần làm gì – không phải tự nghĩ câu lệnh cho AI.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {[
              {
                min: "2 phút",
                step: "Bước 1 · Ôn lại",
                desc: "Trả lời vài câu hoặc nói lại từ, mẫu câu còn yếu từ buổi trước.",
                color: "bg-brand-50 text-brand-800",
              },
              {
                min: "3 phút",
                step: "Bước 2 · Xem & nghe",
                desc: "Học qua một hình ảnh địa phương hoặc đoạn video hội thoại ngắn, có nút nghe chậm & phụ đề.",
                color: "bg-teal-500/10 text-teal-700",
              },
              {
                min: "6 phút",
                step: "Bước 3 · Luyện nói với AI",
                desc: "Thực hiện nhiệm vụ nói có gợi ý phù hợp trình độ (khung câu → từ khoá → tự nhiên).",
                color: "bg-rice-100 text-amber-900",
              },
              {
                min: "3 phút",
                step: "Bước 4 · Sửa lỗi & nói lại",
                desc: "Nghe mẫu chuẩn, xem giải thích ngắn bằng tiếng Việt (ưu tiên 1–2 lỗi) và nói lại.",
                color: "bg-orange-50 text-silt-600",
              },
              {
                min: "1 phút",
                step: "Bước 5 · Xem kết quả",
                desc: "Biết rõ hôm nay mình vừa làm được gì và ngày mai cần luyện thêm điểm nào.",
                color: "bg-sky-50 text-sky-800",
              },
            ].map((b, i) => (
              <div key={i} className="card card-hover flex flex-col justify-between p-5">
                <div>
                  <span className={`badge ${b.color}`}>{b.min}</span>
                  <h3 className="mt-3 text-base font-extrabold">{b.step}</h3>
                  <p className="mt-1.5 text-sm text-slate-600">{b.desc}</p>
                </div>
                <div className="mt-4 text-xs font-bold text-brand-700">Bước {i + 1}/5 →</div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/hoc" className="btn btn-primary btn-lg">
              <Clock className="h-5 w-5" /> Trải nghiệm buổi học 15 phút mẫu
            </Link>
          </div>
        </div>
      </section>

      {/* 4. 5 ĐIỂM KHÁC BIỆT ĐÁNG ĐẦU TƯ */}
      <section className="section border-y border-slate-200/70 bg-surface">
        <div className="container">
          <div className="max-w-3xl">
            <span className="eyebrow">💡 Giá trị khác biệt so với các app gia sư AI đại trà</span>
            <h2 className="section-title">5 điểm khác biệt của MEKONG English AI</h2>
            <p className="section-sub">
              Chỉ có app và chatbot AI thì chưa đủ tạo khác biệt. MEKONG English AI xây dựng giá trị riêng từ học liệu địa phương An Giang, cơ chế thích ứng sư phạm, khả năng tiếp cận khi mạng yếu và hiệu quả đo lường được.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Compass,
                title: "1. Học tiếng Anh từ những điều quen thuộc",
                how: "Bài học bằng hình ảnh, câu chuyện và tình huống về trường học, chợ nổi, món ăn, nông sản, điểm du lịch An Giang (Trà Sư, Núi Sam, Châu Đốc, Hà Tiên, Phú Quốc); nội dung do giáo viên thẩm định.",
                value: "Dễ hiểu tình huống, có điều để nói, thấy rõ mục đích học.",
              },
              {
                icon: Sliders,
                title: "2. AI điều chỉnh mức trợ giúp khi gặp khó",
                how: "Ban đầu cho nghe mẫu, từ gợi ý và khung câu (Mức 1); khi làm tốt thì giảm dần trợ giúp (Mức 2) và chuyển sang hội thoại tự nhiên (Mức 3).",
                value: "Người yếu có thể bắt đầu ngay; người khá không phải học lại nội dung quá dễ.",
              },
              {
                icon: MessageSquareHeart,
                title: "3. Luyện nói hướng đến giao tiếp hiểu được",
                how: "Phản hồi về ý nghĩa, độ rõ, từ vựng và cấu trúc; mỗi lượt chỉ ưu tiên sửa 1–2 lỗi quan trọng; phù hợp học sinh địa phương.",
                value: "Tránh quá tải và giảm hẳn tâm lý sợ nói sai.",
              },
              {
                icon: WifiOff,
                title: "4. Học được khi kết nối không ổn định",
                how: "Tải trước bài nghe, hình ảnh và bài tập; lưu bài nói trên thiết bị để tự gửi khi có mạng; hỗ trợ cả phiên bản Web tại phòng máy trường học.",
                value: "Giảm phụ thuộc vào mạng mạnh và thiết bị đắt tiền.",
              },
              {
                icon: Mic,
                title: "5. Biến bài học thành nhiệm vụ thực tế",
                how: "Sau mỗi chủ đề, học sinh ghi âm giới thiệu một địa điểm gần nhà, hỏi đường, trình bày sản phẩm hoặc hội thoại với bạn trong tình huống mới.",
                value: "Đánh giá được khả năng vận dụng thật ngoài bài tập mẫu trên app.",
              },
              {
                icon: Video,
                title: "+ Kết hợp Video bài giảng & Giáo viên thật (Live)",
                how: "Kho video bài giảng chuẩn hoá xem lại nhiều lần kèm bài tập tương tác; khi cần bứt phá phản xạ có thể đặt lịch luyện nói trực tiếp 1-1 / nhóm nhỏ với giáo viên.",
                value: "Tiết kiệm chi phí học tập mà vẫn có người thật đồng hành.",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="card card-hover flex flex-col justify-between p-6">
                  <div>
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-extrabold">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{item.how}</p>
                  </div>
                  <div className="mt-4 rounded-xl bg-rice-50 p-3 text-xs font-semibold text-amber-900">
                    🎯 Giá trị với người học: {item.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. DEMO TƯƠNG TÁC BÀI HỌC ĐỊA PHƯƠNG: GIỚI THIỆU RỪNG TRÀM TRÀ SƯ */}
      {demoScenario && (
        <section id="demo-tra-su" className="section bg-white">
          <div className="container space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow">🌿 Bài học mẫu mang bản sắc An Giang</span>
                <h2 className="section-title">Thử ngay: “Giới thiệu Rừng tràm Trà Sư cho bạn nước ngoài”</h2>
                <p className="section-sub">
                  Bấm chọn <b>Mức 1 – Mức 2 – Mức 3</b> hoặc <b>Bước vận dụng mới</b> để xem cách Gia sư AI điều chỉnh mức trợ giúp và sửa 1–2 lỗi bằng tiếng Việt.
                </p>
              </div>
              <Link href="/hoc/luyen-noi" className="btn btn-outline">
                Xem trọn bộ 30 tình huống giao tiếp <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <SpeakingPracticeWidget scenario={demoScenario} />
          </div>
        </section>
      )}

      {/* 6. BA GÓI SẢN PHẨM DÙNG CHUNG MỘT NỀN TẢNG */}
      <section className="section border-t border-slate-200/70 bg-surface">
        <div className="container">
          <div className="text-center">
            <span className="eyebrow">📦 Phạm vi sản phẩm</span>
            <h2 className="section-title">3 gói sản phẩm trên cùng một nền tảng</h2>
            <p className="section-sub mx-auto">
              Tập trung nguồn lực vào học sinh THCS lớp 6–7 trước mắt, đồng thời sẵn sàng mở rộng sang du lịch – dịch vụ và cộng đồng.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                pkg: "English School",
                badge: "Ưu tiên phát triển đầu tiên",
                badgeClass: "badge-green",
                who: "Học sinh THCS, trước mắt lớp 6–7",
                value: "Củng cố kiến thức trên lớp; tăng thời gian nghe, nói; giáo viên theo dõi được qua cổng quản lý gọn.",
                img: "/images/classroom.jpg",
                href: "/english-school",
              },
              {
                pkg: "English Career",
                badge: "Mở rộng sau thí điểm",
                badgeClass: "badge-gold",
                who: "Sinh viên, người làm du lịch, nhà hàng, lưu trú, bán hàng",
                value: "Luyện các tình huống cần dùng ngay trong công việc kết nối Phú Quốc – Hà Tiên – Châu Đốc & giới thiệu sản phẩm OCOP.",
                img: "/images/career.jpg",
                href: "/english-career",
              },
              {
                pkg: "English Community",
                badge: "Triển khai khi có đơn vị đặt hàng",
                badgeClass: "badge-blue",
                who: "Người mới bắt đầu, người học lại tiếng Anh",
                value: "Hướng dẫn hoàn toàn bằng tiếng Việt; bài học ngắn 5–10 phút; thao tác đơn giản cho mọi lứa tuổi.",
                img: "/images/cho-noi.jpg",
                href: "/english-community",
              },
            ].map((p) => (
              <div key={p.pkg} className="card card-hover flex flex-col overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.pkg} className="h-48 w-full object-cover" />
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <span className={`badge ${p.badgeClass}`}>{p.badge}</span>
                    <h3 className="mt-3 text-xl font-extrabold">{p.pkg}</h3>
                    <p className="mt-1 text-xs font-semibold text-brand-700">👤 Người học: {p.who}</p>
                    <p className="mt-2 text-sm text-slate-600">{p.value}</p>
                  </div>
                  <Link href={p.href} className="btn btn-outline mt-6 w-full">
                    Khám phá gói {p.pkg} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. THƯ VIỆN KHOÁ HỌC & VIDEO BÀI GIẢNG QUAY SẴN */}
      <section className="section bg-white">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">🎬 Học qua Video bài giảng + Bài tập tương tác</span>
              <h2 className="section-title">Khoá học & Video bài giảng theo chương trình</h2>
              <p className="section-sub">
                Video bài giảng quay sẵn chất lượng cao, có phụ đề song ngữ Anh – Việt, điều chỉnh tốc độ chậm và làm bài tập kiểm tra ngay bên dưới video.
              </p>
            </div>
            <Link href="/khoa-hoc" className="btn btn-primary">
              Xem tất cả khoá học & video <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {courses.map((c) => {
              const lessonCount = c.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
              return (
                <div key={c.id} className="card card-hover flex flex-col overflow-hidden">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.coverImage || "/images/classroom.jpg"}
                      alt={c.title}
                      className="h-44 w-full object-cover"
                    />
                    <span className="badge badge-green absolute left-3 top-3">
                      {PACKAGE_LABELS[c.package] || c.package}
                    </span>
                    {c.isFree && (
                      <span className="badge bg-rice-500 text-ink absolute right-3 top-3">Miễn phí</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="text-xs font-semibold text-slate-500">
                        {c.levelLabel} · {c.chapters.length} chương · {lessonCount} bài học
                      </div>
                      <h3 className="mt-1 text-base font-extrabold leading-snug">{c.title}</h3>
                      <p className="mt-1.5 line-clamp-2 text-xs text-slate-600">{c.subtitle}</p>
                    </div>
                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <div className="flex items-center justify-between">
                        <div>
                          {c.isFree ? (
                            <span className="text-base font-extrabold text-brand-700">Miễn phí</span>
                          ) : (
                            <>
                              <span className="text-base font-extrabold text-brand-700">
                                {formatVnd(c.salePrice ?? c.price)}
                              </span>
                              {c.salePrice && (
                                <span className="ml-1.5 text-xs text-slate-400 line-through">
                                  {formatVnd(c.price)}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        <Link href={`/khoa-hoc/${c.slug}`} className="btn btn-sm btn-secondary">
                          Vào học
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dải video bài giảng nổi bật */}
          <div className="mt-10 rounded-2xl bg-slate-50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-extrabold">📺 Video bài giảng mẫu (Học thử miễn phí)</h3>
              <span className="text-xs text-slate-500">Có phụ đề song ngữ EN/VI & bài tập đi kèm</span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {videos.map((v) => (
                <Link
                  key={v.id}
                  href="/hoc"
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 hover:border-brand-500"
                >
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.thumbnail || "/images/tra-su.jpg"} alt={v.title} className="h-full w-full object-cover" />
                    <span className="absolute inset-0 grid place-items-center bg-black/30 text-white">
                      <PlayCircle className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold group-hover:text-brand-700">{v.title}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{v.views} lượt xem · Phụ đề EN/VI</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. LUYỆN NÓI TRỰC TIẾP VỚI GIÁO VIÊN (LIVE SPEAKING – TRẢ PHÍ THÊM) */}
      <section className="section bg-brand-900 text-white">
        <div className="container grid items-center gap-10 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-6">
            <span className="badge bg-rice-500 text-ink">✨ Tính năng trả phí thêm (Add-on)</span>
            <h2 className="text-2xl font-extrabold text-white md:text-4xl">
              Phiên luyện nói trực tiếp với Giáo viên (Live Speaking 1-1 & Nhóm nhỏ)
            </h2>
            <p className="text-white/80">
              Bên cạnh video bài giảng quay sẵn và Gia sư AI 24/7, học viên có thể đăng ký thêm các phiên <b>25 phút trực tiếp với giáo viên</b> để rèn phản xạ thực chiến, chỉnh phát âm chuyên sâu và chuẩn bị thi nói.
            </p>
            <ul className="space-y-2 text-sm text-white/90">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-rice-400" />
                Chọn lịch linh hoạt (1-1 hoặc nhóm 3–5 học viên cùng trình độ)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-rice-400" />
                Giáo viên nắm trước dữ liệu lỗi phát âm/ngữ pháp em vừa luyện với AI
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-rice-400" />
                Nhận phiếu nhận xét chi tiết & bài luyện gợi ý ngay sau buổi học
              </li>
            </ul>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/luyen-noi-truc-tiep" className="btn btn-lg btn-accent">
                Xem lịch trống & Đặt buổi Live
              </Link>
              <Link href="/bang-gia" className="btn btn-lg border border-white/30 bg-white/10 text-white hover:bg-white/20">
                Xem gói 4 buổi / 12 buổi
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-6">
            {tutors.map((t) => (
              <div key={t.id} className="rounded-2xl bg-white p-4 text-ink shadow-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.avatar || "/images/live-tutor.jpg"} alt={t.name} className="h-36 w-full rounded-xl object-cover" />
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-amber-600 font-bold">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400" /> {t.rating} ({t.ratingCount})
                    </span>
                    <span>{formatVnd(t.pricePerSession)}/25&apos;</span>
                  </div>
                  <h3 className="mt-1 font-extrabold">{t.name}</h3>
                  <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">{t.headline}</p>
                  <Link href={`/giao-vien/${t.slug}`} className="btn btn-sm btn-primary mt-3 w-full">
                    Xem lịch ({t.slots.length} ca trống)
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9 & 10. DÀNH CHO GIÁO VIÊN TRƯỜNG HỌC & PHỤ HUYNH */}
      <section className="section bg-white">
        <div className="container grid gap-8 lg:grid-cols-2">
          {/* Cổng Giáo viên trường */}
          <div className="card flex flex-col justify-between p-6 md:p-8">
            <div className="space-y-4">
              <span className="badge badge-green">👩‍🏫 Cổng Giáo viên thật gọn</span>
              <h3 className="text-2xl font-extrabold">
                Giáo viên chọn chủ đề, giao bài và xem ngay 3 thông tin quan trọng nhất
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-red-50 p-3 text-xs">
                  <b className="block text-red-800">1. Ai chưa tham gia</b>
                  <span className="text-slate-600">Danh sách học sinh chưa hoàn thành buổi học trong tuần.</span>
                </div>
                <div className="rounded-xl bg-amber-50 p-3 text-xs">
                  <b className="block text-amber-900">2. Nhóm gặp lỗi gì</b>
                  <span className="text-slate-600">Thống kê lỗi phát âm/cấu trúc cả lớp hay mắc nhất.</span>
                </div>
                <div className="rounded-xl bg-sky-50 p-3 text-xs">
                  <b className="block text-sky-900">3. Ai cần hỗ trợ thêm</b>
                  <span className="text-slate-600">Cảnh báo sớm học sinh đang kẹt ở mức trợ giúp 1.</span>
                </div>
              </div>
              <p className="text-sm text-slate-600">
                Hệ thống tự đề xuất hoạt động luyện tập cho tiết học tiếp theo; giáo viên có toàn quyền sửa phản hồi của AI và điều chỉnh bài học.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/lop-hoc" className="btn btn-primary">
                Mở thử Cổng Giáo viên
              </Link>
              <Link href="/nha-truong" className="btn btn-outline">
                Đăng ký thí điểm cho Trường (12 tuần)
              </Link>
            </div>
          </div>

          {/* Báo cáo Phụ huynh & Bảo vệ dữ liệu trẻ em */}
          <div className="card flex flex-col justify-between p-6 md:p-8">
            <div className="space-y-4">
              <span className="badge badge-gold">👨‍👩‍👧 Báo cáo tuần cho Phụ huynh</span>
              <h3 className="text-2xl font-extrabold">
                Phụ huynh không rành tiếng Anh vẫn nắm rõ tiến bộ của con mỗi tuần
              </h3>
              <div className="rounded-2xl border border-brand-200 bg-brand-50/70 p-4 text-sm">
                <div className="text-xs font-bold uppercase text-brand-700">📩 Mẫu tin nhắn báo cáo tuần:</div>
                <p className="mt-1 font-semibold text-ink">
                  “Tuần này con Lâm Gia Bảo đã luyện 4 buổi (62 phút), đã có thể tự giới thiệu bản thân và Rừng tràm Trà Sư; tuần tới con cần luyện thêm cách đặt câu hỏi Wh-.”
                </p>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600">
                <ShieldCheck className="h-5 w-5 shrink-0 text-brand-600" />
                <span>
                  <b>Bảo vệ dữ liệu giọng nói trẻ em (Nghị định 13/2023/NĐ-CP):</b> Giới hạn chủ đề hội thoại theo bài học; bản ghi âm chỉ thu thập khi phụ huynh đồng ý, có phân quyền và thời hạn lưu trữ rõ ràng.
                </span>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/phu-huynh" className="btn btn-primary">
                Mở thử Cổng Phụ huynh
              </Link>
              <Link href="/chinh-sach-bao-mat" className="btn btn-outline">
                Xem cơ chế bảo vệ dữ liệu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 12. CẢM NHẬN NGƯỜI HỌC, PHỤ HUYNH & GIÁO VIÊN */}
      <section className="section border-t border-slate-200/70 bg-surface">
        <div className="container">
          <div className="text-center">
            <span className="eyebrow">💬 Phản hồi thực tế</span>
            <h2 className="section-title">Chia sẻ từ Giáo viên, Phụ huynh & Học viên</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((item) => (
              <div key={item.id} className="card p-5">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="mt-3 text-sm text-slate-700">&ldquo;{item.content}&rdquo;</p>
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <div className="text-sm font-bold text-ink">{item.name}</div>
                  <div className="text-xs text-slate-500">{item.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. BẢNG GIÁ TÓM TẮT */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center">
            <span className="eyebrow">💳 Chi phí hợp lý – Dễ tiếp cận</span>
            <h2 className="section-title">Các gói học & Luyện nói trực tiếp</h2>
            <p className="section-sub mx-auto">
              Linh hoạt cho cá nhân tự học, phụ huynh mua thêm buổi Live với giáo viên, hoặc triển khai theo trường/doanh nghiệp.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.slice(0, 4).map((p) => {
              const feats = parseJson<string[]>(p.featuresJson, []);
              return (
                <div
                  key={p.id}
                  className={`card flex flex-col justify-between p-6 ${
                    p.isFeatured ? "border-2 border-brand-600 ring-4 ring-brand-500/10" : ""
                  }`}
                >
                  <div>
                    {p.isFeatured && <span className="badge badge-green mb-2">Được chọn nhiều nhất</span>}
                    <h3 className="text-lg font-extrabold">{p.name}</h3>
                    <p className="mt-1 text-xs text-slate-500">{p.description}</p>
                    <div className="mt-4">
                      <span className="text-2xl font-extrabold text-brand-700">
                        {p.price === 0 ? "Miễn phí" : formatVnd(p.salePrice ?? p.price)}
                      </span>
                      {p.salePrice && (
                        <span className="ml-2 text-xs text-slate-400 line-through">{formatVnd(p.price)}</span>
                      )}
                    </div>
                    <ul className="mt-4 space-y-2 text-xs text-slate-700">
                      {feats.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href={p.price === 0 ? "/dang-ky" : `/thanh-toan/${p.code}`}
                    className={`btn mt-6 w-full ${p.isFeatured ? "btn-primary" : "btn-outline"}`}
                  >
                    {p.price === 0 ? "Bắt đầu miễn phí" : "Đăng ký gói này"}
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <Link href="/bang-gia" className="text-sm font-bold text-brand-700 hover:underline">
              Xem đầy đủ bảng giá, gói buổi Live Speaking và gói License cho Trường học →
            </Link>
          </div>
        </div>
      </section>

      {/* 14 & 15. CÂU HỎI THƯỜNG GẶP & FORM ĐĂNG KÝ TƯ VẤN */}
      <section className="section border-t border-slate-200/70 bg-mekong-soft">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-6">
            <span className="eyebrow">❓ Giải đáp nhanh</span>
            <h2 className="text-2xl font-extrabold md:text-3xl">Câu hỏi thường gặp</h2>
            <div className="space-y-3">
              {faqs.map((f) => (
                <details key={f.id} className="card group p-4">
                  <summary className="cursor-pointer list-none font-bold text-ink flex items-center justify-between">
                    <span>{f.question}</span>
                    <span className="text-brand-600 group-open:rotate-45 transition">+</span>
                  </summary>
                  <p className="mt-2 text-sm text-slate-600">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <LeadForm />
          </div>
        </div>
      </section>
    </div>
  );
}
