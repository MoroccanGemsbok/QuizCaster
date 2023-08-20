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
  const [isParsingUrl, setIsParsingUrl] = useState(false);
  const quizData = useCurrentQuiz();
  const router = useRouter();
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [urlValid, setUrlValid] = useState(false);
  const [uuidSearch, setUuidSearch] = useState("");
  const [uuidError, setUuidError] = useState<string | null>(null);
  const [uuidLoading, setUuidLoading] = useState(false);

  const containerClass =
    "bg-slate-700 w-[700px] p-6 rounded-xl flex flex-col gap-4";

  function isValidURL(string: string | URL) {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
  }
  
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

  async function handleUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
    const inputUrl = event.target.value;
    setUrlInput(inputUrl);
  }

  async function handleUrlSubmit() {
    if (!isValidURL(urlInput)) {
      setUrlError("Please enter a valid URL.");
      return;
    }
    
    setIsParsingUrl(true);
    //

    const link = urlInput;

        if (link.includes("youtube")) {
          const youtube_id = link.split("v=")[1];
          // @ts-ignore
          const grouped_text_summary =
          //@ts-ignore
            await window.pywebview.api.get_grouped_text(
              youtube_id,
              "youtube",
              50
            );
          // @ts-ignore
          const grouped_text_quiz = await window.pywebview.api.get_grouped_text(
            youtube_id,
            "youtube",
            5
          );
          // @ts-ignore
          const summary = await window.pywebview.api.return_summary(
            grouped_text_summary
          );
          // @ts-ignore
          const quiz = await window.pywebview.api.return_quiz(
            grouped_text_quiz
          );

          await quizData.setSummary(summary);
          await quizData.setQuestions(quiz);
        } else {
          const grouped_text_summary =
          //@ts-ignore
            await window.pywebview.api.get_grouped_text(
              link,
              "website",
              50
            );
          // @ts-ignore
          const grouped_text_quiz = await window.pywebview.api.get_grouped_text(
            link,
            "website",
            5
          );
          // @ts-ignore
          const summary = await window.pywebview.api.return_summary(
            grouped_text_summary
          );
          // @ts-ignore
          const quiz = await window.pywebview.api.return_quiz(
            grouped_text_quiz
          );

          await quizData.setSummary(summary);
          await quizData.setQuestions(quiz);
        }
  

    
    try {
      const response = await axios.post("/api/addQuiz", quizData);
      console.log(response.data);
      router.push(`/local/summary?uuid=${response.data.uuid}`);
      setIsParsingUrl(false);
    } catch (error) {
      console.error("Error saving quiz:", error);
      setIsParsingUrl(false);
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
        const summary = response.data.summary;
        const quiz = response.data.questions;
        quizData.setSummary(summary);
        quizData.setQuestions(quiz);

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
      reader.onload = async (event: ProgressEvent<FileReader>) => {
        const base64String = event.target?.result?.toString()?.split(",")[1];
        setIsParsingFile(true);
        if (base64String) {
          // @ts-ignore
          const grouped_text_summary =
            //@ts-ignore
            await window.pywebview.api.get_grouped_text(
              base64String,
              "pdf",
              50
            );
          // @ts-ignore
          const grouped_text_quiz = await window.pywebview.api.get_grouped_text(
            base64String,
            "pdf",
            5
          );
          // @ts-ignore
          const summary = await window.pywebview.api.return_summary(
            grouped_text_summary
          );
          // @ts-ignore
          const quiz = await window.pywebview.api.return_quiz(
            grouped_text_quiz
          );

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
            <h1>
              <span className="text-emerald-600">Quiz</span>
              Caster
            </h1>
            <p className="text-md font-extralight">
              Your intelligent personal quiz assistant.
            </p>
          </div>
          <button
            className={`text-2xl py-2 px-6 rounded-full font-semibold ${
              isLoading || isParsingFile || !currentFileName
                ? "bg-gray-400"
                : "bg-emerald-600"
            }`}
            onClick={handleGoClick}
            disabled={isLoading || isParsingFile || !currentFileName}
          >
            {isLoading ? "Loading..." : isParsingFile ? "Loading PDF..." : "Go"}
          </button>
        </div>

        <div className={containerClass}>
          <h2>Start with a website or YouTube link:</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="https://"
              value={urlInput}
              disabled={isParsingUrl}
              onChange={handleUrlChange}
              className="flex-1 text-black outline-0 py-2 px-4 rounded-xl truncate"
            />

            <button
              onClick={handleUrlSubmit}
              disabled={isLoading || isParsingUrl}
              className={`py-2 px-4 ${
                isParsingUrl ? "bg-gray-400" : "bg-emerald-600"
              } rounded-xl`}
            >
              {isParsingUrl ? "Loading..." : "Submit"}
            </button>
          </div>
          {urlError && <p className="text-red-600 mt-2">{urlError}</p>}
        </div>

        <div className={containerClass}>
          <h2>Upload a file:</h2>
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
              disabled={isLoading || uuidLoading}
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
