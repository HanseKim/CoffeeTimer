"use client"

import { Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTimerStore } from "@/store/use-timer-store"

const PRESETS = [
  { label: "10m", seconds: 600 },
  { label: "30m", seconds: 1800 },
  { label: "45m", seconds: 2700 },
  { label: "60m", seconds: 3600 },
  { label: "90m", seconds: 5400 },
]

export function TimerControls() {
  const { isRunning, isFinished, totalTime, start, pause, reset, setDuration } =
    useTimerStore()

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Preset buttons */}
      <div className="flex items-center gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.label}
            variant={totalTime === preset.seconds ? "default" : "secondary"}
            size="sm"
            onClick={() => setDuration(preset.seconds)}
            className={`font-mono text-sm px-4 py-2 rounded-full transition-all ${
              totalTime === preset.seconds
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Play / Pause / Reset */}
      <div className="flex items-center gap-3">
        {!isRunning ? (
          <Button
            onClick={start}
            disabled={isFinished}
            size="lg"
            className="rounded-full w-14 h-14 bg-primary text-primary-foreground hover:bg-coffee-light shadow-lg transition-all hover:scale-105"
            aria-label="Start timer"
          >
            <Play className="h-6 w-6 ml-0.5" />
          </Button>
        ) : (
          <Button
            onClick={pause}
            size="lg"
            className="rounded-full w-14 h-14 bg-primary text-primary-foreground hover:bg-coffee-light shadow-lg transition-all hover:scale-105"
            aria-label="Pause timer"
          >
            <Pause className="h-6 w-6" />
          </Button>
        )}

        <Button
          onClick={reset}
          variant="outline"
          size="lg"
          className="rounded-full w-12 h-12 border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
          aria-label="Reset timer"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
