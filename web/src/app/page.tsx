"use client";

import axios from "axios";
// @ts-ignore
import { useCurrentQuiz } from "../contexts/QuizContext.tsx";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [currentFileName, setCurrentFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const quizData = useCurrentQuiz();
  const router = useRouter();
  const [uuidSearch, setUuidSearch] = useState("");
  const [uuidError, setUuidError] = useState<string | null>(null);
  const [uuidLoading, setUuidLoading] = useState(false);

  const containerClass =
    "bg-slate-700 w-[700px] p-6 rounded-xl flex flex-col gap-4";

  async function handleGoClick() {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/addQuiz", quizData);
      console.log(response.data.uuid);
      router.push(`/local/summary?uuid=${response.data.uuid}`);
      setIsLoading(false);
    } catch (error) {
      console.error("Error saving quiz:", error);
      setIsLoading(false);
    }
  }

  function handleUuidChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUuidSearch(event.target.value);
  }

  async function handleUuidSubmit() {
    setUuidLoading(true);
    try {
      const response = await axios.get(`/api/checkUuid?uuid=${uuidSearch}`);

      if (response.data.exists) {
        router.push(`/local/summary?uuid=${uuidSearch}`);
      } else {
        setUuidError("This task does not exist. Please try again.");
      }
      setUuidLoading(false);
    } catch (error) {
      console.error("Error fetching UUID:", error);
      setUuidError("An error occurred. Please try again.");
      setUuidLoading(false);
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setCurrentFileName(selectedFile.name);
      const reader = new FileReader();
      reader.onload = async(event: ProgressEvent<FileReader>) => {
        const exts = selectedFile.name.split('.')
        const filetype = exts[exts.length - 1]
        let rawString;
        setIsParsingFile(true);
        if (filetype === "pdf") {
          rawString = event.target?.result?.toString()?.split(',')[1];
        } else if (filetype === "md") {
          rawString = await selectedFile.text();
        }
        if (rawString) {
          // @ts-ignore
          const grouped_text_summary = await window.pywebview.api.get_grouped_text(rawString, filetype, 50);
          // @ts-ignore
          const grouped_text_quiz = await window.pywebview.api.get_grouped_text(rawString, filetype, 5);
          // @ts-ignore
          const summary = await window.pywebview.api.return_summary(grouped_text_summary);
          // @ts-ignore
          const quiz = await window.pywebview.api.return_quiz(grouped_text_quiz);
          quizData.setSummary(summary);
          quizData.setQuestions(quiz);
          setIsParsingFile(false);
        }

      };
      reader.readAsDataURL(selectedFile);
    }
  }

  return (
    <div className="flex flex-1 bg-slate-800 justify-center items-center">
      <div className="flex flex-col gap-8">
        <div className="flex flex-row justify-between">
          <div>
            <h1>QuizCaster</h1>
            <p className="text-md font-extralight">
              Your intelligent personal quiz assistant
            </p>
          </div>
          <button
            className={`text-2xl py-2 px-6 rounded-full font-semibold ${
              isLoading || isParsingFile ? "bg-gray-400" : "bg-emerald-600"
            }`}
            onClick={handleGoClick}
            disabled={isLoading || isParsingFile}
          >
            {isLoading ? "Loading..." : isParsingFile ? "Loading file..." : "Go"}
          </button>
        </div>

        <div className={containerClass}>
          <h2>Start with a website:</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="https://"
              className="flex-1 text-black outline-0 py-2 px-4 rounded-xl truncate"
            />
          </div>
        </div>

        <div className={containerClass}>
          <h2>Or start with a file:</h2>
          <input
            accept=".md, .pdf"
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="bg-slate-600 rounded-xl h-36 cursor-pointer flex flex-col justify-center items-center
                      text-slate-400"
          >
            <p>Click to select a markdown or PDF file (md, pdf)</p>
            <p>
              Selected file:{" "}
              <span className="font-semibold text-slate-300">
                {currentFileName
                  ? currentFileName.replace(/\w:\\fakepath\\/gm, "")
                  : "No file selected"}
              </span>
            </p>
          </label>
        </div>

        <div className={containerClass}>
          <h2>Search with a Task ID:</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={uuidSearch}
              onChange={handleUuidChange}
              placeholder="Enter Task ID"
              className="flex-1 text-black outline-0 py-2 px-4 rounded-xl"
            />
            <button
              onClick={handleUuidSubmit}
              disabled={isLoading}
              className="py-2 px-4 bg-emerald-600 rounded-xl"
            >
              {uuidLoading ? "Loading..." : "Submit"}
            </button>
          </div>
          {uuidError && <p className="text-red-600 mt-2">{uuidError}</p>}
        </div>
      </div>
    </div>
  );
}
