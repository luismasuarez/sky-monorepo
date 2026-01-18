"use client"

import useViewToggle from '@/hooks/useViewToggle'
import Clock from './clock'
import DashboardWidget from './dashboard-widget'
import HeaderMenuControls from './header-menu-controls'
import ViewToggle from './view-toggle'

export function Header() {
	// Legacy layout es ahora el oficial
	const { activeView, handleViewChange } = useViewToggle()

	return (
		<header className="glass-light dark:glass-dark rounded-xl shadow-2xl flex items-center max-w-7xl mx-auto px-3 py-6 gap-2 mt-4 mb-6">
			{/* IZQUIERDA - Widget con Clock */}
			<div className="flex items-center justify-start flex-none gap-3">
				<DashboardWidget className="glass-card">
					<Clock />
				</DashboardWidget>
			</div>

			{/* CENTRO */}
			<div className="flex-1 flex items-center justify-center min-w-[300px]">
				<ViewToggle
					activeView={activeView}
					onViewChange={handleViewChange}
				/>
			</div>

			{/* DERECHA */}
			<div className="flex items-center justify-end flex-none gap-2">
				<HeaderMenuControls
					onBackup={() => { }}
					onRestore={() => { }}
				/>
			</div>
		</header>
	)
}
