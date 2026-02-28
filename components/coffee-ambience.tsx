"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

// 저작권 없는 카페 BGM 플레이리스트
// public/audio/ 폴더에 MP3 파일을 넣고 경로를 추가하세요.
// BGM이 없으면 brown noise(카페 웅성거림)로 자동 전환됩니다.
// 출처: Pixabay, Mixkit, Incompetech 등
const CAFE_BGM_PLAYLIST: string[] = [
  "/audio/cafe1.mp3",
  "/audio/cafe2.mp3",
]

export function CoffeeAmbience() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [mode, setMode] = useState<"bgm" | "noise">("bgm")
  const modeRef = useRef<"bgm" | "noise">("bgm")
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentIndexRef = useRef(0)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<{
    brownNoise: AudioBufferSourceNode | null
    gainNode: GainNode | null
  }>({ brownNoise: null, gainNode: null })

  const createBrownNoise = useCallback((ctx: AudioContext): AudioBufferSourceNode => {
    const bufferSize = ctx.sampleRate * 4
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate)

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel)
      let lastOut = 0.0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        data[i] = (lastOut + 0.02 * white) / 1.02
        lastOut = data[i]
        data[i] *= 3.5
      }
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    return source
  }, [])

  const startBrownNoise = useCallback(() => {
    const ctx = new AudioContext()
    audioCtxRef.current = ctx

    const brownNoise = createBrownNoise(ctx)
    const gainNode = ctx.createGain()
    gainNode.gain.value = 0.12

    const lpFilter = ctx.createBiquadFilter()
    lpFilter.type = "lowpass"
    lpFilter.frequency.value = 400
    lpFilter.Q.value = 0.7

    const bpFilter = ctx.createBiquadFilter()
    bpFilter.type = "bandpass"
    bpFilter.frequency.value = 250
    bpFilter.Q.value = 0.5

    brownNoise.connect(lpFilter)
    lpFilter.connect(bpFilter)
    bpFilter.connect(gainNode)
    gainNode.connect(ctx.destination)

    brownNoise.start()

    nodesRef.current = { brownNoise, gainNode }
  }, [createBrownNoise])

  const stopBrownNoise = useCallback(() => {
    if (nodesRef.current.brownNoise) {
      nodesRef.current.brownNoise.stop()
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close()
    }
    nodesRef.current = { brownNoise: null, gainNode: null }
    audioCtxRef.current = null
  }, [])

  const stopBGM = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
      audioRef.current = null
    }
  }, [])

  const startBGM = useCallback(() => {
    const playlist = CAFE_BGM_PLAYLIST.filter(Boolean)
    if (playlist.length === 0) return

    const audio = new Audio()
    audio.volume = 0.4
    audioRef.current = audio
    currentIndexRef.current = 0
    let errorCount = 0

    const fallbackToNoise = () => {
      stopBGM()
      modeRef.current = "noise"
      setMode("noise")
      startBrownNoise()
    }

    const playNext = () => {
      const src = playlist[currentIndexRef.current]
      audio.src = src
      audio.play().catch(() => {
        // play() 실패 시 handleError에서 처리 (이중 호출 방지)
      })
    }

    const handleEnded = () => {
      errorCount = 0
      currentIndexRef.current = (currentIndexRef.current + 1) % playlist.length
      playNext()
    }

    const handleError = () => {
      errorCount++
      if (errorCount >= playlist.length) {
        fallbackToNoise()
        return
      }
      currentIndexRef.current = (currentIndexRef.current + 1) % playlist.length
      playNext()
    }

    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)
    playNext()
  }, [stopBGM, startBrownNoise])

  const startAmbience = useCallback(() => {
    const playlist = CAFE_BGM_PLAYLIST.filter(Boolean)
    if (playlist.length > 0) {
      modeRef.current = "bgm"
      setMode("bgm")
      startBGM()
    } else {
      modeRef.current = "noise"
      setMode("noise")
      startBrownNoise()
    }
    setIsPlaying(true)
  }, [startBGM, startBrownNoise])

  const stopAmbience = useCallback(() => {
    if (modeRef.current === "bgm") {
      stopBGM()
    } else {
      stopBrownNoise()
    }
    setIsPlaying(false)
  }, [stopBGM, stopBrownNoise])

  useEffect(() => {
    return () => {
      stopBGM()
      stopBrownNoise()
    }
  }, [stopBGM, stopBrownNoise])

  const toggle = useCallback(() => {
    if (isPlaying) {
      if (modeRef.current === "bgm") stopBGM()
      else stopBrownNoise()
      setIsPlaying(false)
    } else {
      startAmbience()
    }
  }, [isPlaying, startAmbience, stopBGM, stopBrownNoise])

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="gap-2 text-muted-foreground hover:text-foreground transition-colors"
      aria-label={isPlaying ? "Mute cafe ambience" : "Play cafe ambience"}
    >
      {isPlaying ? (
        <Volume2 className="h-4 w-4" />
      ) : (
        <VolumeX className="h-4 w-4" />
      )}
      <span className="text-xs font-medium">
        {isPlaying
          ? mode === "bgm"
            ? "Cafe BGM ON"
            : "Cafe Ambience ON"
          : "Cafe BGM"}
      </span>
    </Button>
  )
}
