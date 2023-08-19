"use client";

import { useCurrentQuiz } from "@/contexts/QuizContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Params = {
  params: {
    questionNumber: string;
  }
}

export default function Page({ params }: Params) {

  const questionNumber = Number(params.questionNumber);
  const currentQuiz = useCurrentQuiz();
  if (isNaN(questionNumber) || questionNumber < 1 || questionNumber > currentQuiz.questions.length) return null;

  const currentQuestion = currentQuiz.questions[questionNumber - 1];
  const [answer, setAnswer] = useState<number>(0);
  const [state, setState] = useState<"MC" | "TF" | "Answer">(currentQuestion.format);
  const isAnswerCorrect = answer === currentQuestion.answer;
  const isLastQuestion = questionNumber === currentQuiz.questions.length;
  const router = useRouter();

  useEffect(() => {
    // @ts-ignore
    window.pywebview.api.question_set(currentQuestion)
  }, []);

  return (
    <div className="flex flex-1 flex-col bg-slate-800 items-center">
      <div className="absolute top-2 left-2 font-mono">
        {questionNumber} of {currentQuiz.questions.length}
      </div>
      <h1 className="m-8 text-3xl text-center">
        {currentQuestion.question}
      </h1>
      <div className="h-1 bg-gray-300 w-full">
        <div className="h-1 bg-sky-300" style={{ width: `${50}%` }} />
      </div>

      {state === "MC" && (
        <div className="grid grid-cols-2 grid-rows-2 w-full h-full p-16 gap-16">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`flex justify-center items-center rounded-3xl cursor-pointer 
                ${["bg-red-600", "bg-green-700", "bg-blue-500", "bg-amber-600"][index]}`}
              onClick={() => {
                setAnswer(index);
                setState("Answer");
              }}>
              <p className="text-2xl p-8">
                {option}
              </p>
            </div>
          ))}
        </div>)}

      {state === "TF" && (
        <div className="grid grid-cols-2 grid-rows-1 w-full h-full p-16 gap-16">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`flex justify-center items-center rounded-3xl cursor-pointer 
                ${["bg-green-700", "bg-red-600"][index]}`}
              onClick={() => {
                setAnswer(index);
                setState("Answer");
              }}>
              <p className="text-2xl p-8">
                {option}
              </p>
            </div>
          ))}
        </div>
      )}

      {state === "Answer" && (
        <div className="flex flex-col w-full h-full p-16 gap-4 justify-center items-center">
          <div className="flex gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" height="96" viewBox="0 -960 960 960" width="96"
                 fill={isAnswerCorrect ? "rgb(22 163 74)" : "rgb(220 38 38)"}>
              {isAnswerCorrect
                ? <path d="m421-298 283-283-46-45-237 237-120-120-45 45 165 166Zm59 218q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/>
                : <path d="m330-288 150-150 150 150 42-42-150-150 150-150-42-42-150 150-150-150-42 42 150 150-150 150 42 42ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/>
              }
            </svg>
            <p className="text-8xl font-extralight">
              {answer === currentQuestion.answer ? "Correct!" : "Incorrect!"}
            </p>
          </div>
          <p className="text-xl">
            The answer is: {currentQuestion.options[currentQuestion.answer]}
          </p>
          <button
            className="bg-sky-600 py-3 px-8 rounded-full font-semibold mt-8"
            onClick={() => router.push(isLastQuestion ? "/" : `/local/quiz/${questionNumber + 1}`)}
          >
            {isLastQuestion ? "Return Home" : "Next Question"}
          </button>
        </div>
      )}

    </div>
  )
}
