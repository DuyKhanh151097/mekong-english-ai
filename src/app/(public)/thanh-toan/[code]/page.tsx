import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatVnd, parseJson } from "@/lib/utils";
import { CheckoutForm } from "./CheckoutForm";

export default async function CheckoutPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const [plan, user] = await Promise.all([
    db.plan.findUnique({ where: { code } }),
    getCurrentUser(),
  ]);
  if (!plan) notFound();

  const feats = parseJson<string[]>(plan.featuresJson, []);

  return (
    <div className="py-12">
      <div className="container max-w-4xl grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <CheckoutForm
            planId={plan.id}
            defaultName={user?.name}
            defaultPhone={user?.phone}
            defaultEmail={user?.email}
          />
        </div>

        <div className="lg:col-span-5">
          <div className="card space-y-4 p-6">
            <span className="badge badge-green">Gói đã chọn</span>
            <h1 className="text-xl font-extrabold">{plan.name}</h1>
            <p className="text-xs text-slate-600">{plan.description}</p>
            <div className="border-y border-slate-100 py-3">
              <div className="text-2xl font-extrabold text-brand-700">{formatVnd(plan.salePrice ?? plan.price)}</div>
              {plan.salePrice && (
                <div className="text-xs text-slate-400 line-through">Giá gốc: {formatVnd(plan.price)}</div>
              )}
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {feats.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
