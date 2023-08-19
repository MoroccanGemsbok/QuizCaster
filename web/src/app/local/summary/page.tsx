"use client";

import { BackButton } from "@/components/BackButton";
import { useCurrentQuiz } from "@/contexts/QuizContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// @ts-ignore
import ReactMarkdown from "react-markdown";


export default function Page() {
  const router = useRouter();
  const currentQuiz = useCurrentQuiz();

  useEffect(() => {
    return () => {
      // @ts-ignore
      if (window.pywebview) {
        // @ts-ignore
        window.pywebview.api.narrate_stop()
      }
    }
  }, []);

  return (
    <div className="flex flex-1 bg-emerald-900 flex-col justify-center items-center gap-8">
      <BackButton />
      <div className="flex flex-col gap-2 items-center">
        <h1>Summary</h1>
        <h2>Let's review the material first!</h2>
      </div>
      <div className="bg-emerald-800 w-[700px] h-[360px] rounded-lg overflow-auto scrollbar-thin
        scrollbar-thumb-emerald-600 scrollbar-track-transparent scrollbar-thumb-rounded-full list-disc">
        <ReactMarkdown
          className="prose prose-invert leading-5 text-white marker:text-white m-12 mr-0"
          children={currentQuiz.summary} />
      </div>

      <div className="flex gap-4">
        <button
          className={`py-3 px-8 rounded-full font-semibold ${currentQuiz.audioMode ? "bg-green-600" : "bg-red-600"}`}
          onClick={async () => {
            currentQuiz.setAudioMode(!currentQuiz.audioMode)
            // @ts-ignore
            if (currentQuiz.audioMode && window.pywebview) {
              // @ts-ignore
              await window.pywebview.api.narrate_stop()
              // @ts-ignore
              await window.pywebview.api.narrate_start(currentQuiz.summary.replace(/^#*/gm, ""))
            }
          }}
        >
          {currentQuiz.audioMode ? "Disable narration" : "Enable narration"}
        </button>

        <button
          className="bg-sky-600 py-3 px-8 rounded-full font-semibold"
          onClick={() => router.push("/local/quiz/1")}
        >
          I'm ready, quiz me!
        </button>
      </div>
    </div>
  )
}
