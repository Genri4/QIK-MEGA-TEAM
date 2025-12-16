"use client";

import { useEffect, useRef } from "react";
import { MessagesDTO, MessageCard } from "@/entities/messages";
import { SendMessageForm } from "@/features/send-message";
// UserTheme импорт не нужен, если мы используем CSS классы dark:

interface ChatWindowProps {
    chatId: string;
    chatTitle?: string;
    messages: MessagesDTO[];
    // currentTheme: UserTheme; // Убрали, т.к. стили работают через Tailwind dark: классы
    isLoading?: boolean;

    // ВАЖНО: Тип изменен. Теперь ждем функцию, принимающую текст,
    // чтобы соединить "глупую" форму и умный HomePage.
    onNewMessage: (text: string) => void;
}

export const ChatWindow = ({
                               chatId,
                               chatTitle,
                               messages,
                               isLoading,
                               onNewMessage,
                           }: ChatWindowProps) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-[#121212] dark:text-gray-200 relative transition-colors">
            <header className="flex items-center justify-center border-b border-gray-100 dark:border-white/10 p-3 h-14 shrink-0">
                <h2 className="text-sm text-gray-400 font-medium truncate">
                    {chatTitle || "Новый чат"}
                </h2>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                {isLoading && messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        Загрузка сообщений...
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center opacity-50 mt-[-50px]">
                        <div className="text-2xl font-semibold mb-2">QIK</div>
                        <p>Напишите что-нибудь, чтобы начать диалог</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {messages.map((msg) => (
                            <MessageCard key={msg.id} message={msg} />
                        ))}
                        <div ref={bottomRef} className="h-1" />
                    </div>
                )}
            </div>

            <div className="p-4 pt-0 w-full mx-auto pb-6">
                <SendMessageForm
                    isLoading={isLoading}
                    onMessageSent={onNewMessage}
                />
            </div>
        </div>
    );
};