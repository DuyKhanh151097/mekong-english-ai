import Link from "next/link";
import { cn } from "@/lib/utils";

/** Logo thương hiệu MEKONG English AI */
export function Logo({
  className,
  light = false,
  href = "/",
  showTagline = true,
}: {
  className?: string;
  light?: boolean;
  href?: string;
  showTagline?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2.5 shrink-0 select-none whitespace-nowrap", className)}
      aria-label="MEKONG English AI – Trang chủ"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-mekong text-white shadow-sm">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
          <path d="M8 13c2-3 6-3 8 0" />
        </svg>
      </span>
      <span className="leading-tight shrink-0 whitespace-nowrap block">
        <span
          className={cn(
            "block text-[15px] font-extrabold tracking-tight whitespace-nowrap leading-none",
            light ? "text-white" : "text-ink"
          )}
        >
          MEKONG <span className={light ? "text-rice-400" : "text-brand-600"}>English</span> AI
        </span>
        {showTagline && (
          <span
            className={cn(
              "mt-1 hidden sm:block text-[10px] font-medium whitespace-nowrap leading-none",
              light ? "text-white/75" : "text-slate-500"
            )}
          >
            Học gần gũi – Nói tự tin
          </span>
        )}
      </span>
    </Link>
  );
}
