"use client"

import { useTimerStore } from "@/store/use-timer-store"

export function TimerDisplay() {
  const { timeLeft, isFinished } = useTimerStore()

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

  return (
    <div className="text-center">
      <time
        className={`font-mono text-6xl md:text-7xl font-bold tracking-wider ${isFinished ? "text-[#E9B14E]" : "text-[#AA8D5A]"} tabular-nums`}
        aria-live="polite"
        aria-label={`${minutes} minutes and ${seconds} seconds remaining`}
      >
        {formatted}
      </time>
    </div>
  )
}
