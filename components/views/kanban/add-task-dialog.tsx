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
import { IconPlus } from '@tabler/icons-react';
import { SubmitHandler, useForm } from 'react-hook-form';

type Task = {
  title: string;
  description: string;
};

export function AddTaskDialog() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Task>();
  const onSubmit: SubmitHandler<Task> = data => console.log(data);

  console.log(watch('title')); // watch input value by passing the name of it

  return (
    <Dialog>
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
              <Input id="name-1" {...register('title')} defaultValue="Nueva tarea" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Descripción</Label>
              <Input
                id="username-1"
                {...register('description')}
                defaultValue="Descripción de la tarea"
              />
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
