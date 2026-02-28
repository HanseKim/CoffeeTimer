"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

// 버튼별 BGM 트랙 (public/audio/ 폴더에 MP3 추가)
const CAFE_BGM_TRACKS: { label: string; src: string }[] = [
  { label: "Cafe BGM 1", src: "/audio/cafe1.mp3" },
  { label: "Cafe BGM 2", src: "/audio/cafe2.mp3" },
]

export function CoffeeAmbience() {
  const [activeTrack, setActiveTrack] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const handlersRef = useRef<{ ended: () => void; error: () => void } | null>(null)

  const stopBGM = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (handlersRef.current) {
      audio.removeEventListener("ended", handlersRef.current.ended)
      audio.removeEventListener("error", handlersRef.current.error)
      handlersRef.current = null
    }
    audio.pause()
    audio.src = ""
    audio.load()
    audioRef.current = null
    setActiveTrack(null)
  }, [])

  const playTrack = useCallback(
    (index: number) => {
      const track = CAFE_BGM_TRACKS[index]
      if (!track?.src) return

      if (activeTrack === index) {
        stopBGM()
        return
      }

      stopBGM()

      const audio = new Audio()
      audio.volume = 0.4
      audio.loop = true
      audio.src = track.src
      audioRef.current = audio
      setActiveTrack(index)

      const onEnded = () => {
        // loop=true여도 일부 환경에서 ended가 발생할 수 있음 → 다시 재생
        if (audioRef.current === audio) {
          audio.currentTime = 0
          audio.play().catch(() => {})
        }
      }
      const onError = () => {
        stopBGM()
      }
      handlersRef.current = { ended: onEnded, error: onError }
      audio.addEventListener("ended", onEnded)
      audio.addEventListener("error", onError)

      audio.play().catch(() => {
        stopBGM()
      })
    },
    [activeTrack, stopBGM]
  )

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
        audioRef.current = null
      }
    }
  }, [])

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {CAFE_BGM_TRACKS.map((track, index) => (
        <Button
          key={track.src}
          variant="ghost"
          size="sm"
          onClick={() => playTrack(index)}
          className="gap-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={
            activeTrack === index
              ? `${track.label} 끄기`
              : `${track.label} 재생`
          }
        >
          {activeTrack === index ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
          <span className="text-xs font-medium">
            {activeTrack === index ? `${track.label} ON` : track.label}
          </span>
        </Button>
      ))}
    </div>
  )
}
