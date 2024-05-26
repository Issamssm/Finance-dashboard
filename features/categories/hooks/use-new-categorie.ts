import { create } from "zustand";

type NewCategorieState = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useNewCategorie = create<NewCategorieState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))