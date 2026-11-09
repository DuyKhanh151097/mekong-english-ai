import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Blog – Mẹo học tiếng Anh & Tin tức thí điểm An Giang" };

export default async function BlogListPage() {
  const posts = await db.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="py-12">
      <div className="container space-y-8">
        <div>
          <span className="eyebrow">📰 Góc học tập & Tin tức</span>
          <h1 className="text-3xl font-extrabold md:text-4xl">Blog MEKONG English AI</h1>
          <p className="mt-2 text-slate-600">
            Mẹo học 15 phút mỗi ngày, mẫu câu giới thiệu quê hương An Giang bằng tiếng Anh và tin tức triển khai thí điểm.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="card card-hover flex flex-col overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.cover || "/images/tra-su.jpg"} alt={p.title} className="h-48 w-full object-cover" />
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <span className="badge badge-green">{p.category}</span>
                  <h2 className="mt-2 text-lg font-extrabold">{p.title}</h2>
                  <p className="mt-1.5 text-sm text-slate-600">{p.excerpt}</p>
                </div>
                <div className="mt-4 text-xs text-slate-400">
                  {formatDate(p.publishedAt || p.createdAt)} · {p.views} lượt xem
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
