import { clsx } from "clsx";
import { User, Bot } from "lucide-react";
import { MessagesDTO, SenderType } from "@entities";

interface MessageCardProps {
    message: MessagesDTO;
}

export const MessageCard = ({ message }: MessageCardProps) => {
    const isAi = message.sender === SenderType.SENDER;

    return (
        <div className={clsx(
            "group w-full border-b border-black/5 dark:border-white/5 transition-colors",
            // Текст: темный в светлой теме, светлый в темной
            "text-gray-800 dark:text-gray-100",
            // Фон:
            isAi
                ? "bg-[#F7F7F8] dark:bg-[#1e1e1e]" // Светло-серый (Light) / Чуть светлее черного (Dark)
                : "bg-white dark:bg-transparent"    // Белый (Light) / Прозрачный или основной черный (Dark)
        )}>
            <div className="flex gap-4 p-4 m-auto max-w-3xl text-base md:gap-6 md:py-6">

                {/* Аватар */}
                <div className={clsx(
                    "relative flex h-8 w-8 shrink-0 flex-col items-center justify-center rounded-sm",
                    isAi
                        ? "bg-emerald-500"
                        : "bg-gray-400 dark:bg-gray-600" // Чуть темнее серый для юзера в темной теме
                )}>
                    {isAi ? (
                        <Bot className="h-5 w-5 text-white" />
                    ) : (
                        <User className="h-5 w-5 text-white" />
                    )}
                </div>

                {/* Контент */}
                <div className="relative flex-1 overflow-hidden">
                    {/* Имя отправителя */}
                    <div className="font-semibold text-sm mb-1 opacity-90 text-gray-900 dark:text-gray-200">
                        {isAi ? "QIK" : "You"}
                    </div>

                    {/* Текст сообщения */}
                    {/* dark:prose-invert инвертирует цвета типографики для темного фона */}
                    <div className="prose prose-slate dark:prose-invert max-w-none break-words whitespace-pre-wrap leading-7">
                        {message.content}
                    </div>
                </div>
            </div>
        </div>
    );
};