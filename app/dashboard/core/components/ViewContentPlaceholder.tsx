
interface ViewContentPlaceholderProps {
  view: "kanban" | "links" | "credentials" | "metrics";
}

export function ViewContentPlaceholder({ view }: ViewContentPlaceholderProps) {
  let text = "";
  switch (view) {
    case "kanban":
      text = "Aquí va el contenido de la view kanban";
      break;
    case "links":
      text = "Aquí va el contenido de la view links";
      break;
    case "credentials":
      text = "Aquí va el contenido de la view credentials";
      break;
    case "metrics":
      text = "Aquí va el contenido de la view metrics";
      break;
    default:
      text = "Aquí va el contenido de la view";
  }
  return (
    <div className="flex items-center justify-center h-64 text-xl text-muted-foreground font-semibold border rounded-lg bg-muted/40">
      {text}
    </div>
  );
}
