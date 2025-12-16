import { create } from "zustand";
import {
    MessagesDTO,
    getMessagesByChatList,
    createMessage,
    SenderType
} from "@/entities/messages";

interface MessagesStore {
    messages: MessagesDTO[];
    isLoading: boolean;
    isSending: boolean;
    error: string | null;

    fetchMessages: (chatId: string) => Promise<void>;
    sendMessage: (chatId: string, content: string) => Promise<void>;
    clearMessages: () => void;
}

// Переменная для хранения контроллера отмены запроса (вне стора, чтобы не засорять стейт)
let fetchAbortController: AbortController | null = null;

export const useMessagesStore = create<MessagesStore>((set, get) => ({
    messages: [],
    isLoading: false,
    isSending: false,
    error: null,

    fetchMessages: async (chatId: string) => {
        if (!chatId) return;

        // 1. Отменяем предыдущий запрос, если он был
        if (fetchAbortController) {
            fetchAbortController.abort();
        }
        fetchAbortController = new AbortController();

        // 2. Очищаем сообщения СРАЗУ, чтобы не было видно старого чата
        set({ isLoading: true, error: null, messages: [] });

        try {
            const response = await getMessagesByChatList({
                method: "GET",
                params: { chatId },
                query: { page: 1, limit: 100 },
                // @ts-ignore: Если твой fetcher поддерживает signal, это отменит запрос на уровне сети
                signal: fetchAbortController.signal
            });

            // 3. Сортировка (старые сверху)
            const sortedMessages = response.messages.sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );

            // 4. ЖЕСТКАЯ ДЕДУПЛИКАЦИЯ ПО ID
            // Даже если бэкенд вернет дубли, мы их схлопнем
            const uniqueMessagesMap = new Map();
            sortedMessages.forEach(msg => uniqueMessagesMap.set(msg.id, msg));
            const uniqueMessages = Array.from(uniqueMessagesMap.values()) as MessagesDTO[];

            set({ messages: uniqueMessages, isLoading: false });

        } catch (error: any) {
            // Игнорируем ошибку отмены запроса
            if (error.name === 'AbortError' || error.message === 'canceled') return;

            console.error("Fetch messages error:", error);
            set({ isLoading: false, error: "Не удалось загрузить сообщения" });
        }
    },

    sendMessage: async (chatId: string, content: string) => {
        set({ isSending: true, error: null });

        try {
            const response = await createMessage({
                method: "POST",
                params: { chatId },
                body: {
                    content,
                    sender: SenderType.USER,
                },
            });

            set((state) => {
                // 5. ПРОВЕРКА ПЕРЕД ДОБАВЛЕНИЕМ НОВОГО
                // Если такое сообщение уже есть (например, прилетело по сокету или дубль клика), не добавляем
                const exists = state.messages.some(m => m.id === response.message.id);
                if (exists) return state;

                return {
                    messages: [...state.messages, response.message],
                    isSending: false,
                };
            });

        } catch (error) {
            console.error("Send message error:", error);
            set({ isSending: false, error: "Не удалось отправить сообщение" });
        }
    },

    clearMessages: () => {
        // При очистке тоже отменяем активный запрос
        if (fetchAbortController) {
            fetchAbortController.abort();
            fetchAbortController = null;
        }
        set({ messages: [], isLoading: false, error: null });
    },
}));