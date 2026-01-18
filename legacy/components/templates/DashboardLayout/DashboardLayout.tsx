// ...existing code...
// DashboardLayout template for atomic design migration
import DashboardHeader from "../../organisms/DashboardHeader"
import KanbanBoard from "../../organisms/KanbanBoard"
import BookmarksWrapper from "../../organisms/BookmarksWrapper"
import ServersGridWrapper from "../../organisms/ServersGridWrapper"
import MetricsDashboard from "../../organisms/MetricsDashboard"
import Modals from "../Modals"

export default function DashboardLayout() {
  // For migration, render all areas with no props
  return (
    <div className="min-h-screen relative">
      {/* Decorative background */}
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10" />
      <DashboardHeader />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="min-h-[400px] sm:min-h-[500px] md:min-h-[600px] transition-all duration-500 ease-in-out">
          <KanbanBoard />
          <BookmarksWrapper />
          <ServersGridWrapper />
          <MetricsDashboard />
        </div>
      </div>
      <Modals />
    </div>
  )
}
