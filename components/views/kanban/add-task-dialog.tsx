'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TKanbanCard } from '@/lib/kanban-types';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useKanbanBoardContext } from './context/kanban-board-context';

export function AddTaskDialog() {
  const [open, setOpen] = useState(false);

  const { addTask } = useKanbanBoardContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TKanbanCard>({
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<TKanbanCard> = data => {
    addTask('todo', data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="flex items-center justify-center">
          <IconPlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Agregar Tarea</DialogTitle>
            <DialogDescription>
              Agrega una nueva tarea aquí. Haz clic en guardar cuando hayas terminado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Título</Label>
              <Input
                id="name-1"
                {...register('title', { required: true })}
                defaultValue="Nueva tarea"
              />
              {errors.title && <span>This field is required</span>}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Descripción</Label>
              <Input
                id="username-1"
                {...register('description', { required: true })}
                defaultValue="Descripción de la tarea"
              />
              {errors.description && <span>This field is required</span>}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
