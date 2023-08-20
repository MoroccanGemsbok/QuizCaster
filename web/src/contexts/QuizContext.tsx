import { createContext, useContext } from "react";

export type Question = {
  question: string;
  format: "MC" | "TF";
  options: string[];
  answer: number
}

export type Quiz = {
  audioMode: boolean;
  setAudioMode: (audioMode: boolean) => void;
  summary: string;
  setSummary: (summary: string) => void;
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
}

const CurrentQuizContext = createContext<Quiz>({
  audioMode: false,
  setAudioMode: (_: boolean) => {},
  summary: "",
  setSummary: (_: string) => {},
  questions: [],
  setQuestions: (_: Question[]) => {},
});

export const CurrentQuizProvider = CurrentQuizContext.Provider;
export const useCurrentQuiz = () => useContext(CurrentQuizContext);
