export interface DraggedItem<T = any> {
  item: T;
  sourceId: string;
  type: string;
}

export interface DropTargetInfo {
  targetId: string;
  type: string;
}
