/* eslint-disable no-console */
/**
 * Dữ liệu mẫu cho MEKONG English AI.
 * Chạy: npm run db:seed  (hoặc npm run db:reset để xoá và tạo lại)
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();
const J = (v: unknown) => JSON.stringify(v);
const days = (n: number) => new Date(Date.now() + n * 86400000);

const SAMPLE_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
];

const IMAGES = ["/images/tra-su.jpg", "/images/cho-noi.jpg", "/images/nui-sam.jpg", "/images/food.jpg", "/images/classroom.jpg", "/images/career.jpg"];

type Vocab = { word: string; ipa: string; meaning: string; example: string };
type LessonSeed = {
  title: string;
  summary: string;
  type: string;
  free?: boolean;
  image?: string;
  vocab: Vocab[];
  sentences: { en: string; vi: string }[];
  dialogue?: { speaker: string; en: string; vi: string }[];
  tipVi?: string;
  scenarioSlug?: string;
  questions?: { type: string; prompt: string; options?: string[]; answer: string; explanation?: string; audioText?: string; skill?: string }[];
};
type ChapterSeed = { title: string; topic: string; lessons: LessonSeed[] };

async function main() {
  console.log("🌱 Xoá dữ liệu cũ...");
  // Xoá theo thứ tự phụ thuộc
  await db.$transaction([
    db.auditLog.deleteMany(), db.aiUsageLog.deleteMany(), db.assessment.deleteMany(), db.weeklyReport.deleteMany(),
    db.booking.deleteMany(), db.tutorSlot.deleteMany(), db.tutor.deleteMany(),
    db.order.deleteMany(), db.subscription.deleteMany(), db.plan.deleteMany(), db.coupon.deleteMany(),
    db.taskSubmission.deleteMany(), db.realTask.deleteMany(), db.assignment.deleteMany(),
    db.scenarioProgress.deleteMany(), db.speakingAttempt.deleteMany(), db.studySession.deleteMany(), db.lessonProgress.deleteMany(),
    db.question.deleteMany(), db.lesson.deleteMany(), db.chapter.deleteMany(), db.course.deleteMany(), db.scenario.deleteMany(), db.video.deleteMany(),
    db.classMember.deleteMany(), db.classroom.deleteMany(), db.consent.deleteMany(), db.parentLink.deleteMany(),
    db.user.deleteMany(), db.organization.deleteMany(),
    db.lead.deleteMany(), db.post.deleteMany(), db.testimonial.deleteMany(), db.faq.deleteMany(), db.siteSetting.deleteMany(), db.mediaAsset.deleteMany(),
  ]);

  // ─────────────── Tổ chức & người dùng ───────────────
  console.log("👤 Người dùng & trường...");
  const school1 = await db.organization.create({
    data: { name: "Trường THCS Mỹ Hoà Hưng", type: "SCHOOL", address: "Mỹ Hoà Hưng, Long Xuyên, An Giang", contactName: "Thầy Trần Văn Bình", contactPhone: "0296 3000 001", licenseSeats: 200, licenseExpiresAt: days(300), status: "ACTIVE" },
  });
  const school2 = await db.organization.create({
    data: { name: "Trường THCS Châu Phú A", type: "SCHOOL", address: "Châu Phú A, Châu Đốc, An Giang", contactName: "Cô Lê Thị Hạnh", contactPhone: "0296 3000 002", licenseSeats: 150, licenseExpiresAt: days(300), status: "TRIAL" },
  });
  await db.organization.create({
    data: { name: "Khách sạn Victoria Núi Sam (demo)", type: "COMPANY", address: "Châu Đốc, An Giang", contactName: "Phòng Nhân sự", licenseSeats: 30, status: "TRIAL" },
  });

  const pw = await bcrypt.hash("123456", 10);
  const admin = await db.user.create({ data: { name: "Quản trị viên", email: "admin@mekong.ai", role: "ADMIN", passwordHash: await bcrypt.hash("admin123", 10) } });
  await db.user.create({ data: { name: "Biên tập viên Ngọc", email: "editor@mekong.ai", role: "EDITOR", passwordHash: pw } });
  await db.user.create({ data: { name: "Tư vấn viên Phúc", email: "sales@mekong.ai", role: "SALES", passwordHash: pw } });
  const teacher = await db.user.create({ data: { name: "Cô Nguyễn Thị Mai", email: "giaovien@mekong.ai", phone: "0901000001", role: "TEACHER", organizationId: school1.id, passwordHash: pw } });
  const teacher2 = await db.user.create({ data: { name: "Thầy Phạm Quốc Huy", email: "giaovien2@mekong.ai", role: "TEACHER", organizationId: school2.id, passwordHash: pw } });
  await db.user.create({ data: { name: "Thầy Trần Văn Bình", email: "truong@mekong.ai", role: "SCHOOL_ADMIN", organizationId: school1.id, passwordHash: pw } });
  const parent = await db.user.create({ data: { name: "Chị Lâm Thị Thu", email: "phuhuynh@mekong.ai", phone: "0902000001", role: "PARENT", passwordHash: pw } });
  const tutorUser = await db.user.create({ data: { name: "Ms. Hoàng Anh", email: "tutor@mekong.ai", role: "TUTOR", passwordHash: pw } });

  const studentNames = [
    "Lâm Gia Bảo", "Nguyễn Minh Anh", "Trần Ngọc Hân", "Lê Hoàng Phúc", "Phạm Thanh Trúc", "Võ Đức Thịnh", "Huỳnh Bảo Ngọc", "Đặng Quốc Khánh",
    "Bùi Thảo Vy", "Ngô Tuấn Kiệt", "Dương Mỹ Duyên", "Châu Thành Đạt", "Tô Khánh Linh", "Lý Gia Huy", "Mai Phương Thảo", "Kim Sóc Ra",
    "Néang Sa Rết", "Trịnh Hữu Nghĩa", "Hồ Ngọc Như", "Quách Minh Tâm",
  ];
  const students = [];
  for (let i = 0; i < studentNames.length; i++) {
    const isDemo = i === 0;
    students.push(
      await db.user.create({
        data: {
          name: studentNames[i],
          email: isDemo ? "hocsinh@mekong.ai" : null,
          username: isDemo ? "hs6a01" : `hs${i < 10 ? "6a" : "6b"}${String(i + 1).padStart(2, "0")}`,
          role: "STUDENT",
          grade: 6,
          organizationId: i < 10 ? school1.id : school2.id,
          xp: Math.floor(Math.random() * 1500) + (isDemo ? 800 : 0),
          streak: isDemo ? 5 : Math.floor(Math.random() * 8),
          liveCredits: isDemo ? 2 : 0,
          lastActiveAt: i % 5 === 3 ? days(-9) : days(-Math.floor(Math.random() * 3)),
          passwordHash: pw,
        },
      })
    );
  }
  const demoStudent = students[0];
  // Học viên cá nhân (không thuộc trường)
  const indiv = await db.user.create({ data: { name: "Trương Quỳnh Như", email: "hocvien@mekong.ai", phone: "0903000001", role: "STUDENT", grade: 7, passwordHash: pw, xp: 320, streak: 2 } });

  await db.parentLink.create({ data: { parentId: parent.id, studentId: demoStudent.id } });
  await db.consent.create({ data: { studentId: demoStudent.id, grantedById: parent.id, type: "VOICE_RECORDING", granted: true, retentionDays: 180 } });

  const class6a = await db.classroom.create({ data: { name: "6A1 – THCS Mỹ Hoà Hưng", code: "AG6A01", grade: 6, organizationId: school1.id, teacherId: teacher.id, pilotGroup: "EXPERIMENT" } });
  const class6b = await db.classroom.create({ data: { name: "6B2 – THCS Châu Phú A", code: "AG6B02", grade: 6, organizationId: school2.id, teacherId: teacher2.id, pilotGroup: "CONTROL" } });
  for (let i = 0; i < students.length; i++) {
    await db.classMember.create({ data: { classroomId: i < 10 ? class6a.id : class6b.id, studentId: students[i].id } });
  }

  // ─────────────── Video ───────────────
  console.log("🎬 Video...");
  const vtt = (lines: string[]) =>
    "WEBVTT\n\n" + lines.map((l, i) => `00:00:${String(i * 3).padStart(2, "0")}.000 --> 00:00:${String(i * 3 + 3).padStart(2, "0")}.000\n${l}`).join("\n\n");

  async function makeVideo(title: string, idx: number, en: string[], vi: string[]) {
    return db.video.create({
      data: {
        title,
        url: SAMPLE_VIDEOS[idx % SAMPLE_VIDEOS.length],
        provider: "MP4",
        thumbnail: IMAGES[idx % IMAGES.length],
        durationSec: 15,
        subtitleEn: vtt(en),
        subtitleVi: vtt(vi),
        views: 120 + idx * 37,
        completions: 80 + idx * 21,
      },
    });
  }

  // ─────────────── Tình huống luyện nói AI ───────────────
  console.log("🗣️ Tình huống luyện nói...");
  const scenarioData = [
    {
      slug: "gioi-thieu-ban-than", title: "Introduce yourself", titleVi: "Giới thiệu bản thân", topic: "Trường học", image: "/images/classroom.jpg", grade: 6,
      goalVi: "Giới thiệu tên, tuổi, lớp, trường và một sở thích của em với bạn mới.",
      contextVi: "Ngày đầu năm học, em gặp một bạn mới chuyển đến lớp 6A1.",
      aiOpening: "Hi! I'm Linh, a new student. What's your name?",
      keywords: ["name", "years old", "grade 6", "school", "like"],
      frames: ["My name is ___.", "I am ___ years old.", "I am in grade ___ at ___ School.", "I like ___."],
      hints: ["name…", "age…", "class & school…", "hobby…"],
      followUps: ["What is your favourite subject? Why?", "How do you go to school?", "Who is your best friend?"],
      modelAnswer: "My name is Bao. I am eleven years old. I am in grade 6 at My Hoa Hung Secondary School. I like playing football.",
    },
    {
      slug: "gioi-thieu-tra-su", title: "Introduce Tra Su Cajeput Forest", titleVi: "Giới thiệu Rừng tràm Trà Sư", topic: "Du lịch An Giang", image: "/images/tra-su.jpg", grade: 6,
      goalVi: "Giới thiệu ngắn Rừng tràm Trà Sư cho một người bạn nước ngoài: nó ở đâu, có gì đẹp, có thể làm gì ở đó.",
      contextVi: "Bạn Tom đến từ Úc sắp đến An Giang và hỏi em nên đi đâu.",
      aiOpening: "Hello! I'm Tom from Australia. I'm visiting An Giang next week. Where should I go?",
      keywords: ["Tra Su", "cajeput forest", "An Giang", "boat", "birds", "beautiful", "green"],
      frames: ["You should visit ___.", "It is in ___ province.", "It has many ___ and ___.", "You can go by ___ and see ___."],
      hints: ["Tra Su…", "where…", "what you can see…", "what you can do…"],
      followUps: ["What can I do there?", "When is the best time to visit?", "How can I get there from Chau Doc?"],
      modelAnswer: "You should visit Tra Su Cajeput Forest. It is in An Giang province. It has many green trees and birds. You can go by boat and take photos.",
    },
    {
      slug: "hoi-duong-chau-doc", title: "Asking for directions in Chau Doc", titleVi: "Hỏi và chỉ đường ở Châu Đốc", topic: "Khu phố", image: "/images/nui-sam.jpg", grade: 6,
      goalVi: "Chỉ đường cho du khách từ chợ Châu Đốc đến Miếu Bà Chúa Xứ Núi Sam.",
      contextVi: "Một du khách hỏi em đường đến Núi Sam khi em đang ở gần chợ Châu Đốc.",
      aiOpening: "Excuse me, how can I get to Sam Mountain?",
      keywords: ["go straight", "turn left", "turn right", "next to", "opposite", "about ... minutes"],
      frames: ["Go straight along ___ Street.", "Turn ___ at the ___.", "It is next to / opposite the ___.", "It takes about ___ minutes."],
      hints: ["go straight…", "turn…", "landmark…", "how long…"],
      followUps: ["Is it far from here?", "Can I go by bike?", "Is there a good place to eat near there?"],
      modelAnswer: "Go straight along Tan Lo Kieu Luong Street. Turn left at the roundabout. Sam Mountain is about fifteen minutes by motorbike.",
    },
    {
      slug: "mua-hang-cho-noi", title: "Buying fruit at the floating market", titleVi: "Mua trái cây ở chợ nổi", topic: "Chợ & mua sắm", image: "/images/cho-noi.jpg", grade: 6,
      goalVi: "Hỏi giá, mặc cả nhẹ nhàng và mua trái cây ở chợ nổi.",
      contextVi: "Em đóng vai người bán trái cây trên ghe; AI là khách du lịch.",
      aiOpening: "Hi! These mangoes look great. How much are they?",
      keywords: ["how much", "kilo", "dong", "fresh", "sweet", "here you are"],
      frames: ["They are ___ dong a kilo.", "They are very ___ and ___.", "How many kilos do you want?", "Here you are. Thank you!"],
      hints: ["price…", "describe fruit…", "how many…", "thank…"],
      followUps: ["Can you make it cheaper?", "Do you have any other fruit?", "Where do these mangoes come from?"],
      modelAnswer: "They are thirty thousand dong a kilo. They are very fresh and sweet. How many kilos do you want?",
    },
    {
      slug: "gioi-thieu-mon-an", title: "Talking about local food", titleVi: "Giới thiệu món ăn An Giang", topic: "Món ăn", image: "/images/food.jpg", grade: 7,
      goalVi: "Giới thiệu một món ăn đặc sản An Giang (bánh xèo, bún cá, mắm Châu Đốc, đường thốt nốt): tên, nguyên liệu, mùi vị.",
      contextVi: "Bạn Emma muốn thử món ăn địa phương và hỏi ý kiến em.",
      aiOpening: "I love trying new food! What is a famous dish in An Giang?",
      keywords: ["famous", "made from", "taste", "delicious", "sweet", "sour", "try"],
      frames: ["___ is a famous dish in An Giang.", "It is made from ___ and ___.", "It tastes ___.", "You should try it at ___."],
      hints: ["dish name…", "ingredients…", "taste…", "where to try…"],
      followUps: ["Is it spicy?", "How much does it cost?", "Can you cook it?"],
      modelAnswer: "Bun ca is a famous dish in An Giang. It is made from rice noodles and fish. It tastes delicious. You should try it at Long Xuyen market.",
    },
    {
      slug: "gioi-thieu-dia-diem-gan-nha", title: "A place near my home", titleVi: "Giới thiệu một địa điểm gần nhà", topic: "Khu phố", image: "/images/nui-sam.jpg", grade: 6, isTransfer: true,
      goalVi: "NHIỆM VỤ VẬN DỤNG: Tự giới thiệu một địa điểm gần nhà em (chợ, chùa, công viên, cây cầu…) bằng lời của mình. Không có khung câu mẫu.",
      contextVi: "Bạn nước ngoài muốn biết về nơi em sống.",
      aiOpening: "Tell me about a place near your home. What is it like?",
      keywords: ["near my home", "there is", "people", "I often", "because"],
      frames: [], hints: ["what place…", "what is there…", "what people do…", "why you like it…"],
      followUps: ["Why do you like it?", "What do people do there at the weekend?", "Would you recommend it to tourists?"],
      modelAnswer: "There is a small market near my home. People sell vegetables and fish every morning. I often go there with my mother because the food is fresh.",
    },
    {
      slug: "chao-khach-khach-san", title: "Welcoming hotel guests", titleVi: "Đón khách tại quầy lễ tân", topic: "Lưu trú", image: "/images/career.jpg", package: "CAREER",
      goalVi: "Chào đón khách, hỏi thông tin đặt phòng và hướng dẫn nhận phòng.",
      contextVi: "Em là lễ tân khách sạn ở Châu Đốc. AI là khách vừa đến.",
      aiOpening: "Good afternoon. I have a reservation under the name Smith.",
      keywords: ["welcome", "reservation", "passport", "room", "floor", "breakfast"],
      frames: ["Welcome to ___ Hotel.", "May I see your passport, please?", "Your room is on the ___ floor.", "Breakfast is served from ___ to ___."],
      hints: ["welcome…", "ask for passport…", "room info…", "breakfast time…"],
      followUps: ["Is there Wi-Fi in the room?", "Can you recommend a tour to Tra Su?", "What time is check-out?"],
      modelAnswer: "Welcome to Sam Mountain Hotel. May I see your passport, please? Your room is on the third floor. Breakfast is served from six to nine.",
    },
    {
      slug: "gioi-thieu-san-pham-ocop", title: "Presenting an OCOP product", titleVi: "Giới thiệu sản phẩm OCOP", topic: "Bán hàng", image: "/images/food.jpg", package: "CAREER",
      goalVi: "Giới thiệu sản phẩm OCOP An Giang (đường thốt nốt, khô cá lóc, mắm…) cho khách nước ngoài: xuất xứ, đặc điểm, giá, cách dùng.",
      contextVi: "Em bán hàng tại gian hàng đặc sản. AI là du khách quan tâm.",
      aiOpening: "What is this product? It looks interesting.",
      keywords: ["made in", "natural", "OCOP", "price", "gift", "taste"],
      frames: ["This is ___, a famous product of An Giang.", "It is made from ___.", "It is ___ dong per pack.", "It is a great gift for ___."],
      hints: ["product name…", "made from…", "price…", "why buy…"],
      followUps: ["How long can I keep it?", "Can I take it on the plane?", "Do you have a smaller pack?"],
      modelAnswer: "This is palm sugar, a famous product of An Giang. It is made from the sap of palm trees. It is fifty thousand dong per pack. It is a great gift for your family.",
    },
  ];
  const scenarios: Record<string, { id: string }> = {};
  for (let i = 0; i < scenarioData.length; i++) {
    const s = scenarioData[i] as (typeof scenarioData)[number] & { isTransfer?: boolean; package?: string; grade?: number };
    scenarios[s.slug] = await db.scenario.create({
      data: {
        slug: s.slug, title: s.title, titleVi: s.titleVi, topic: s.topic, image: s.image, goalVi: s.goalVi, contextVi: s.contextVi,
        aiOpening: s.aiOpening, keywordsJson: J(s.keywords), framesJson: J(s.frames), hintsJson: J(s.hints), followUpsJson: J(s.followUps),
        modelAnswer: s.modelAnswer, isTransfer: !!s.isTransfer, grade: s.grade ?? null, package: s.package ?? "SCHOOL", order: i,
        systemPrompt:
          "You are a friendly English speaking tutor for Vietnamese secondary-school students in An Giang. Stay strictly within the lesson topic. Use simple English (A1–A2). Reply in 1–2 short sentences, then ask one follow-up question. Never discuss unrelated or unsafe topics.",
      },
    });
  }

  // ─────────────── Khoá học ───────────────
  console.log("📚 Khoá học...");
  const grade6: ChapterSeed[] = [
    {
      title: "Unit 1 – My New School", topic: "Trường học",
      lessons: [
        {
          title: "Đồ dùng học tập & môn học", summary: "Gọi tên đồ dùng học tập, môn học bằng tiếng Anh.", type: "DAILY", free: true, image: "/images/classroom.jpg",
          vocab: [
            { word: "school bag", ipa: "/skuːl bæɡ/", meaning: "cặp sách", example: "My school bag is blue." },
            { word: "notebook", ipa: "/ˈnəʊtbʊk/", meaning: "vở", example: "I have five notebooks." },
            { word: "subject", ipa: "/ˈsʌbdʒɪkt/", meaning: "môn học", example: "My favourite subject is English." },
            { word: "uniform", ipa: "/ˈjuːnɪfɔːm/", meaning: "đồng phục", example: "We wear a uniform every Monday." },
          ],
          sentences: [{ en: "What subjects do you have today?", vi: "Hôm nay bạn học những môn gì?" }, { en: "I have English and Maths.", vi: "Mình học tiếng Anh và Toán." }],
          dialogue: [{ speaker: "Mai", en: "Hi Bao! What subjects do you have today?", vi: "Chào Bảo! Hôm nay bạn học môn gì?" }, { speaker: "Bao", en: "I have English, Maths and Science.", vi: "Mình học tiếng Anh, Toán và Khoa học." }],
          tipVi: "Dùng 'have' để nói về môn học: I have English on Monday.",
          scenarioSlug: "gioi-thieu-ban-than",
          questions: [
            { type: "MCQ", prompt: "'Cặp sách' trong tiếng Anh là gì?", options: ["school bag", "notebook", "ruler", "pencil"], answer: "school bag", skill: "VOCAB" },
            { type: "LISTEN", prompt: "Nghe và chọn môn học bạn nghe được", options: ["English", "Music", "History", "Art"], answer: "English", audioText: "My favourite subject is English.", skill: "LISTENING" },
            { type: "ORDER", prompt: "Sắp xếp thành câu đúng", options: ["I", "have", "Maths", "today"], answer: "I have Maths today", skill: "GRAMMAR" },
          ],
        },
        {
          title: "Giới thiệu bản thân", summary: "Nói tên, tuổi, lớp, trường và sở thích.", type: "SPEAKING", free: true, image: "/images/hero.jpg",
          vocab: [
            { word: "years old", ipa: "/jɪəz əʊld/", meaning: "tuổi", example: "I am eleven years old." },
            { word: "grade", ipa: "/ɡreɪd/", meaning: "lớp, khối", example: "I am in grade 6." },
            { word: "hobby", ipa: "/ˈhɒbi/", meaning: "sở thích", example: "My hobby is drawing." },
          ],
          sentences: [{ en: "My name is Bao.", vi: "Tên mình là Bảo." }, { en: "I am in grade 6 at My Hoa Hung School.", vi: "Mình học lớp 6 trường Mỹ Hoà Hưng." }],
          tipVi: "Nhớ nói 'I AM eleven years old', không nói 'I eleven years old'.",
          scenarioSlug: "gioi-thieu-ban-than",
          questions: [
            { type: "FILL", prompt: "I ___ eleven years old.", answer: "am", explanation: "Chủ ngữ 'I' đi với 'am'.", skill: "GRAMMAR" },
            { type: "MCQ", prompt: "'Sở thích' là:", options: ["hobby", "happy", "habit", "house"], answer: "hobby", skill: "VOCAB" },
          ],
        },
        {
          title: "Video: Một ngày ở trường", summary: "Xem video hội thoại về hoạt động ở trường.", type: "VIDEO",
          vocab: [{ word: "break time", ipa: "/breɪk taɪm/", meaning: "giờ ra chơi", example: "We play games at break time." }],
          sentences: [{ en: "We play games at break time.", vi: "Chúng mình chơi trò chơi vào giờ ra chơi." }],
          questions: [{ type: "MCQ", prompt: "'Break time' nghĩa là:", options: ["giờ ra chơi", "giờ ăn trưa", "giờ học", "giờ về"], answer: "giờ ra chơi", skill: "VOCAB" }],
        },
        {
          title: "Nhiệm vụ: Giới thiệu trường em", summary: "Ghi âm 30 giây giới thiệu trường của em.", type: "TASK",
          vocab: [{ word: "classroom", ipa: "/ˈklɑːsruːm/", meaning: "phòng học", example: "Our school has 20 classrooms." }],
          sentences: [{ en: "My school is big and beautiful.", vi: "Trường mình to và đẹp." }],
        },
      ],
    },
    {
      title: "Unit 4 – My Neighbourhood", topic: "Khu phố",
      lessons: [
        {
          title: "Địa điểm trong khu phố", summary: "Chợ, chùa, công viên, bưu điện, bệnh viện…", type: "DAILY", image: "/images/nui-sam.jpg",
          vocab: [
            { word: "market", ipa: "/ˈmɑːkɪt/", meaning: "chợ", example: "There is a big market near my house." },
            { word: "pagoda", ipa: "/pəˈɡəʊdə/", meaning: "chùa", example: "The pagoda is very old." },
            { word: "bridge", ipa: "/brɪdʒ/", meaning: "cây cầu", example: "Cross the bridge and turn left." },
          ],
          sentences: [{ en: "There is a market near my house.", vi: "Có một cái chợ gần nhà mình." }],
          tipVi: "'There is' + danh từ số ít; 'There are' + danh từ số nhiều.",
          scenarioSlug: "gioi-thieu-dia-diem-gan-nha",
          questions: [
            { type: "FILL", prompt: "There ___ two pagodas in my village.", answer: "are", skill: "GRAMMAR" },
            { type: "MCQ", prompt: "'Cây cầu' là:", options: ["bridge", "bride", "bread", "brick"], answer: "bridge", skill: "VOCAB" },
          ],
        },
        {
          title: "Hỏi và chỉ đường", summary: "Go straight, turn left/right, next to, opposite.", type: "SPEAKING", image: "/images/nui-sam.jpg",
          vocab: [
            { word: "go straight", ipa: "/ɡəʊ streɪt/", meaning: "đi thẳng", example: "Go straight for 200 metres." },
            { word: "turn left", ipa: "/tɜːn left/", meaning: "rẽ trái", example: "Turn left at the market." },
            { word: "opposite", ipa: "/ˈɒpəzɪt/", meaning: "đối diện", example: "The bank is opposite the school." },
          ],
          sentences: [{ en: "Excuse me, how can I get to Sam Mountain?", vi: "Xin lỗi, làm sao để tôi đến Núi Sam?" }],
          scenarioSlug: "hoi-duong-chau-doc",
          questions: [{ type: "MCQ", prompt: "'Đối diện' là:", options: ["opposite", "next to", "behind", "between"], answer: "opposite", skill: "VOCAB" }],
        },
        {
          title: "Video: Khám phá Châu Đốc", summary: "Video giới thiệu các địa điểm ở Châu Đốc.", type: "VIDEO", image: "/images/nui-sam.jpg",
          vocab: [{ word: "temple", ipa: "/ˈtempl/", meaning: "đền, miếu", example: "Ba Chua Xu Temple is famous." }],
          sentences: [{ en: "Ba Chua Xu Temple is at the foot of Sam Mountain.", vi: "Miếu Bà Chúa Xứ nằm dưới chân Núi Sam." }],
        },
        {
          title: "Nhiệm vụ: Chỉ đường đến trường", summary: "Ghi âm hướng dẫn bạn nước ngoài từ nhà em đến trường.", type: "TASK",
          vocab: [], sentences: [{ en: "From my house, go straight and turn right.", vi: "Từ nhà mình, đi thẳng rồi rẽ phải." }],
        },
      ],
    },
    {
      title: "Unit 5 – Natural Wonders of An Giang", topic: "Du lịch An Giang",
      lessons: [
        {
          title: "Giới thiệu Rừng tràm Trà Sư", summary: "Bài học bản sắc địa phương: giới thiệu điểm đến cho bạn nước ngoài.", type: "DAILY", free: true, image: "/images/tra-su.jpg",
          vocab: [
            { word: "cajeput forest", ipa: "/ˈkædʒəpʊt ˈfɒrɪst/", meaning: "rừng tràm", example: "Tra Su is a beautiful cajeput forest." },
            { word: "boat", ipa: "/bəʊt/", meaning: "thuyền, xuồng", example: "You can go by boat." },
            { word: "bird", ipa: "/bɜːd/", meaning: "con chim", example: "There are many birds." },
            { word: "province", ipa: "/ˈprɒvɪns/", meaning: "tỉnh", example: "It is in An Giang province." },
          ],
          sentences: [
            { en: "You should visit Tra Su Cajeput Forest.", vi: "Bạn nên đến Rừng tràm Trà Sư." },
            { en: "You can go by boat and see many birds.", vi: "Bạn có thể đi xuồng và ngắm nhiều chim." },
          ],
          dialogue: [
            { speaker: "Tom", en: "Where should I go in An Giang?", vi: "Mình nên đi đâu ở An Giang?" },
            { speaker: "Ngoc", en: "You should visit Tra Su. It's a green cajeput forest.", vi: "Bạn nên đến Trà Sư. Đó là một khu rừng tràm xanh mướt." },
            { speaker: "Tom", en: "What can I do there?", vi: "Mình có thể làm gì ở đó?" },
            { speaker: "Ngoc", en: "You can go by boat and watch birds.", vi: "Bạn có thể đi xuồng và ngắm chim." },
          ],
          tipVi: "Dùng 'You should + động từ' để khuyên ai đó nên làm gì.",
          scenarioSlug: "gioi-thieu-tra-su",
          questions: [
            { type: "MCQ", prompt: "'Rừng tràm' trong tiếng Anh là:", options: ["cajeput forest", "rice field", "floating market", "mountain"], answer: "cajeput forest", skill: "VOCAB" },
            { type: "FILL", prompt: "You ___ visit Tra Su. (nên)", answer: "should", skill: "GRAMMAR" },
            { type: "LISTEN", prompt: "Nghe và chọn phương tiện", options: ["boat", "bus", "train", "plane"], answer: "boat", audioText: "You can go by boat and see many birds.", skill: "LISTENING" },
          ],
        },
        {
          title: "Chợ nổi & trái cây miền Tây", summary: "Hỏi giá, mua bán trái cây.", type: "SPEAKING", image: "/images/cho-noi.jpg",
          vocab: [
            { word: "floating market", ipa: "/ˈfləʊtɪŋ ˈmɑːkɪt/", meaning: "chợ nổi", example: "Long Xuyen floating market is busy in the morning." },
            { word: "mango", ipa: "/ˈmæŋɡəʊ/", meaning: "xoài", example: "These mangoes are sweet." },
            { word: "How much", ipa: "/haʊ mʌtʃ/", meaning: "bao nhiêu (tiền)", example: "How much are they?" },
          ],
          sentences: [{ en: "How much are these mangoes?", vi: "Mấy trái xoài này bao nhiêu tiền?" }],
          scenarioSlug: "mua-hang-cho-noi",
          questions: [{ type: "MCQ", prompt: "'Chợ nổi' là:", options: ["floating market", "supermarket", "night market", "flower market"], answer: "floating market", skill: "VOCAB" }],
        },
        {
          title: "Video: Núi Sam & Miếu Bà Chúa Xứ", summary: "Video bài giảng về Núi Sam.", type: "VIDEO", image: "/images/nui-sam.jpg",
          vocab: [{ word: "mountain", ipa: "/ˈmaʊntən/", meaning: "núi", example: "Sam Mountain is in Chau Doc." }],
          sentences: [{ en: "Sam Mountain is in Chau Doc city.", vi: "Núi Sam ở thành phố Châu Đốc." }],
        },
        {
          title: "Nhiệm vụ: Giới thiệu một địa điểm gần nhà", summary: "Nhiệm vụ vận dụng – nói bằng lời của em, không có câu mẫu.", type: "TASK", image: "/images/nui-sam.jpg",
          vocab: [], sentences: [], scenarioSlug: "gioi-thieu-dia-diem-gan-nha",
        },
      ],
    },
  ];

  const grade7: ChapterSeed[] = [
    {
      title: "Unit 1 – Hobbies", topic: "Sở thích",
      lessons: [
        { title: "Sở thích của em", summary: "Nói về sở thích và lý do.", type: "DAILY", free: true, image: "/images/hero.jpg",
          vocab: [{ word: "gardening", ipa: "/ˈɡɑːdnɪŋ/", meaning: "làm vườn", example: "My grandpa enjoys gardening." }, { word: "fishing", ipa: "/ˈfɪʃɪŋ/", meaning: "câu cá", example: "We go fishing on the river." }],
          sentences: [{ en: "I enjoy fishing because it's relaxing.", vi: "Mình thích câu cá vì nó thư giãn." }], scenarioSlug: "gioi-thieu-ban-than",
          questions: [{ type: "FILL", prompt: "I enjoy ___ (câu cá) on the river.", answer: "fishing", skill: "VOCAB" }] },
        { title: "Video: Sở thích của bạn trẻ miền Tây", summary: "Video bài giảng.", type: "VIDEO", vocab: [], sentences: [] },
        { title: "Luyện nói: Rủ bạn đi câu cá", summary: "Mời, nhận lời, từ chối lịch sự.", type: "SPEAKING", vocab: [], sentences: [{ en: "Would you like to go fishing with me?", vi: "Bạn có muốn đi câu cá với mình không?" }] },
        { title: "Nhiệm vụ: Phỏng vấn sở thích của bạn", summary: "Hỏi 3 bạn về sở thích và ghi âm tóm tắt.", type: "TASK", vocab: [], sentences: [] },
      ],
    },
    {
      title: "Unit 5 – Food and Drink", topic: "Món ăn",
      lessons: [
        { title: "Món ngon An Giang", summary: "Bún cá, bánh xèo, mắm Châu Đốc, đường thốt nốt.", type: "DAILY", image: "/images/food.jpg",
          vocab: [{ word: "noodle soup", ipa: "/ˈnuːdl suːp/", meaning: "món bún/phở nước", example: "Bun ca is a fish noodle soup." }, { word: "palm sugar", ipa: "/pɑːm ˈʃʊɡə/", meaning: "đường thốt nốt", example: "Palm sugar is sweet and natural." }],
          sentences: [{ en: "Bun ca is a famous dish in An Giang.", vi: "Bún cá là món nổi tiếng ở An Giang." }], scenarioSlug: "gioi-thieu-mon-an",
          questions: [{ type: "MCQ", prompt: "'Đường thốt nốt' là:", options: ["palm sugar", "brown rice", "coconut milk", "fish sauce"], answer: "palm sugar", skill: "VOCAB" }] },
        { title: "Video: Cách làm bánh xèo", summary: "Video hướng dẫn bằng tiếng Anh, phụ đề song ngữ.", type: "VIDEO", image: "/images/food.jpg", vocab: [], sentences: [] },
        { title: "Luyện nói: Gọi món ở quán ăn", summary: "Gọi món, hỏi giá, tính tiền.", type: "SPEAKING", vocab: [], sentences: [{ en: "Can I have a bowl of bun ca, please?", vi: "Cho tôi một tô bún cá nhé." }] },
        { title: "Nhiệm vụ: Giới thiệu món ăn gia đình em", summary: "Ghi âm 45 giây giới thiệu một món ăn nhà em hay nấu.", type: "TASK", vocab: [], sentences: [] },
      ],
    },
    {
      title: "Unit 3 – Community Service", topic: "Cộng đồng",
      lessons: [
        { title: "Hoạt động tình nguyện", summary: "Trồng cây, dọn rác, giúp người già.", type: "DAILY", vocab: [{ word: "volunteer", ipa: "/ˌvɒlənˈtɪə/", meaning: "tình nguyện", example: "We volunteer at the local library." }], sentences: [] },
        { title: "Video: Bảo vệ dòng sông Mekong", summary: "Video bài giảng.", type: "VIDEO", vocab: [], sentences: [] },
        { title: "Luyện nói: Kêu gọi bạn tham gia", summary: "Thuyết phục bạn cùng tham gia hoạt động.", type: "SPEAKING", vocab: [], sentences: [] },
        { title: "Nhiệm vụ: Kế hoạch tình nguyện của lớp", summary: "Trình bày kế hoạch bằng tiếng Anh.", type: "TASK", vocab: [], sentences: [] },
      ],
    },
  ];

  const career: ChapterSeed[] = [
    {
      title: "Đón tiếp khách", topic: "Lưu trú",
      lessons: [
        { title: "Chào hỏi & đón khách", summary: "Mẫu câu đón khách chuyên nghiệp.", type: "DAILY", free: true, image: "/images/career.jpg",
          vocab: [{ word: "reservation", ipa: "/ˌrezəˈveɪʃn/", meaning: "đặt chỗ", example: "Do you have a reservation?" }, { word: "check in", ipa: "/tʃek ɪn/", meaning: "nhận phòng", example: "Check-in time is 2 p.m." }],
          sentences: [{ en: "Welcome to our hotel. How can I help you?", vi: "Chào mừng quý khách. Tôi có thể giúp gì?" }], scenarioSlug: "chao-khach-khach-san" },
        { title: "Video: Quy trình nhận phòng", summary: "Video tình huống tại quầy lễ tân.", type: "VIDEO", image: "/images/career.jpg", vocab: [], sentences: [] },
      ],
    },
    {
      title: "Giới thiệu điểm đến & sản phẩm", topic: "Du lịch – Bán hàng",
      lessons: [
        { title: "Giới thiệu tour Trà Sư – Núi Sam", summary: "Tư vấn tour cho khách nước ngoài.", type: "SPEAKING", image: "/images/tra-su.jpg", vocab: [], sentences: [], scenarioSlug: "gioi-thieu-tra-su" },
        { title: "Giới thiệu sản phẩm OCOP", summary: "Đường thốt nốt, khô cá, mắm Châu Đốc.", type: "SPEAKING", image: "/images/food.jpg", vocab: [], sentences: [], scenarioSlug: "gioi-thieu-san-pham-ocop" },
      ],
    },
  ];

  const community: ChapterSeed[] = [
    {
      title: "Bắt đầu từ con số 0", topic: "Cơ bản",
      lessons: [
        { title: "Chào hỏi cơ bản", summary: "Hello, Goodbye, Thank you – hướng dẫn bằng tiếng Việt.", type: "DAILY", free: true, vocab: [{ word: "hello", ipa: "/həˈləʊ/", meaning: "xin chào", example: "Hello! Nice to meet you." }], sentences: [{ en: "Nice to meet you.", vi: "Rất vui được gặp bạn." }] },
        { title: "Số đếm & giá tiền", summary: "Đếm số, nói giá tiền khi mua bán.", type: "VIDEO", vocab: [], sentences: [] },
      ],
    },
  ];

  let videoIdx = 0;
  async function createCourse(
    data: { slug: string; title: string; subtitle: string; description: string; package: string; grade?: number; levelLabel: string; coverImage: string; price: number; salePrice?: number; isFree?: boolean; order: number; objectives: string[]; teacherName: string },
    chapters: ChapterSeed[]
  ) {
    const course = await db.course.create({
      data: {
        slug: data.slug, title: data.title, subtitle: data.subtitle, description: data.description, package: data.package, grade: data.grade ?? null,
        levelLabel: data.levelLabel, coverImage: data.coverImage, price: data.price, salePrice: data.salePrice ?? null, isFree: !!data.isFree,
        status: "PUBLISHED", order: data.order, objectivesJson: J(data.objectives), teacherName: data.teacherName, introVideoUrl: SAMPLE_VIDEOS[0],
      },
    });
    for (let ci = 0; ci < chapters.length; ci++) {
      const ch = chapters[ci];
      const chapter = await db.chapter.create({ data: { courseId: course.id, title: ch.title, topic: ch.topic, order: ci } });
      for (let li = 0; li < ch.lessons.length; li++) {
        const l = ch.lessons[li];
        let videoId: string | null = null;
        if (l.type === "VIDEO" || l.type === "DAILY") {
          const v = await makeVideo(
            l.title.replace(/^Video: /, ""),
            videoIdx++,
            l.sentences.length ? l.sentences.map((s) => s.en) : ["Hello everyone!", "Welcome to MEKONG English AI.", "Let's learn together."],
            l.sentences.length ? l.sentences.map((s) => s.vi) : ["Xin chào các bạn!", "Chào mừng đến với MEKONG English AI.", "Cùng học nhé."]
          );
          videoId = v.id;
        }
        const lesson = await db.lesson.create({
          data: {
            chapterId: chapter.id, title: l.title, summary: l.summary, type: l.type, isFreePreview: !!l.free, order: li,
            durationMin: l.type === "VIDEO" ? 5 : 15, image: l.image ?? null, videoId,
            scenarioId: l.scenarioSlug ? scenarios[l.scenarioSlug].id : null,
            contentJson: J({ vocab: l.vocab, sentences: l.sentences, dialogue: l.dialogue ?? [], tipVi: l.tipVi ?? "" }),
          },
        });
        for (const q of l.questions ?? []) {
          await db.question.create({
            data: { lessonId: lesson.id, type: q.type, prompt: q.prompt, optionsJson: J(q.options ?? []), answer: q.answer, explanation: q.explanation, audioText: q.audioText, skill: q.skill ?? "VOCAB", topic: ch.topic },
          });
        }
      }
    }
    return course;
  }

  const c6 = await createCourse(
    {
      slug: "tieng-anh-lop-6", title: "Tiếng Anh lớp 6 – Nói tự tin từ điều gần gũi", subtitle: "Bám sát SGK Global Success, bổ sung luyện nói với gia sư AI và học liệu An Giang",
      description: "Khoá học dành cho học sinh lớp 6: mỗi ngày 15 phút ôn lại – xem & nghe – luyện nói với AI – sửa lỗi – xem kết quả. Chủ đề gắn với trường học, khu phố, chợ nổi, điểm đến An Giang.",
      package: "SCHOOL", grade: 6, levelLabel: "Lớp 6", coverImage: "/images/classroom.jpg", price: 990000, salePrice: 690000, order: 1,
      objectives: ["Giới thiệu bản thân, trường lớp tự tin", "Hỏi – chỉ đường trong khu phố", "Giới thiệu một điểm đến An Giang cho bạn nước ngoài", "Mở rộng 300+ từ vựng theo SGK"],
      teacherName: "Cô Nguyễn Thị Mai",
    },
    grade6
  );
  const c7 = await createCourse(
    {
      slug: "tieng-anh-lop-7", title: "Tiếng Anh lớp 7 – Giao tiếp đời sống miền Tây", subtitle: "Sở thích, món ăn, hoạt động cộng đồng – luyện nói có hướng dẫn",
      description: "Khoá học lớp 7 với video bài giảng, bài tập tương tác và tình huống nói về món ăn, sở thích, hoạt động tình nguyện ở địa phương.",
      package: "SCHOOL", grade: 7, levelLabel: "Lớp 7", coverImage: "/images/food.jpg", price: 990000, salePrice: 690000, order: 2,
      objectives: ["Nói về sở thích và lý do", "Giới thiệu món ăn đặc sản An Giang", "Trình bày kế hoạch hoạt động cộng đồng"],
      teacherName: "Thầy Phạm Quốc Huy",
    },
    grade7
  );
  const cCareer = await createCourse(
    {
      slug: "tieng-anh-du-lich-dich-vu", title: "English Career – Tiếng Anh du lịch & dịch vụ An Giang", subtitle: "Lễ tân, nhà hàng, hướng dẫn viên, bán hàng đặc sản OCOP",
      description: "Luyện các tình huống cần dùng ngay trong công việc: đón khách, giới thiệu tour Trà Sư – Núi Sam, tư vấn sản phẩm OCOP.",
      package: "CAREER", levelLabel: "A1–A2", coverImage: "/images/career.jpg", price: 1490000, salePrice: 1190000, order: 3,
      objectives: ["Đón tiếp và hỗ trợ khách nước ngoài", "Giới thiệu điểm đến, tour", "Giới thiệu sản phẩm OCOP"],
      teacherName: "Ms. Hoàng Anh",
    },
    career
  );
  await createCourse(
    {
      slug: "tieng-anh-cho-nguoi-moi-bat-dau", title: "English Community – Tiếng Anh cho người mới bắt đầu", subtitle: "Hướng dẫn bằng tiếng Việt, bài ngắn, thao tác đơn giản",
      description: "Dành cho người mới bắt đầu hoặc học lại tiếng Anh. Bài học 5–10 phút, giải thích bằng tiếng Việt.",
      package: "COMMUNITY", levelLabel: "Mới bắt đầu", coverImage: "/images/cho-noi.jpg", price: 0, isFree: true, order: 4,
      objectives: ["Chào hỏi, giới thiệu cơ bản", "Đếm số, nói giá tiền", "Tự tin nói câu đơn giản"],
      teacherName: "Đội ngũ MEKONG English AI",
    },
    community
  );

  // ─────────────── Nhiệm vụ thực tế ───────────────
  console.log("🎯 Nhiệm vụ thực tế...");
  const rubric = [
    { criterion: "Hoàn thành nhiệm vụ", maxScore: 3, descriptionVi: "Nói đủ ý: địa điểm, đặc điểm, hoạt động" },
    { criterion: "Người nghe hiểu được", maxScore: 3, descriptionVi: "Phát âm đủ rõ để người nghe hiểu" },
    { criterion: "Từ vựng", maxScore: 2, descriptionVi: "Dùng từ phù hợp chủ đề" },
    { criterion: "Cấu trúc câu", maxScore: 2, descriptionVi: "Câu đúng cơ bản, có từ nối" },
  ];
  const tasks = await Promise.all([
    db.realTask.create({ data: { courseId: c6.id, title: "Giới thiệu trường em", descriptionVi: "Ghi âm 30–45 giây giới thiệu trường của em: tên trường, ở đâu, có gì đặc biệt, em thích gì ở trường.", topic: "Trường học", image: "/images/classroom.jpg", rubricJson: J(rubric), order: 1 } }),
    db.realTask.create({ data: { courseId: c6.id, title: "Chỉ đường từ nhà đến trường", descriptionVi: "Hướng dẫn một bạn nước ngoài đi từ nhà em đến trường. Dùng go straight, turn left/right, next to…", topic: "Khu phố", image: "/images/nui-sam.jpg", rubricJson: J(rubric), order: 2 } }),
    db.realTask.create({ data: { courseId: c6.id, title: "Giới thiệu một địa điểm gần nhà (vận dụng)", descriptionVi: "Tình huống MỚI: giới thiệu một địa điểm gần nhà bằng lời của em. Không có câu mẫu – hãy tự diễn đạt!", topic: "Khu phố", image: "/images/tra-su.jpg", isTransfer: true, rubricJson: J(rubric), order: 3 } }),
    db.realTask.create({ data: { courseId: c7.id, title: "Giới thiệu món ăn gia đình em", descriptionVi: "Ghi âm 45 giây giới thiệu một món ăn nhà em hay nấu: tên món, nguyên liệu, mùi vị, khi nào ăn.", topic: "Món ăn", image: "/images/food.jpg", rubricJson: J(rubric), order: 4 } }),
    db.realTask.create({ data: { courseId: cCareer.id, title: "Tư vấn tour 1 ngày ở Châu Đốc", descriptionVi: "Đóng vai hướng dẫn viên, giới thiệu lịch trình 1 ngày: Núi Sam – Trà Sư – chợ Châu Đốc.", topic: "Du lịch", image: "/images/career.jpg", isTransfer: true, rubricJson: J(rubric), order: 5 } }),
  ]);

  // ─────────────── Giáo viên Live ───────────────
  console.log("🎥 Giáo viên Live & lịch...");
  const tutorsData = [
    { slug: "ms-hoang-anh", name: "Ms. Hoàng Anh", userId: tutorUser.id, gender: "Nữ", headline: "IELTS 8.0 · 6 năm dạy giao tiếp THCS", certificates: "IELTS 8.0, TESOL", specialties: "Phát âm, Giao tiếp THCS, Luyện thi vào 10", bio: "Cô Hoàng Anh tốt nghiệp Sư phạm Tiếng Anh, Đại học An Giang. Cô giúp các bạn nhút nhát dám nói qua trò chơi và tình huống gần gũi.", price: 150000, rating: 4.9, count: 128, avatar: "/images/live-tutor.jpg" },
    { slug: "mr-david-tran", name: "Mr. David Trần", gender: "Nam", headline: "Việt kiều Úc · Chuyên tiếng Anh du lịch", certificates: "CELTA", specialties: "Tiếng Anh du lịch, Phản xạ giao tiếp", bio: "Thầy David từng làm hướng dẫn viên tại Phú Quốc, Hà Tiên. Thầy chuyên luyện tình huống thực tế cho học sinh và người đi làm.", price: 200000, rating: 4.8, count: 86, avatar: "/images/career.jpg", nationality: "Úc" },
    { slug: "co-thanh-truc", name: "Cô Thanh Trúc", gender: "Nữ", headline: "Giáo viên THCS · Luyện nói cho người mới", certificates: "B2 Châu Âu, Chứng chỉ PPDH", specialties: "Mất gốc, Học sinh lớp 6–7", bio: "Cô Trúc kiên nhẫn, giải thích bằng tiếng Việt dễ hiểu, phù hợp các bạn mới bắt đầu.", price: 120000, rating: 4.9, count: 64, avatar: "/images/parent-report.jpg" },
  ];
  const tutors = [];
  for (const t of tutorsData) {
    tutors.push(
      await db.tutor.create({
        data: {
          slug: t.slug, name: t.name, userId: (t as { userId?: string }).userId ?? null, gender: t.gender, headline: t.headline, certificates: t.certificates,
          specialties: t.specialties, bio: t.bio, pricePerSession: t.price, rating: t.rating, ratingCount: t.count, avatar: t.avatar,
          nationality: (t as { nationality?: string }).nationality ?? "Việt Nam", videoUrl: SAMPLE_VIDEOS[2],
        },
      })
    );
  }
  // Tạo lịch trống 7 ngày tới (19h, 20h tối; 9h sáng cuối tuần)
  const slotIds: string[] = [];
  for (let d = 0; d < 7; d++) {
    for (const [ti, tutor] of tutors.entries()) {
      for (const hour of [19, 20]) {
        const start = new Date();
        start.setDate(start.getDate() + d);
        start.setHours(hour + (ti === 1 ? 0 : 0), ti * 30 % 60, 0, 0);
        if (start < new Date()) continue;
        const isGroup = hour === 20 && ti !== 0;
        const s = await db.tutorSlot.create({
          data: {
            tutorId: tutor.id, startAt: start, durationMin: 25, type: isGroup ? "GROUP" : "ONE_ON_ONE", capacity: isGroup ? 5 : 1,
            topic: isGroup ? "Nhóm: Giới thiệu điểm đến An Giang" : null, meetingUrl: `https://meet.jit.si/mekong-english-${tutor.slug}-${d}-${hour}`,
          },
        });
        slotIds.push(s.id);
      }
    }
  }
  // Booking mẫu cho học sinh demo
  await db.booking.create({ data: { slotId: slotIds[0], userId: demoStudent.id, status: "BOOKED", note: "Em muốn luyện giới thiệu Trà Sư" } });
  await db.tutorSlot.update({ where: { id: slotIds[0] }, data: { status: "FULL" } });
  // Buổi đã học trong quá khứ
  const pastSlot = await db.tutorSlot.create({ data: { tutorId: tutors[0].id, startAt: days(-3), durationMin: 25, status: "DONE", meetingUrl: "https://meet.jit.si/mekong-english-past" } });
  await db.booking.create({
    data: { slotId: pastSlot.id, userId: demoStudent.id, status: "COMPLETED", rating: 5, review: "Cô dạy rất vui!", tutorFeedback: "Bảo nói to, rõ. Cần luyện thêm âm cuối /s/ và cách đặt câu hỏi Wh-." },
  });

  // ─────────────── Gói dịch vụ & đơn hàng ───────────────
  console.log("💳 Gói dịch vụ, đơn hàng...");
  const plans = {
    free: await db.plan.create({ data: { code: "FREE", name: "Miễn phí", type: "FREE", description: "Trải nghiệm trước khi quyết định", price: 0, durationDays: 3650, order: 0, featuresJson: J(["Bài học thử mỗi khoá", "5 lượt luyện nói AI/ngày", "Theo dõi tiến bộ cơ bản"]) } }),
    video: await db.plan.create({ data: { code: "VIDEO_6M", name: "Video Premium", type: "SUBSCRIPTION", tier: "VIDEO", description: "Toàn bộ thư viện video bài giảng", price: 599000, salePrice: 399000, durationDays: 180, order: 1, featuresJson: J(["Toàn bộ video bài giảng lớp 6–7", "Bài tập tương tác sau mỗi video", "Tải bài học xem offline", "10 lượt luyện nói AI/ngày"]) } }),
    ai: await db.plan.create({ data: { code: "AI_6M", name: "AI Premium", type: "SUBSCRIPTION", tier: "AI", description: "Học đầy đủ – luyện nói không giới hạn hợp lý", price: 1290000, salePrice: 890000, durationDays: 180, isFeatured: true, order: 2, featuresJson: J(["Mọi quyền lợi Video Premium", "Luyện nói AI không giới hạn hợp lý", "Nhiệm vụ thực tế có giáo viên chấm", "Báo cáo tuần cho phụ huynh", "Tặng 1 buổi Live Speaking"]) } }),
    ai12: await db.plan.create({ data: { code: "AI_12M", name: "AI Premium 12 tháng", type: "SUBSCRIPTION", tier: "AI", description: "Tiết kiệm nhất cho cả năm học", price: 2290000, salePrice: 1490000, durationDays: 365, order: 3, featuresJson: J(["Mọi quyền lợi AI Premium", "Tặng 2 buổi Live Speaking", "Ưu tiên hỗ trợ"]) } }),
    live4: await db.plan.create({ data: { code: "LIVE_4", name: "Live Speaking – 4 buổi", type: "LIVE_PACK", description: "Luyện nói 1-1 với giáo viên, 25 phút/buổi", price: 600000, salePrice: 540000, durationDays: 60, sessions: 4, order: 4, featuresJson: J(["4 buổi 1-1 × 25 phút", "Nhận xét sau mỗi buổi", "Đổi lịch trước 12 giờ"]) } }),
    live12: await db.plan.create({ data: { code: "LIVE_12", name: "Live Speaking – 12 buổi", type: "LIVE_PACK", description: "Lộ trình 6 tuần, 2 buổi/tuần", price: 1800000, salePrice: 1440000, durationDays: 120, sessions: 12, isFeatured: true, order: 5, featuresJson: J(["12 buổi 1-1 × 25 phút", "Báo cáo tiến bộ cuối lộ trình", "Đổi lịch linh hoạt"]) } }),
    school: await db.plan.create({ data: { code: "SCHOOL_LICENSE", name: "School License", type: "B2B", description: "Dành cho trường THCS / trung tâm", price: 0, durationDays: 365, order: 6, featuresJson: J(["License theo số học sinh/năm", "Cổng giáo viên & báo cáo lớp", "Tập huấn giáo viên", "Báo cáo đánh giá hiệu quả"]) } }),
    career: await db.plan.create({ data: { code: "CAREER_B2B", name: "English Career cho doanh nghiệp", type: "B2B", description: "Du lịch, nhà hàng, lưu trú, bán hàng", price: 0, durationDays: 365, order: 7, featuresJson: J(["Tình huống theo nghiệp vụ", "Học liệu điểm đến & sản phẩm OCOP", "Báo cáo theo nhân viên"]) } }),
  };
  void plans.free; void plans.school; void plans.career; void plans.ai12;

  await db.subscription.create({ data: { userId: indiv.id, planId: plans.ai.id, startAt: days(-20), endAt: days(160) } });
  await db.coupon.createMany({ data: [
    { code: "MEKONG30", percent: 30, maxUses: 500, used: 42, expiresAt: days(60) },
    { code: "ANGIANG50K", amount: 50000, maxUses: 200, used: 12, expiresAt: days(30) },
  ] });

  const methods = ["VIETQR", "VNPAY", "MOMO", "ZALOPAY"];
  const buyers = ["Trương Quỳnh Như", "Nguyễn Văn Hùng", "Lê Thị Kim", "Phan Minh Trí", "Đỗ Thu Hà", "Võ Văn Tâm", "Huỳnh Thị Lan", "Trần Bảo Châu"];
  const orderPlans = [plans.ai, plans.video, plans.live4, plans.ai, plans.live12, plans.video, plans.ai, plans.live4];
  for (let i = 0; i < 24; i++) {
    const p = orderPlans[i % orderPlans.length];
    const price = p.salePrice ?? p.price;
    const status = i % 7 === 3 ? "PENDING" : i % 11 === 5 ? "CANCELLED" : "PAID";
    const created = days(-Math.floor(i * 1.2));
    await db.order.create({
      data: {
        code: `MK${String(260000 + i * 13).padStart(6, "0")}`, userId: i === 0 ? indiv.id : null, planId: p.id, customerName: buyers[i % buyers.length],
        phone: `09${String(10000000 + i * 7919).slice(0, 8)}`, amount: price, total: price, method: methods[i % 4], status,
        createdAt: created, paidAt: status === "PAID" ? created : null,
      },
    });
  }

  // ─────────────── Lịch sử học tập (để dashboard có dữ liệu) ───────────────
  console.log("📈 Lịch sử học tập mẫu...");
  const scenarioIds = Object.values(scenarios).map((s) => s.id);
  const commonErrors = [
    { wrong: "I eleven years old", right: "I am eleven years old", explainVi: "Thiếu động từ 'am'." },
    { wrong: "It have many birds", right: "It has many birds", explainVi: "Chủ ngữ số ít 'It' đi với 'has'." },
    { wrong: "You can go by the boat", right: "You can go by boat", explainVi: "'by + phương tiện' không dùng 'the'." },
    { wrong: "Where you live?", right: "Where do you live?", explainVi: "Câu hỏi Wh- cần trợ động từ 'do/does'." },
  ];
  for (const [si, st] of students.entries()) {
    const inactive = si % 5 === 3;
    const sessionsCount = inactive ? 1 : 6 + Math.floor(Math.random() * 14);
    for (let k = 0; k < sessionsCount; k++) {
      await db.studySession.create({ data: { userId: st.id, minutes: 12 + Math.floor(Math.random() * 6), stepsCompleted: 5, score: 55 + Math.floor(Math.random() * 40), createdAt: days(-Math.floor(Math.random() * 28) - (inactive ? 9 : 0)), summaryVi: "Hoàn thành buổi học 15 phút", nextFocusVi: "Luyện thêm câu hỏi Wh-" } });
    }
    const attempts = inactive ? 1 : 4 + Math.floor(Math.random() * 8);
    for (let k = 0; k < attempts; k++) {
      const overall = 45 + Math.floor(Math.random() * 50);
      const err = commonErrors[(si + k) % commonErrors.length];
      await db.speakingAttempt.create({
        data: {
          userId: st.id, scenarioId: scenarioIds[k % 4], scaffoldLevel: overall > 80 ? 3 : overall > 65 ? 2 : 1, transcript: err.wrong + ".",
          scoresJson: J({ meaning: overall, clarity: overall - 5, vocabulary: overall + 3, structure: overall - 10, overall }), overall,
          feedbackVi: "Em nói khá rõ! Chú ý: " + err.explainVi, correctionsJson: J([err]), createdAt: days(-Math.floor(Math.random() * 20)),
          teacherScore: k === 0 && si < 6 ? Math.max(0, overall + Math.floor(Math.random() * 15) - 7) : null,
          noisy: k % 6 === 5,
        },
      });
      await db.aiUsageLog.create({ data: { userId: st.id, kind: "STT", units: 20, cost: 100, createdAt: days(-Math.floor(Math.random() * 20)) } });
      await db.aiUsageLog.create({ data: { userId: st.id, kind: "LLM", units: 600, cost: 50, createdAt: days(-Math.floor(Math.random() * 20)) } });
    }
    for (let k = 0; k < 3; k++) {
      await db.scenarioProgress.create({ data: { userId: st.id, scenarioId: scenarioIds[k], scaffoldLevel: 1 + ((si + k) % 3), bestScore: 50 + ((si * 7 + k * 11) % 45), attempts: 2 + k, passStreak: k % 2 } });
    }
  }
  // Tiến độ bài học học sinh demo
  const demoLessons = await db.lesson.findMany({ where: { chapter: { courseId: c6.id } }, orderBy: [{ chapter: { order: "asc" } }, { order: "asc" }], take: 5 });
  for (const l of demoLessons) await db.lessonProgress.create({ data: { userId: demoStudent.id, lessonId: l.id, completed: true, score: 80, videoPct: 100 } });

  // Bài nộp nhiệm vụ thực tế
  for (const [si, st] of students.slice(0, 8).entries()) {
    await db.taskSubmission.create({
      data: {
        taskId: tasks[si % 3].id, userId: st.id, transcript: "My school is My Hoa Hung Secondary School. It is in Long Xuyen. It have a big yard and many trees. I like my school because my friends are friendly.",
        aiScore: 60 + ((si * 9) % 35), aiFeedbackVi: "Em đã nói đủ ý chính. Sửa: 'It have' → 'It has'.", status: si < 3 ? "REVIEWED" : "SUBMITTED",
        teacherScore: si < 3 ? 7 + (si % 3) : null, teacherFeedback: si < 3 ? "Bài nói rõ ràng, em nhớ dùng 'has' với 'It' nhé!" : null,
      },
    });
  }

  // Giao bài cho lớp
  const firstLessons = await db.lesson.findMany({ where: { chapter: { courseId: c6.id } }, take: 3, orderBy: [{ chapter: { order: "asc" } }, { order: "asc" }] });
  await db.assignment.create({ data: { classroomId: class6a.id, title: "Ôn Unit 1 – Đồ dùng học tập", lessonId: firstLessons[0].id, dueAt: days(2) } });
  await db.assignment.create({ data: { classroomId: class6a.id, title: "Luyện nói: Giới thiệu Trà Sư", scenarioId: scenarios["gioi-thieu-tra-su"].id, dueAt: days(5), note: "Mỗi em luyện ít nhất 3 lượt" } });

  // Báo cáo tuần
  await db.weeklyReport.create({ data: { studentId: demoStudent.id, weekStart: days(-7), sessions: 4, minutes: 62, canDoVi: "Con có thể giới thiệu bản thân và trường học.", needVi: "Cần luyện thêm cách đặt câu hỏi (Where/What/How).", sentAt: days(-1) } });

  // Đánh giá thí điểm (pre/post, blind)
  for (const [si, st] of students.entries()) {
    const pre = 3 + (si % 4);
    await db.assessment.create({ data: { studentId: st.id, phase: "PRE", taskTitle: "Giới thiệu bản thân & trường học (đầu kỳ)", score: pre, aiScore: pre + (si % 2), raterName: "GV chấm độc lập 1" } });
    if (si % 3 !== 0) await db.assessment.create({ data: { studentId: st.id, phase: "POST", taskTitle: "Giới thiệu bản thân & trường học (cuối kỳ – tương đương)", score: pre + (si < 10 ? 2 : 1), aiScore: pre + 2, raterName: "GV chấm độc lập 2" } });
  }

  // ─────────────── CRM & Website ───────────────
  console.log("🌐 Lead, blog, cấu hình website...");
  const leadSamples = [
    { name: "Nguyễn Thị Hoa", phone: "0911222333", role: "PARENT", grade: "6", province: "An Giang", source: "HOME_FORM", status: "NEW", message: "Con tôi lớp 6, hơi nhút nhát khi nói." },
    { name: "Trần Văn Lực", phone: "0911222444", role: "SCHOOL", orgName: "THCS Bình Đức", province: "An Giang", source: "SCHOOL_DEMO", status: "CONTACTED", message: "Trường muốn đăng ký thí điểm 2 lớp." },
    { name: "Lê Minh Châu", phone: "0911222555", role: "STUDENT", grade: "7", province: "An Giang", source: "PLACEMENT_TEST", status: "TRIAL", message: "Kết quả test: A1" },
    { name: "Phạm Thu Trang", phone: "0911222666", role: "COMPANY", orgName: "Homestay Hà Tiên Xanh", province: "Kiên Giang (An Giang mới)", source: "CONTACT", status: "WON", message: "Cần khoá English Career cho 8 nhân viên." },
    { name: "Võ Thị Mỹ", phone: "0911222777", role: "PARENT", grade: "7", province: "Cần Thơ", source: "HOME_FORM", status: "LOST" },
    { name: "Đặng Hoàng Nam", phone: "0911222888", role: "TEACHER", orgName: "THCS Phú Hoà", province: "An Giang", source: "SCHOOL_DEMO", status: "NEW" },
  ];
  for (const [i, l] of leadSamples.entries()) await db.lead.create({ data: { ...l, createdAt: days(-i * 2) } });

  const posts = [
    { slug: "15-phut-moi-ngay-hoc-tieng-anh-hieu-qua", title: "Vì sao 15 phút mỗi ngày hiệu quả hơn 2 giờ cuối tuần?", category: "Mẹo học", cover: "/images/hero.jpg", excerpt: "Học ngắn, đều đặn giúp não ghi nhớ lâu hơn. Cùng tìm hiểu cách thiết kế buổi học 15 phút của MEKONG English AI.",
      content: "## Học ít mà đều\n\nNghiên cứu về **lặp lại ngắt quãng** cho thấy ôn tập ngắn, đều đặn giúp ghi nhớ lâu hơn so với học dồn.\n\n## Buổi học 15 phút gồm gì?\n\n- **2 phút ôn lại** từ và mẫu câu còn yếu\n- **3 phút xem và nghe** một hình ảnh hoặc hội thoại ngắn\n- **6 phút luyện nói với AI** theo nhiệm vụ\n- **3 phút sửa lỗi và nói lại**\n- **1 phút xem kết quả**\n\n## Mẹo cho phụ huynh\n\nHãy cùng con chọn một khung giờ cố định mỗi ngày, ví dụ sau bữa tối." },
    { slug: "gioi-thieu-tra-su-bang-tieng-anh", title: "Giới thiệu Rừng tràm Trà Sư bằng tiếng Anh – mẫu câu cho học sinh", category: "Tiếng Anh về An Giang", cover: "/images/tra-su.jpg", excerpt: "Những mẫu câu đơn giản giúp em tự tin giới thiệu Trà Sư với bạn bè quốc tế.",
      content: "## Từ vựng cần nhớ\n\n- cajeput forest – rừng tràm\n- boat – xuồng\n- bird – chim\n\n## Mẫu câu\n\n> You should visit Tra Su Cajeput Forest. It is in An Giang province. You can go by boat and see many birds.\n\nHãy thử luyện nói tình huống này với gia sư AI trong ứng dụng nhé!" },
    { slug: "khai-mac-thi-diem-2026", title: "MEKONG English AI khởi động thí điểm tại 4 trường THCS An Giang", category: "Tin tức", cover: "/images/classroom.jpg", excerpt: "Đợt thí điểm 12 tuần nhằm đo lường hiệu quả luyện nói và khả năng vận dụng của học sinh lớp 6–7.",
      content: "## Mục tiêu thí điểm\n\n- Ít nhất **85%** học sinh tự mở và bắt đầu bài sau một lần hướng dẫn\n- Ít nhất **65%** học sinh hoàn thành tối thiểu 3 buổi/tuần trong 8/12 tuần\n- Đánh giá nói trước – sau, chấm độc lập\n\n*Các chỉ tiêu là mục tiêu đề xuất, chưa phải kết quả đã được chứng minh.*" },
  ];
  for (const [i, p] of posts.entries()) await db.post.create({ data: { ...p, status: "PUBLISHED", publishedAt: days(-i * 5), views: 300 - i * 70, seoTitle: p.title, seoDesc: p.excerpt } });

  await db.testimonial.createMany({ data: [
    { name: "Chị Lâm Thị Thu", role: "Phụ huynh học sinh lớp 6 – Long Xuyên", avatar: "/images/parent-report.jpg", content: "Con tôi trước rất ngại nói. Giờ tối nào cũng tự mở app luyện 15 phút, cuối tuần còn giới thiệu Núi Sam cho cả nhà nghe bằng tiếng Anh.", order: 1 },
    { name: "Cô Nguyễn Thị Mai", role: "Giáo viên tiếng Anh – THCS Mỹ Hoà Hưng", avatar: "/images/classroom.jpg", content: "Tôi biết ngay em nào chưa học, lớp đang sai lỗi gì để chữa ở tiết sau. Phần nhiệm vụ thực tế giúp các em vận dụng chứ không chỉ học thuộc.", order: 2 },
    { name: "Lâm Gia Bảo", role: "Học sinh lớp 6A1", avatar: "/images/hero.jpg", content: "Em thích luyện nói với AI vì không sợ bị cười khi nói sai. AI chỉ sửa 1–2 lỗi nên em dễ nhớ.", order: 3 },
    { name: "Anh Phạm Văn Đức", role: "Lễ tân khách sạn – Châu Đốc", avatar: "/images/career.jpg", content: "Các tình huống đón khách, giới thiệu tour Trà Sư rất sát công việc. Tôi dùng được ngay ngày hôm sau.", order: 4 },
  ] });

  await db.faq.createMany({ data: [
    { question: "Con tôi mất gốc có học được không?", answer: "Được. Gia sư AI bắt đầu với mức trợ giúp cao nhất: nghe mẫu, từ gợi ý và khung câu. Khi con làm tốt, trợ giúp giảm dần.", category: "Học tập", order: 1 },
    { question: "Mỗi ngày học bao lâu?", answer: "Chỉ 15 phút cho một buổi học hoàn chỉnh: ôn lại – xem & nghe – luyện nói với AI – sửa lỗi – xem kết quả.", category: "Học tập", order: 2 },
    { question: "Không có mạng mạnh có học được không?", answer: "Có. Bài nghe, hình ảnh, bài tập được tải trước. Bài nói được lưu lại và tự gửi khi có mạng.", category: "Kỹ thuật", order: 3 },
    { question: "Luyện nói trực tiếp với giáo viên tính phí thế nào?", answer: "Live Speaking là dịch vụ trả thêm, mua lẻ theo buổi hoặc theo gói 4/12 buổi. Mỗi buổi 25 phút, 1-1 hoặc nhóm nhỏ 3–5 bạn.", category: "Học phí", order: 4 },
    { question: "Dữ liệu giọng nói của con được bảo vệ ra sao?", answer: "Bản ghi âm chỉ được thu thập khi phụ huynh đồng ý, có phân quyền truy cập và thời hạn lưu trữ rõ ràng theo Nghị định 13/2023/NĐ-CP. Phụ huynh có thể yêu cầu xoá bất cứ lúc nào.", category: "Bảo mật", order: 5 },
    { question: "Trường muốn đăng ký thí điểm thì làm thế nào?", answer: "Nhà trường để lại thông tin tại trang Dành cho Nhà trường. Chúng tôi sẽ liên hệ khảo sát, tập huấn giáo viên và triển khai đợt học 12 tuần.", category: "Nhà trường", order: 6 },
  ] });

  await db.mediaAsset.createMany({ data: [
    { title: "Rừng tràm Trà Sư – minh hoạ", type: "IMAGE", url: "/images/tra-su.jpg", topic: "Du lịch An Giang", source: "Tự sản xuất (AI minh hoạ)", license: "Thuộc sở hữu Mekong Green AI", verified: true, verifiedBy: "Cô Nguyễn Thị Mai" },
    { title: "Chợ nổi Long Xuyên – minh hoạ", type: "IMAGE", url: "/images/cho-noi.jpg", topic: "Chợ & mua sắm", source: "Tự sản xuất (AI minh hoạ)", license: "Thuộc sở hữu Mekong Green AI", verified: true, verifiedBy: "Cô Nguyễn Thị Mai" },
    { title: "Núi Sam & Miếu Bà Chúa Xứ", type: "IMAGE", url: "/images/nui-sam.jpg", topic: "Du lịch An Giang", source: "SmartTourism AI", license: "Được phép khai thác nội bộ", verified: false },
    { title: "Đường thốt nốt Tri Tôn (OCOP 4 sao)", type: "STORY", content: "Đường thốt nốt được nấu từ nước hoa thốt nốt, là sản phẩm OCOP nổi tiếng của vùng Bảy Núi.", topic: "Sản phẩm OCOP", source: "TraceHub", license: "Được phép khai thác nội bộ", verified: false },
  ] });

  await db.auditLog.create({ data: { userId: admin.id, action: "SEED", entity: "System", detail: "Khởi tạo dữ liệu mẫu" } });

  console.log("✅ Hoàn tất! Đăng nhập admin: admin@mekong.ai / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
