import { DragAndDropProvider } from '@/lib/drag-and-drop/DragAndDropContext';
import * as React from 'react';

export function KanbanDndProvider({ children }: { children: React.ReactNode }) {
  return <DragAndDropProvider>{children}</DragAndDropProvider>;
}

export default KanbanDndProvider;
