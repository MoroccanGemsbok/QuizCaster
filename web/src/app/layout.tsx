"use client";

import './globals.css'
import { CurrentQuizProvider, Question } from "@/contexts/QuizContext";
import type { Metadata } from 'next'
import { Roboto_Flex } from 'next/font/google'
import { ReactNode, useState } from "react";

const font = Roboto_Flex({ subsets: ['latin'] })

type Props = {
  children: ReactNode;
}

const tmpSummary = `
## About
Hololive Production, or simply known as hololive, is a Virtual Talent agency consisting of Virtual YouTubers owned by Japanese tech entertainment company COVER Corporation.

## Hololive English Council
Council currently has 4 members:
- Ceres Fauna
- Ouro Kronii
- Nanashi Mumei (Brasen's oshi)
- Hakos Baelz

PLAP PLAP PLAP
`
const tmpQuestions: Question[] = [
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

export default function RootLayout({ children }: Props) {
  const [audioMode, setAudioMode] = useState(false);
  const [summary, setSummary] = useState(tmpSummary);
  const [questions, setQuestions] = useState(tmpQuestions);
  return (
    <html lang="en">
      <body className={`flex h-screen ${font.className}`}>
        <CurrentQuizProvider value={{
          audioMode,
          setAudioMode,
          summary,
          setSummary,
          questions,
          setQuestions
        }}>
          {children}
        </CurrentQuizProvider>
      </body>
    </html>
  )
}
