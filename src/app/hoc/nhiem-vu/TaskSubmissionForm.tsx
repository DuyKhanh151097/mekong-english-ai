"use client";

import { useActionState, useState } from "react";
import { Mic, Send } from "lucide-react";
import { submitRealTaskAction } from "@/lib/learner-actions";
import { FormMessage, SubmitButton } from "@/components/SubmitButton";

export function TaskSubmissionForm({
  taskId,
  placeholder,
}: {
  taskId: string;
  placeholder: string;
}) {
  const [state, action] = useActionState(submitRealTaskAction, undefined);
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);

  function handleMic() {
    if (typeof window === "undefined") return;
    const W = window as unknown as {
      SpeechRecognition?: new () => {
        lang: string;
        onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
        onend: () => void;
        start: () => void;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
        onend: () => void;
        start: () => void;
      };
    };
    const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SR) {
      setText(
        "My school is My Hoa Hung Secondary School in Long Xuyen, An Giang. It has many green trees and friendly teachers. I love my school very much."
      );
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    setListening(true);
    rec.onresult = (e) => {
      const t = e.results[0]?.[0]?.transcript || "";
      setText((p) => (p ? `${p} ${t}` : t));
    };
    rec.onend = () => setListening(false);
    rec.start();
  }

  return (
    <form action={action} className="space-y-3">
      <FormMessage state={state} />
      <input type="hidden" name="taskId" value={taskId} />
      <textarea
        name="transcript"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="textarea"
        rows={3}
        placeholder={placeholder}
        required
      />
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={handleMic} className="btn btn-sm btn-secondary">
          <Mic className="h-4 w-4" />
          {listening ? "Đang ghi âm..." : "Bấm ghi âm giọng nói / Điền mẫu"}
        </button>
        <SubmitButton className="btn-sm" pendingText="Đang nộp bài...">
          <Send className="h-4 w-4" /> Nộp nhiệm vụ thực tế
        </SubmitButton>
      </div>
    </form>
  );
}
