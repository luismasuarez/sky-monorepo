"use client"

import { cn } from "@/lib/utils"
import React from "react"

interface AnimatedViewProps {
  isActive: boolean
  children: React.ReactNode
  className?: string
  animationDuration?: number
  animationEasing?: string
}

export default function AnimatedView({
  isActive,
  children,
  className,
  animationDuration = 500,
  animationEasing = "ease-in-out"
}: AnimatedViewProps) {
  const baseClasses = "transition-all"
  const activeClasses = "opacity-100 translate-y-0 relative pointer-events-auto"
  const inactiveClasses = "opacity-0 translate-y-4 absolute pointer-events-none"

  const animationStyle = {
    transitionDuration: `${animationDuration}ms`,
    transitionTimingFunction: animationEasing
  }

  return (
    <div
      className={cn(
        baseClasses,
        isActive ? activeClasses : inactiveClasses,
        className
      )}
      style={animationStyle}
    >
      {isActive && children}
    </div>
  )
}