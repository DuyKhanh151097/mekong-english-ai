import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.post.findUnique({ where: { slug } });
  if (!post) notFound();

  return (
    <div className="py-12">
      <div className="container max-w-3xl space-y-6">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Quay lại Blog
        </Link>
        <div className="card overflow-hidden p-6 md:p-10 space-y-4">
          <span className="badge badge-green">{post.category}</span>
          <h1 className="text-2xl font-extrabold md:text-4xl">{post.title}</h1>
          <div className="text-xs text-slate-500">
            Đăng ngày {formatDate(post.publishedAt || post.createdAt)} · Tác giả: {post.author}
          </div>
          {post.cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.cover} alt={post.title} className="max-h-80 w-full rounded-2xl object-cover" />
          )}
          <div className="prose max-w-none whitespace-pre-line text-slate-700 leading-relaxed">
            {post.content}
          </div>
        </div>
      </div>
    </div>
  );
}
