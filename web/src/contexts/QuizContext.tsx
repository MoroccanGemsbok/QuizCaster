import { createContext, useContext } from "react";

type Question = {
  question: string;
  format: "MC" | "TF";
  options: string[];
  answer: number
}

type Quiz = {
  summary: string;
  questions: Question[];
}

const tmpSummary = `
## About
Hololive Production, or simply known as hololive, is a Virtual Talent agency consisting of Virtual YouTubers owned by Japanese tech entertainment company COVER Corporation.

## Hololive English -Council-
Council currently has 4 members:
- Ceres Fauna
- Ouro Kronii
- Nanashi Mumei (Brasen's oshi)
- Hakos Baelz

PLAP PLAP PLAP
`

const CurrentQuizContext = createContext<Quiz>({
  summary: tmpSummary,
  questions: [
    {
      question: "Who is Brasen's oshi?",
      format: "MC",
      options: ["Hakos Baelz", "Ceres Fauna", "Ouro Kronii", "Nanashi Mumei"],
      answer: 3
    },
    {
      question: "Is Gawr Gura a member of Hololive English -Council-?",
      format: "TF",
      options: ["True", "False"],
      answer: 1
    }
  ]
});

export const CurrentQuizProvider = CurrentQuizContext.Provider;
export const useCurrentQuiz = () => useContext(CurrentQuizContext);
