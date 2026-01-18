"use client"

import Clock from './clock'
import DashboardWidget from './dashboard-widget'
import ViewToggle from './view-toggle'

import type { ViewType } from './view-toggle'
interface HeaderProps {
	activeView: ViewType
	handleViewChange: (view: ViewType) => void
}

export function Header({ activeView, handleViewChange }: HeaderProps) {
	return (
		<header className="flex items-center max-w-7xl mx-auto gap-2 mt-4 mb-6">
			{/* IZQUIERDA - Widget con Clock */}
			<div className="flex items-center justify-start flex-none gap-3">
				<DashboardWidget className="glass-card">
					<Clock />
				</DashboardWidget>
			</div>

			{/* CENTRO */}
			<div className="flex-1 flex items-center justify-center min-w-[300px]">
				<ViewToggle
					activeView={activeView as any}
					onViewChange={handleViewChange as any}
				/>
			</div>

			{/* DERECHA */}
			{/* <div className="flex items-center justify-end flex-none gap-2">
        <HeaderMenuControls
          onBackup={() => { }}
          onRestore={() => { }}
        />
      </div> */}
		</header>
	)
}
