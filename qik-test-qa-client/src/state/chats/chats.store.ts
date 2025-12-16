import { create } from "zustand";
import {
    ChatsDTO,
    getChatsByChatList,
    createChat,
    deleteChat,
    updateChat
} from "@/entities/chats";

interface ChatsStore {
    chats: ChatsDTO[];
    activeChatId: string | undefined;
    isLoading: boolean;
    error: string | null;

    fetchChats: () => Promise<void>;
    selectChat: (id: string) => void;
    // ИЗМЕНЕНИЕ: принимаем опциональный заголовок и возвращаем ID
    createNewChat: (title?: string) => Promise<string | null>;
    deleteChatById: (id: string) => Promise<void>;
    updateChatTitle: (id: string, newTitle: string) => Promise<void>;
    reset: () => void;
}

export const useChatsStore = create<ChatsStore>((set, get) => ({
    chats: [],
    activeChatId: undefined,
    isLoading: false,
    error: null,

    fetchChats: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await getChatsByChatList({
                method: "GET",
                query: { page: 1, limit: 100 },
            });
            const sortedChats = response.chats.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            set({ chats: sortedChats, isLoading: false });
        } catch (error) {
            console.error("Fetch chats error:", error);
            set({ isLoading: false, error: "Не удалось загрузить чаты" });
        }
    },

    selectChat: (id: string) => {
        set({ activeChatId: id });
    },

    // ИЗМЕНЕНИЕ: Логика создания
    createNewChat: async (title?: string) => {
        try {
            const response = await createChat({
                method: "POST",
                body: { title: title || "Новый чат" },
            });

            const newChat = response.chat;

            set((state) => ({
                chats: [newChat, ...state.chats],
                activeChatId: newChat.id,
            }));

            // Возвращаем ID нового чата
            return newChat.id;
        } catch (error) {
            console.error("Create chat error:", error);
            return null;
        }
    },

    deleteChatById: async (id: string) => {
        const currentChats = get().chats;
        const currentActiveId = get().activeChatId;

        set((state) => ({
            chats: state.chats.filter((c) => c.id !== id),
            activeChatId: state.activeChatId === id ? undefined : state.activeChatId,
        }));

        try {
            await deleteChat({ method: "DELETE", params: { id } });
        } catch (error) {
            set({ chats: currentChats, activeChatId: currentActiveId });
        }
    },

    updateChatTitle: async (id: string, newTitle: string) => {
        const currentChats = get().chats;
        set((state) => ({
            chats: state.chats.map((c) => c.id === id ? { ...c, title: newTitle } : c),
        }));
        try {
            await updateChat({ method: "PUT", params: { id }, body: { title: newTitle } });
        } catch (error) {
            set({ chats: currentChats });
        }
    },

    reset: () => {
        set({ chats: [], activeChatId: undefined, isLoading: false, error: null });
    },
}));