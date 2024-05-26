import { create } from "zustand";

type OpenCategorieState = {
    id?: string;
    isOpen: boolean;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useOpenCategorie = create<OpenCategorieState>((set) => ({
    id: undefined,
    isOpen: false,
    onOpen: (id: string) => set({ id, isOpen: true }),
    onClose: () => set({ isOpen: false, id: undefined }),
}))

