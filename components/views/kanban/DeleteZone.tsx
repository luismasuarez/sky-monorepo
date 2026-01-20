import * as React from 'react';
import { IconTrash } from '@tabler/icons-react';

export interface DeleteZoneProps {
  isVisible: boolean;
  isDragOver: boolean;
  isDragging?: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

/**
 * Componente profesional y reutilizable de zona de eliminación para drag & drop.
 * UI/UX fiel al original, pero desacoplado y mejorado.
 */
export function DeleteZone({
  isVisible,
  isDragOver,
  isDragging = false,
  onDragOver,
  onDragLeave,
  onDrop,
}: DeleteZoneProps) {
  if (!isVisible) return null;

  return (
    <footer
      className={`
        fixed left-0 right-0 bottom-0 z-40 w-full transition-all duration-300 ease-in-out
        ${isDragOver
          ? 'bg-red-500/90 scale-[1.02] shadow-2xl border-red-300'
          : isDragging
            ? 'bg-red-400/80 hover:bg-red-500/80 border-red-300/50'
            : 'bg-slate-200/60 dark:bg-slate-700/60 hover:bg-red-400/60 dark:hover:bg-red-500/60 border-slate-300/50 dark:border-slate-600/50'
        }
        backdrop-blur-sm rounded-t-xl p-2 border-t-4 border-dashed
        shadow-lg hover:shadow-xl cursor-pointer flex flex-col items-center
        ${isDragging ? 'animate-pulse' : ''}
      `}
      style={{ pointerEvents: 'auto' }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div
        className={`
        flex items-center justify-center space-x-3 transition-all duration-200
        ${isDragOver
            ? 'text-white'
            : isDragging
              ? 'text-red-100 dark:text-red-200'
              : 'text-slate-600 dark:text-slate-400'
          }
      `}
      >
        <IconTrash
          className={`
          ${isDragOver ? 'w-6 h-6' : 'w-5 h-5'}
          transition-all duration-200
          ${isDragging ? 'animate-bounce' : ''}
        `}
          stroke={2}
        />
        <span className="font-semibold text-sm sm:text-base">
          {isDragOver
            ? 'Suelta para eliminar tarea'
            : isDragging
              ? 'Suelta aquí para eliminar'
              : 'Arrastra tareas aquí para eliminar'}
        </span>
      </div>
      {isDragging && !isDragOver && (
        <div className="mt-2 text-center">
          <div className="inline-flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-ping" />
            <span>Listo para eliminar</span>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-ping" />
          </div>
        </div>
      )}
    </footer>
  );
}
