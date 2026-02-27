"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { Coffee } from "lucide-react"
import { useTimerStore } from "@/store/use-timer-store"
import { CoffeeCup } from "@/components/coffee-cup"
import { TimerDisplay } from "@/components/timer-display"
import { TimerControls } from "@/components/timer-controls"

export function TimerWidget() {
  const { timeLeft, totalTime, isRunning, isFinished, tick } = useTimerStore()

  // Tick every second
  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      tick()
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning, tick])

  // Show toast when finished
  useEffect(() => {
    if (isFinished) {
      toast("Time for a break!", {
        description: "Step away from your desk and enjoy your coffee.",
        icon: <Coffee className="h-5 w-5 text-primary" />,
        duration: 8000,
      })
    }
  }, [isFinished])

  const percentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0

  return (
    <div className="flex flex-col items-center gap-2">
      <CoffeeCup percentage={percentage} />
      <TimerDisplay />
      <TimerControls />
    </div>
  )
}
