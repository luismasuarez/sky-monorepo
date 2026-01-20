import React, { createContext, useContext, useState } from 'react';
import type { DraggedItem, DropTargetInfo } from './types';

interface DragAndDropContextType {
  draggedItem: DraggedItem | null;
  setDraggedItem: (item: DraggedItem | null) => void;
  dropTarget: DropTargetInfo | null;
  setDropTarget: (target: DropTargetInfo | null) => void;
}

const DragAndDropContext = createContext<DragAndDropContextType | undefined>(undefined);

export const DragAndDropProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTargetInfo | null>(null);

  return (
    <DragAndDropContext.Provider value={{ draggedItem, setDraggedItem, dropTarget, setDropTarget }}>
      {children}
    </DragAndDropContext.Provider>
  );
};

export function useDragAndDropContext() {
  const ctx = useContext(DragAndDropContext);
  if (!ctx) throw new Error('useDragAndDropContext must be used within DragAndDropProvider');
  return ctx;
}
