"use client"

import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import useViewToggle from '@/hooks/useViewToggle'
import Clock from './clock'
import DashboardWidget from './dashboard-widget'
import HeaderMenuControls from './header-menu-controls'
import ViewToggle from './view-toggle'

type HeaderProps = {
	showLegacyMenu?: boolean
}

export function Header({ showLegacyMenu }: HeaderProps) {
	if (showLegacyMenu) {
		const { activeView, handleViewChange } = useViewToggle()

		return (
			<div className="flex items-center max-w-7xl mx-auto px-3 py-6 gap-2">
				{/* IZQUIERDA - Widget con Clock */}
				<div className="flex items-center justify-start flex-none gap-3">
					<DashboardWidget>
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
			</div>
		)
	}

	return (
		<header className="glass-light dark:glass-dark rounded-xl shadow-2xl flex items-center justify-between px-4 sm:px-5 py-3 gap-2 w-full max-w-7xl mx-auto mt-4 mb-6">
			<SidebarTrigger className="-ml-1" />
			<Separator orientation="vertical" className="mr-2 h-4" />
			{/* TODO: Aquí irán los selectores de Organization y Project */}
			<div className="flex items-center gap-2 flex-1">
				<span className="text-sm text-slate-700 dark:text-slate-200/80 font-semibold">Workspace Selector</span>
			</div>
		</header>
	)
}
