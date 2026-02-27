"use client"

import { useTimerStore } from "@/store/use-timer-store"
import { TimerWidget } from "@/components/timer-widget"
import { Coffee } from "lucide-react"

export default function HomePage() {
  const isFinished = useTimerStore((s) => s.isFinished)

  return (
    <main
      className={`min-h-svh flex flex-col items-center justify-center px-4 py-12 transition-colors duration-2000 ease-in-out ${
        isFinished ? "bg-foreground text-background" : "bg-background"
      }`}
    >
      {/* Header */}
      <header className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Coffee className="h-7 w-7 text-primary" strokeWidth={2} />
          <h1 className="text-2xl text-primary md:text-3xl font-bold tracking-tight text-balance">
            Coffee Break Timer
          </h1>
        </div>
        <div className="w-full flex flex-col items-center justify-center">
          <span className="block text-muted-foreground text-md md:text-base">타이머를 맞추고 집중해 보세요.</span> 
          <span className="block text-muted-foreground text-md md:text-base">오롯이 집중한 당신을 위한 휴식이 기다리고 있습니다.</span>
        </div>
      </header>

      {/* Timer Widget */}
      <TimerWidget />

      {/* Finished message */}
      <div
        className={`mt-10 text-center transition-all duration-1000 ease-in-out ${
          isFinished
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-live="polite"
      >
        <p className="text-lg font-medium text-primary">
          Break time! Step away and recharge.
        </p>
      </div>

      {/* Footer */}
      {/* <footer className="mt-auto pt-12 pb-4 text-center">
        <p className="text-md text-muted-foreground">
          쉬는 시간입니다! ☕ 모니터에서 눈을 떼고 가볍게 기지개를 켜보세요.
        </p>
      </footer> */}
    </main>
  )
}
