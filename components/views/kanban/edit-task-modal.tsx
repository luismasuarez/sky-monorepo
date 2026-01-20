import * as React from 'react';
import { IconX, IconEdit } from '@tabler/icons-react';
import { z } from 'zod';
import { KanbanCard, TaskStatus } from '@/lib/kanban-types';

const TaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  estimatedHours: z.number().min(0).max(999).optional(),
  estimatedMinutes: z.number().min(0).max(59).optional(),
  quoteAmount: z.number().min(0).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  tags: z.array(z.string()).optional(),
  dueDate: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'review', 'done']),
});

export type EditTaskFormData = z.infer<typeof TaskSchema>;

export interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditTask: (data: EditTaskFormData) => void;
  initialData: KanbanCard;
}

export function EditTaskModal({ isOpen, onClose, onEditTask, initialData }: EditTaskModalProps) {
  const [form, setForm] = React.useState<EditTaskFormData>({
    title: initialData.title,
    description: initialData.description || '',
    estimatedHours: initialData.estimatedTime
      ? Math.floor(initialData.estimatedTime / (60 * 60 * 1000))
      : 0,
    estimatedMinutes: initialData.estimatedTime
      ? Math.floor((initialData.estimatedTime % (60 * 60 * 1000)) / (60 * 1000))
      : 0,
    quoteAmount: initialData.quoteAmount || 0,
    priority: initialData.priority || 'medium',
    tags: initialData.tags || [],
    dueDate: initialData.dueDate || '',
    status: initialData.status,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'tags' ? value.split(',') : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = TaskSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setIsSubmitting(true);
    onEditTask(parsed.data);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md">
        <div className="glass-light dark:glass-dark rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/90 to-blue-600/90 dark:from-blue-400/90 dark:to-blue-500/90 rounded-xl flex items-center justify-center shadow-lg">
                <IconEdit className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Editar Tarea
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Modifica los datos de la tarea
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
            {errors.title && <div className="text-xs text-red-500">{errors.title}</div>}
            <textarea
              name="description"
              value={form.description || ''}
              onChange={handleChange}
              placeholder="Descripción (opcional)"
              className="w-full rounded border px-3 py-2 text-sm"
              maxLength={500}
            />
            {errors.description && <div className="text-xs text-red-500">{errors.description}</div>}
            <div className="flex gap-2">
              <input
                name="estimatedHours"
                type="number"
                min={0}
                max={999}
                value={form.estimatedHours || ''}
                onChange={handleChange}
                placeholder="Horas"
                className="w-1/2 rounded border px-3 py-2 text-sm"
              />
              <input
                name="estimatedMinutes"
                type="number"
                min={0}
                max={59}
                value={form.estimatedMinutes || ''}
                onChange={handleChange}
                placeholder="Minutos"
                className="w-1/2 rounded border px-3 py-2 text-sm"
              />
            </div>
            <input
              name="quoteAmount"
              type="number"
              min={0}
              value={form.quoteAmount || ''}
              onChange={handleChange}
              placeholder="Presupuesto (opcional)"
              className="w-full rounded border px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-1/2 rounded border px-3 py-2 text-sm"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
              <input
                name="tags"
                value={form.tags?.join(',') || ''}
                onChange={handleChange}
                placeholder="Etiquetas (coma)"
                className="w-1/2 rounded border px-3 py-2 text-sm"
              />
            </div>
            <input
              name="dueDate"
              type="date"
              value={form.dueDate || ''}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2 text-sm"
            />
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2 text-sm"
            >
              <option value="todo">Por hacer</option>
              <option value="in-progress">En progreso</option>
              <option value="review">Revisión</option>
              <option value="done">Hecho</option>
            </select>
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
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditTaskModal;
