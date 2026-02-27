import { create } from 'zustand'

interface TimerState {
  timeLeft: number
  totalTime: number
  isRunning: boolean
  isFinished: boolean
  start: () => void
  pause: () => void
  reset: () => void
  setDuration: (seconds: number) => void
  tick: () => void
}

export const useTimerStore = create<TimerState>((set, get) => ({
  timeLeft: 600,
  totalTime: 600,
  isRunning: false,
  isFinished: false,

  start: () => {
    const { timeLeft, isFinished } = get()
    if (timeLeft > 0 && !isFinished) {
      set({ isRunning: true })
    }
  },

  pause: () => {
    set({ isRunning: false })
  },

  reset: () => {
    const { totalTime } = get()
    set({ timeLeft: totalTime, isRunning: false, isFinished: false })
  },

  setDuration: (seconds: number) => {
    set({
      timeLeft: seconds,
      totalTime: seconds,
      isRunning: false,
      isFinished: false,
    })
  },

  tick: () => {
    const { timeLeft, isRunning } = get()
    if (isRunning && timeLeft > 0) {
      const newTime = timeLeft - 1
      set({
        timeLeft: newTime,
        isFinished: newTime === 0,
        isRunning: newTime > 0,
      })
    }
  },
}))
