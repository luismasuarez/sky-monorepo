
interface ViewContentPlaceholderProps {
  view: "kanban" | "links" | "credentials" | "metrics";
}

export function ViewContentPlaceholder({ view }: ViewContentPlaceholderProps) {
  if (view === "kanban") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-80 border rounded-lg bg-muted/40 p-6">
        <div className="text-2xl font-bold">Tablero Kanban</div>
        <div className="flex gap-4 w-full max-w-2xl">
          <div className="flex-1 bg-slate-200/60 dark:bg-slate-700/40 rounded-lg p-3 min-h-[120px] flex flex-col items-center">
            <div className="font-semibold mb-2">Pendiente</div>
            <div className="w-4/5 h-6 bg-slate-300/80 dark:bg-slate-600/60 rounded mb-1" />
            <div className="w-3/5 h-6 bg-slate-300/80 dark:bg-slate-600/60 rounded" />
          </div>
          <div className="flex-1 bg-slate-200/60 dark:bg-slate-700/40 rounded-lg p-3 min-h-[120px] flex flex-col items-center">
            <div className="font-semibold mb-2">En Progreso</div>
            <div className="w-4/5 h-6 bg-slate-300/80 dark:bg-slate-600/60 rounded mb-1" />
          </div>
          <div className="flex-1 bg-slate-200/60 dark:bg-slate-700/40 rounded-lg p-3 min-h-[120px] flex flex-col items-center">
            <div className="font-semibold mb-2">Hecho</div>
            <div className="w-2/5 h-6 bg-slate-300/80 dark:bg-slate-600/60 rounded" />
          </div>
        </div>
      </div>
    );
  }
  if (view === "links") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-80 border rounded-lg bg-muted/40 p-6">
        <div className="text-2xl font-bold">Links Guardados</div>
        <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
          <div className="bg-slate-200/60 dark:bg-slate-700/40 rounded-lg p-4 flex flex-col gap-2">
            <div className="h-4 w-3/4 bg-slate-300/80 dark:bg-slate-600/60 rounded" />
            <div className="h-3 w-1/2 bg-slate-300/80 dark:bg-slate-600/60 rounded" />
          </div>
          <div className="bg-slate-200/60 dark:bg-slate-700/40 rounded-lg p-4 flex flex-col gap-2">
            <div className="h-4 w-2/3 bg-slate-300/80 dark:bg-slate-600/60 rounded" />
            <div className="h-3 w-1/3 bg-slate-300/80 dark:bg-slate-600/60 rounded" />
          </div>
        </div>
      </div>
    );
  }
  if (view === "credentials") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-80 border rounded-lg bg-muted/40 p-6">
        <div className="text-2xl font-bold">Credenciales</div>
        <div className="flex flex-col gap-2 w-full max-w-md">
          <div className="flex gap-2 items-center">
            <div className="h-4 w-1/4 bg-slate-300/80 dark:bg-slate-600/60 rounded" />
            <div className="h-4 w-2/4 bg-slate-300/80 dark:bg-slate-600/60 rounded" />
          </div>
          <div className="flex gap-2 items-center">
            <div className="h-4 w-1/4 bg-slate-300/80 dark:bg-slate-600/60 rounded" />
            <div className="h-4 w-2/4 bg-slate-300/80 dark:bg-slate-600/60 rounded" />
          </div>
        </div>
      </div>
    );
  }
  if (view === "metrics") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-80 border rounded-lg bg-muted/40 p-6">
        <div className="text-2xl font-bold">Métricas</div>
        <div className="flex gap-6 w-full max-w-lg justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-slate-300/80 dark:bg-slate-600/60 mb-2" />
            <div className="h-3 w-12 bg-slate-300/80 dark:bg-slate-600/60 rounded" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-slate-300/80 dark:bg-slate-600/60 mb-2" />
            <div className="h-3 w-12 bg-slate-300/80 dark:bg-slate-600/60 rounded" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center h-64 text-xl text-muted-foreground font-semibold border rounded-lg bg-muted/40">
      Aquí va el contenido de la view
    </div>
  );
}
