"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { joinClassAction } from "@/lib/auth-actions";
import { FormMessage, SubmitButton } from "@/components/SubmitButton";

type Detector = { detect: (src: HTMLVideoElement) => Promise<Array<{ rawValue: string }>> };

/** Nhập mã lớp hoặc quét QR (dùng BarcodeDetector nếu trình duyệt hỗ trợ; QR chứa link /vao-lop?code=...) */
export function JoinForm({ initialCode }: { initialCode?: string }) {
  const [state, action] = useActionState(joinClassAction, undefined);
  const [code, setCode] = useState(initialCode || "");
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!scanning) return;
    let stream: MediaStream | null = null;
    let stop = false;
    const W = window as unknown as { BarcodeDetector?: new (o: { formats: string[] }) => Detector };
    (async () => {
      if (!W.BarcodeDetector) {
        setScanError("Trình duyệt chưa hỗ trợ quét QR. Hãy dùng ứng dụng Camera của điện thoại để quét, hoặc nhập mã lớp.");
        setScanning(false);
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        const detector = new W.BarcodeDetector({ formats: ["qr_code"] });
        const loop = async () => {
          if (stop || !videoRef.current) return;
          const codes = await detector.detect(videoRef.current).catch(() => []);
          if (codes.length) {
            const raw = codes[0].rawValue;
            const m = raw.match(/code=([A-Za-z0-9]+)/);
            setCode((m ? m[1] : raw).toUpperCase());
            setScanning(false);
            return;
          }
          requestAnimationFrame(loop);
        };
        loop();
      } catch {
        setScanError("Không mở được camera. Vui lòng cho phép quyền camera hoặc nhập mã lớp.");
        setScanning(false);
      }
    })();
    return () => {
      stop = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [scanning]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <FormMessage state={state ?? (scanError ? { error: scanError } : undefined)} />
      <div>
        <label className="label" htmlFor="code">Mã lớp</label>
        <input
          id="code"
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="input h-16 text-center text-2xl font-bold uppercase tracking-[0.3em]"
          placeholder="AG6A01"
          maxLength={10}
          autoComplete="off"
          required
        />
      </div>
      {scanning ? (
        <div className="relative overflow-hidden rounded-2xl bg-black">
          <video ref={videoRef} className="aspect-square w-full object-cover" muted playsInline />
          <div className="pointer-events-none absolute inset-10 rounded-2xl border-4 border-white/80" />
          <button type="button" onClick={() => setScanning(false)} className="btn btn-sm absolute right-2 top-2 bg-white/90">
            <X className="h-4 w-4" /> Đóng
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => { setScanError(""); setScanning(true); }} className="btn btn-outline w-full">
          <Camera className="h-4 w-4" /> Quét mã QR
        </button>
      )}
      <SubmitButton className="btn-lg w-full" pendingText="Đang vào lớp...">Vào lớp</SubmitButton>
    </form>
  );
}
