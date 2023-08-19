"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {

  const [currentFileName, setCurrentFileName] = useState("");
  const router = useRouter();
  const containerClass = "bg-slate-700 w-[700px] p-6 rounded-xl flex flex-col gap-4"

  function handleFileChange(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setCurrentFileName(selectedFile.name)
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const content = event.target.result;
        // @ts-ignore
        window.pywebview.api.upload_file(content)
      };
      reader.readAsText(selectedFile);
    }
  }

  return (
   <div className="flex flex-1 bg-slate-800 justify-center items-center">
     <div className="flex flex-col gap-8">
       <div className="flex flex-row justify-between">
         <div>
           <h1>
             QuizCaster
           </h1>
           <p className="text-md font-extralight">
             Your intelligent personal quiz assistant
           </p>
         </div>
         <button
           className="text-2xl py-2 px-6 rounded-full bg-emerald-600 font-semibold"
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
           accept=".md, .txt, .pdf"
           type="file"
           id="fileInput"
           onChange={handleFileChange}
           className="hidden" />
         <label
           htmlFor="fileInput"
           className="bg-slate-600 rounded-xl h-36 cursor-pointer flex flex-col justify-center items-center
                      text-slate-400"
         >
           <p>Click to select a markdown, text, or PDF file (md, txt, pdf)</p>
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
     </div>
   </div>
  )
}
