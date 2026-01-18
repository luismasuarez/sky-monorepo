"use client"

import { useEffect, useRef, useState } from "react"

export default function Clock() {
  const [currentTime, setCurrentTime] = useState("")
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      setCurrentTime(timeString.toUpperCase())
    }

    updateTime()
    intervalRef.current = setInterval(updateTime, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="flex justify-center pt-4 sm:pt-6 md:pt-8 pb-2 sm:pb-3 md:pb-4 px-4">
      <div className="
        glass-light dark:glass-dark
        text-slate-900 dark:text-slate-100
        rounded-xl px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3
        shadow-2xl text-shadow-sm
      ">
        <div className="text-lg sm:text-xl md:text-2xl font-mono font-bold tracking-wider">{currentTime}</div>
      </div>
    </div>
  )
}
