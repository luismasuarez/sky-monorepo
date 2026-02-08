import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import TrashIcon from './icons/TrashIcon';
import { Id, Task } from './types';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import KanbanCard from './wrappers/KanbanCard';

interface Props {
    task: Task;
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, content: string) => void;
}

const TaskCard = ({ task, deleteTask, updateTask }: Props) => {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: { type: 'Task', task },
        disabled: editMode,
    });
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const toggleEditMode = () => {
        setEditMode(prev => !prev);
    };

    if (isDragging) {
        return (
            <KanbanCard
                ref={setNodeRef}
                style={style}
                className="opacity-30 h-[100px] min-h-[100px] flex"
            />
        );
    }

    if (editMode) {
        return (
            <KanbanCard
                {...attributes}
                {...listeners}
                ref={setNodeRef}
                style={style}
                className="p-2.5 h-[100px] min-h-[100px] flex cursor-grab relative"
            >
                <Textarea
                    className="h-[90%] w-full resize-none"
                    value={task.content}
                    autoFocus
                    placeholder="Task content here"
                    onBlur={toggleEditMode}
                    onKeyDown={e => {
                        if (e.shiftKey && e.key == 'Enter') toggleEditMode();
                    }}
                    onChange={e => updateTask(task.id, e.target.value)}
                />
            </KanbanCard>
        );
    }

    return (
        <KanbanCard
            onClick={toggleEditMode}
            onMouseEnter={() => setMouseIsOver(true)}
            onMouseLeave={() => setMouseIsOver(false)}
            {...attributes}
            {...listeners}
            ref={setNodeRef}
            style={style}
            className="p-2.5 h-[100px] min-h-[100px] items-center flex cursor-grab relative transition hover:shadow-lg"
        >
            <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
                {task.content}
            </p>
            {mouseIsOver && (
                <Button
                    variant="ghost"
                    onClick={() => deleteTask(task.id)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                    <TrashIcon />
                </Button>
            )}
        </KanbanCard>
    );
};

export default TaskCard;
