"use client";

import { useState } from "react";
import { BackButton } from "@/components/BackButton";
import { useCurrentQuiz } from "@/contexts/QuizContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
// @ts-ignore
import ReactMarkdown from "react-markdown";


export default function Page() {
  const router = useRouter();
  const currentQuiz = useCurrentQuiz();
  const { questions, setQuestions } = useCurrentQuiz();
  const searchParams = useSearchParams();
  const search = searchParams?.get('uuid');
  const [sliderValue, setSlidervalue] = useState(3);

  useEffect(() => {
    return () => {
      // @ts-ignore
      if (window.pywebview) {
        // @ts-ignore
        window.pywebview.api.narrate_stop()
      }
    }
  }, []);

  function handleSliderChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log("setting quiz length to", sliderValue);
    setSlidervalue(parseInt(event.target.value));
  }

  return (
    <div className="flex flex-1 bg-emerald-900 flex-col justify-center items-center gap-8">
      <BackButton />
      <div className="flex flex-col gap-2 items-center">
        <h1>Summary</h1>
        <h2>Let's review the material first!</h2>
        <button
          onClick={() => {
            const tempInput = document.createElement('textarea');
            tempInput.value = search || ""
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
          }}
        >
          Task ID: {search} (Click to copy)
        </button>
      </div>
      <div className="bg-emerald-800 w-[700px] h-[360px] rounded-lg overflow-auto scrollbar-thin
        scrollbar-thumb-emerald-600 scrollbar-track-transparent scrollbar-thumb-rounded-full list-disc">
        <ReactMarkdown
          className="prose prose-invert leading-5 text-white marker:text-white m-12 mr-0"
          children={currentQuiz.summary} />
      </div>
      
      <div className="flex gap-4">
        <button
          className={`py-3 px-8 rounded-3xl font-semibold ${currentQuiz.audioMode ? "bg-green-600" : "bg-red-600"}`}
          onClick={async () => {
            currentQuiz.setAudioMode(!currentQuiz.audioMode)
            // @ts-ignore
            await window.pywebview.api.narrate_stop()
            // @ts-ignore
            if (!currentQuiz.audioMode && window.pywebview) {
              // @ts-ignore
              await window.pywebview.api.narrate_start(currentQuiz.summary.replace(/^#*/gm, ""))
            }
          }}
        >
          {currentQuiz.audioMode ? "Disable narration" : "Enable narration"}
        </button>
        
        <div className={`bg-black-600 py-3 px-8 rounded-full font-semibold`}>
        <div className={`flex flex-col items-center gap-4 mb-4`}>
        <label htmlFor="slider">Quiz Length: {sliderValue}</label>
        <input 
          type="range" 
          id="slider" 
          name="slider"
          min="1" 
          max="50"
          value={sliderValue}
          onChange={handleSliderChange}
          className="slider"
        />
        </div>
        <button
          className="bg-sky-600 py-3 px-8 rounded-full font-semibold"
          onClick={() => {
            const truncatedQuestions = questions.slice(0, sliderValue);
            setQuestions(truncatedQuestions);
            console.log("truncated questions", truncatedQuestions);
            router.push("/local/quiz/1")
          }}
        >
          I'm ready, quiz me!
        </button>
      </div>
      </div>
    </div>
  )
}
