
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

export function Header() {
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
