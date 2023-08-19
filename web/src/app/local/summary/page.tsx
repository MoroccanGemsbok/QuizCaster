"use client";

import { BackButton } from "@/components/BackButton";
// @ts-ignore
import ReactMarkdown from "react-markdown";

const md = `
## Supernova 

- Outer element shells sucked in, then bounced off to explosion
- Creates other elements not in fusion reaction
- Creates a significant amount of radiation
\t- 50 light years away is deadly
\t- 120 light years might've caused an extinction event
- Type I supernova has hydrogen
- Type Ia supernova has a lot of silicon
\t- Likely caused by supernova of binary stars
- Type 1c might create gamma ray bursts and have no outer hydrogen layer
\t- Likely caused by merge of neutron stars
- Type II supernova does not have hydrogen, ~10 sun masses or larger
\t- Much brighter
`

export default function Page() {
  return (
    <div className="flex flex-1 bg-emerald-900 flex-col justify-center items-center gap-8">
      <BackButton />
      <div className="flex flex-col gap-2 items-center">
        <h1>Summary</h1>
        <h2>Let's review the material first!</h2>
      </div>
      <div className="bg-emerald-800 w-[700px] h-[360px] p-4 rounded-lg overflow-auto scrollbar-thin
        scrollbar-thumb-emerald-600 scrollbar-track-transparent scrollbar-thumb-rounded-full list-disc">
        <ReactMarkdown
          className="prose prose-invert leading-5 text-white marker:text-white"
          children={md} />
      </div>

      <button
        className="bg-sky-600 py-3 px-8 rounded-full font-semibold"
      >
        I'm ready, quiz me!
      </button>
    </div>
  )
}
