"use client"
import { useState } from "react"

export type ViewType = "kanban" | "links" | "credentials" | "metrics"

const useViewToggle = () => {
  const [activeView, setActiveView] = useState<ViewType>("kanban")

  const handleViewChange = (view: ViewType) => {
    setActiveView(view)

    const contentElement = document.getElementById("main-content")
    if (contentElement) {
      contentElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      })
    }
  }

  return {
    activeView,
    handleViewChange,
  }
}

export default useViewToggle