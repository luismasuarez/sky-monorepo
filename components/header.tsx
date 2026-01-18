"use client"

import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import useViewToggle from '@/hooks/useViewToggle'
import Clock from './clock'
import DashboardWidget from './dashboard-widget'
import HeaderMenuControls from './header-menu-ontrols'
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
		<header className="flex h-16 shrink-0 items-center gap-2 border-b glass-panel">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				{/* TODO: Aquí irán los selectores de Organization y Project */}
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted-foreground">Workspace Selector</span>
				</div>
			</div>
		</header>
	)
}
