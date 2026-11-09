"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Nút submit hiển thị trạng thái đang xử lý (dùng trong <form action={serverAction}>) */
export function SubmitButton({
  children,
  className,
  pendingText = "Đang xử lý...",
}: {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={cn("btn btn-primary", className)}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> {pendingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function FormMessage({ state }: { state?: { error?: string; ok?: string } }) {
  if (!state?.error && !state?.ok) return null;
  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl px-4 py-3 text-sm",
        state.error ? "bg-red-50 text-red-700" : "bg-brand-50 text-brand-700"
      )}
    >
      {state.error || state.ok}
    </div>
  );
}
