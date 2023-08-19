"use client";

import { useRouter } from "next/navigation";

type Prop = {
  className?: string
}

export function BackButton({ className }: Prop) {
  const router = useRouter()

  return (
    <div
      className={`absolute top-2 left-2 rounded-full transition-colors hover:bg-[#ffffff33] cursor-pointer ${className}`}
      onClick={() => router.back()}
    >
      <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" fill="#fff">
        <path d="M561-240 320-481l241-241 43 43-198 198 198 198-43 43Z"/>
      </svg>
    </div>
  )
}
