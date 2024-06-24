// src/hooks/useConfirmModal.ts
import { create } from 'zustand';

interface ConfirmModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onConfirm: () => void;
    setConfirmAction: (action: () => void) => void;
}

const useConfirmModal = create<ConfirmModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    onConfirm: () => {}, // This will be set dynamically
    setConfirmAction: (action) => set({ onConfirm: action })
}));

export default useConfirmModal;
