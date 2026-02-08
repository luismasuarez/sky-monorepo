import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import TaskCard from './TaskCard';
import { Column, Id, Task } from './types';
import { Button } from '../ui/button';

interface Props {
    column: Column;
    tasks: Task[];
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void;
    createTask: (columnId: Id) => void;
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, content: string) => void;
}

const ColumnContainer = (props: Props) => {
    const [editMode, setEditMode] = useState(false);
    const { column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask } = props;
    const tasksIds = useMemo(() => {
        return tasks.map(task => task.id);
    }, [tasks]);
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: { type: 'Column', column },
        disabled: editMode,
    });
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="glass-light opacity-30 w-[350px] h-[500px] max-h-[500px] rounded-xl flex flex-col"
            ></div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="glass-light dark:glass-dark w-[350px] h-[500px] max-h-[500px] rounded-xl flex flex-col"
        >
            {/* Column Title*/}
            <div
                {...attributes}
                {...listeners}
                onClick={() => {
                    setEditMode(true);
                }}
                className="text-md font-bold h-[60px] p-3 cursor-grab flex items-center justify-between"
            >
                <div className="flex gap-2">
                    <div className="flex justify-center items-center bg-muted/30 px-2.5 py-1 text-sm rounded-full">
                        1
                    </div>
                    {!editMode && column.title}
                    {editMode && (
                        <input
                            autoFocus
                            className="bg-black focus:border-rose-500 border rounded outline-none px-2"
                            value={column.title}
                            onChange={e => updateColumn(column.id, e.target.value)}
                            onBlur={() => {
                                setEditMode(false);
                            }}
                            onKeyDown={e => {
                                if (e.key !== 'Enter') return;
                                setEditMode(false);
                            }}
                        />
                    )}
                </div>
                <Button variant="ghost" onClick={() => deleteColumn(column.id)}>
                    <TrashIcon />
                </Button>
            </div>

            {/* Column Task Container*/}
            <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
                <SortableContext items={tasksIds}>
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
                    ))}
                </SortableContext>
            </div>

            {/* Column Footer*/}
            <div className="p-2">
                <Button variant="outline" onClick={() => createTask(column.id)}>
                    <PlusIcon />
                    Add Task
                </Button>
            </div>
        </div>
    );
};

export default ColumnContainer;
