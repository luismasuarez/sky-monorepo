import { useCallback, useState } from 'react';

export interface PendingMove {
  cardId: string;
  fromColumnId: string;
  toColumnId: string;
}

export function useMoveConfirmationModal() {
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);

  // Llama esto cuando se detecta un intento de mover desde 'done'
  const requestMove = useCallback((cardId: string, fromColumnId: string, toColumnId: string) => {
    setPendingMove({ cardId, fromColumnId, toColumnId });
    setShowMoveModal(true);
  }, []);

  // Llama esto para confirmar el movimiento
  const confirmMove = useCallback(
    (onMove: (cardId: string, fromColumnId: string, toColumnId: string) => void) => {
      if (pendingMove) {
        onMove(pendingMove.cardId, pendingMove.fromColumnId, pendingMove.toColumnId);
        setPendingMove(null);
      }
      setShowMoveModal(false);
    },
    [pendingMove]
  );

  // Llama esto para cancelar
  const cancelMove = useCallback(() => {
    setPendingMove(null);
    setShowMoveModal(false);
  }, []);

  return {
    showMoveModal,
    pendingMove,
    requestMove,
    confirmMove,
    cancelMove,
  };
}
