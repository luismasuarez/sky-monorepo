"use client"

import { useEffect, useRef, useState } from "react"

export default function Clock() {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const ampm = hours >= 12 ? 'pm' : 'am'
      const displayHours = hours % 12 || 12
      const displayMinutes = minutes < 10 ? `0${minutes}` : minutes
      setCurrentTime(`${displayHours}:${displayMinutes} ${ampm}`)
    }
    updateTime()
    intervalRef.current = setInterval(updateTime, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="text-base sm:text-lg font-mono font-bold tracking-wider text-slate-900 dark:text-slate-100 text-shadow-sm">
      {currentTime}
    </div>
  )
}
