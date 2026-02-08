import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import TaskCard from './TaskCard';
import KanbanColumn from './wrappers/KanbanColumn';
import { Column, Id, Task } from './types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

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
        return <KanbanColumn ref={setNodeRef} style={style} className="opacity-30" />;
    }

    return (
        <KanbanColumn ref={setNodeRef} style={style}>
            {/* Column Title*/}
            <div
                {...attributes}
                {...listeners}
                onClick={() => {
                    setEditMode(true);
                }}
                className="text-md font-semibold h-[60px] cursor-grab flex items-center justify-between px-2"
            >
                <div className="flex gap-3 items-center">
                    <div className="flex justify-center items-center bg-indigo-100 text-indigo-700 px-2.5 py-1 text-sm rounded-full dark:bg-indigo-900/40 dark:text-indigo-300">
                        1
                    </div>
                    <div className="min-w-0 truncate">
                        {!editMode && <span className="truncate">{column.title}</span>}
                        {editMode && (
                            <Input
                                autoFocus
                                className="min-w-0"
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
                </div>
                <Button variant="ghost" onClick={() => deleteColumn(column.id)}>
                    <TrashIcon />
                </Button>
            </div>

            {/* Column Task Container*/}
            <div className="flex flex-col space-y-3 max-h-[58vh] overflow-x-hidden overflow-y-auto flex-grow px-1 pr-2">
                <SortableContext items={tasksIds}>
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
                    ))}
                </SortableContext>
            </div>

            {/* Column Footer*/}
            <div className="mt-2">
                <Button
                    variant="outline"
                    onClick={() => createTask(column.id)}
                    className="w-full justify-center gap-2"
                >
                    <PlusIcon />
                    Add Task
                </Button>
            </div>
        </KanbanColumn>
    );
};

export default ColumnContainer;
