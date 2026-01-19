import * as React from "react";
import { IconX, IconPlus } from "@tabler/icons-react";

export interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (data: TaskFormData) => void;
  targetColumn: "todo" | "inProgress" | "done";
}

export interface TaskFormData {
  title: string;
  description?: string;
  estimatedHours?: number;
  estimatedMinutes?: number;
  quoteAmount?: number;
}

export function AddTaskModal({ isOpen, onClose, onAddTask, targetColumn }: AddTaskModalProps) {
  const [form, setForm] = React.useState<TaskFormData>({ title: "" });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onAddTask(form);
    setIsSubmitting(false);
    onClose();
  };

  const getColumnTitle = () => {
    switch (targetColumn) {
      case "todo": return "Pendiente";
      case "inProgress": return "En Progreso";
      case "done": return "Hecho";
      default: return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md">
        <div className="glass-light dark:glass-dark rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/90 to-blue-600/90 dark:from-blue-400/90 dark:to-blue-500/90 rounded-xl flex items-center justify-center shadow-lg">
                <IconPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Agregar Tarea</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Nueva tarea en <span className="font-semibold">{getColumnTitle()}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-full p-2"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>
          <form className="p-6 space-y-4" onSubmit={handleSubmit}>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Título de la tarea"
              className="w-full rounded border px-3 py-2 text-sm"
              maxLength={100}
            />
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              placeholder="Descripción (opcional)"
              className="w-full rounded border px-3 py-2 text-sm"
              maxLength={500}
            />
            <div className="flex gap-2">
              <input
                name="estimatedHours"
                type="number"
                min={0}
                max={999}
                value={form.estimatedHours || ""}
                onChange={handleChange}
                placeholder="Horas"
                className="w-1/2 rounded border px-3 py-2 text-sm"
              />
              <input
                name="estimatedMinutes"
                type="number"
                min={0}
                max={59}
                value={form.estimatedMinutes || ""}
                onChange={handleChange}
                placeholder="Minutos"
                className="w-1/2 rounded border px-3 py-2 text-sm"
              />
            </div>
            <input
              name="quoteAmount"
              type="number"
              min={0}
              value={form.quoteAmount || ""}
              onChange={handleChange}
              placeholder="Presupuesto (opcional)"
              className="w-full rounded border px-3 py-2 text-sm"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                disabled={isSubmitting || !form.title}
              >
                Agregar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddTaskModal;
