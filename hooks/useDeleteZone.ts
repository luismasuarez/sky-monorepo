import { useState, useCallback } from 'react';

export interface UseDeleteZoneResult {
  isDeleteZoneVisible: boolean;
  isDeleteZoneDragOver: boolean;
  setDeleteZoneVisible: (visible: boolean) => void;
  handleDeleteZoneDragOver: (e: React.DragEvent) => void;
  handleDeleteZoneDragLeave: (e: React.DragEvent) => void;
  handleDeleteZoneDrop: (e: React.DragEvent) => void;
}

/**
 * Hook profesional y reutilizable para manejar la zona de eliminación en drag & drop.
 * Cumple principios SOLID y desacopla la lógica de UI.
 */
export function useDeleteZone(onDrop: (e: React.DragEvent) => void): UseDeleteZoneResult {
  const [isDeleteZoneVisible, setDeleteZoneVisible] = useState(false);
  const [isDeleteZoneDragOver, setDeleteZoneDragOver] = useState(false);

  const handleDeleteZoneDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDeleteZoneDragOver(true);
  }, []);

  const handleDeleteZoneDragLeave = useCallback(() => {
    setDeleteZoneDragOver(false);
  }, []);

  const handleDeleteZoneDrop = useCallback(
    (e: React.DragEvent) => {
      setDeleteZoneDragOver(false);
      onDrop(e);
    },
    [onDrop]
  );

  return {
    isDeleteZoneVisible,
    isDeleteZoneDragOver,
    setDeleteZoneVisible,
    handleDeleteZoneDragOver,
    handleDeleteZoneDragLeave,
    handleDeleteZoneDrop,
  };
}
