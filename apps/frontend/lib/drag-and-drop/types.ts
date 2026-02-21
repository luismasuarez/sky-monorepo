export interface DraggedItem<T = unknown> {
  item: T;
  sourceId: string;
  type: string;
}

export interface DropTargetInfo {
  targetId: string;
  type: string;
}
