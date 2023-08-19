"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {

  const [file, setFile] = useState("");
  const router = useRouter();
  const containerClass = "bg-slate-700 w-[700px] p-6 rounded-xl flex flex-col gap-4"

  return (
   <div className="flex flex-1 bg-slate-800 justify-center items-center">
     <div className="flex flex-col gap-8">
       <div className="flex flex-row justify-between">
         <h1>
           QuizCaster
         </h1>
         <button
           className="text-xl py-2 px-4 rounded-xl bg-emerald-600 font-semibold"
           onClick={() => router.push("/local/summary")}
         >
           Brasen's Button
         </button>
         <button
           className="text-xl py-2 px-6 rounded-full bg-emerald-600 font-semibold"
           onClick={() => router.push("/local/summary")}
         >
           Go
         </button>
       </div>

       <div className={containerClass}>
         <h2>
           Start with a website:
         </h2>
         <div className="flex gap-3">
           <input
             type="text"
             placeholder="https://"
            className="flex-1 text-black outline-0 py-2 px-4 rounded-xl truncate" />
         </div>
       </div>

       <div className={containerClass}>
         <h2>
           Or start with a file:
         </h2>
         <input
           accept="*"
           type="file"
           id="fileInput"
           onChange={(e) => setFile(e.target.value)}
           className="hidden" />
         <label
           htmlFor="fileInput"
           className="bg-slate-600 rounded-xl h-36 cursor-pointer flex flex-col justify-center items-center
                      text-slate-400"
         >
           <p>Click to select a file</p>
           <p>
             Selected file:{" "}
             <span className="font-semibold text-slate-300">
               {file
                 ? file.replace(/\w:\\fakepath\\/gm, "")
                 : "No file selected"}
             </span>
           </p>
         </label>
       </div>
     </div>
   </div>
  )
}
