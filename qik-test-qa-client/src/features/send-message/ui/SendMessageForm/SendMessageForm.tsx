"use client";

import React, { KeyboardEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Inputs } from "@/shared/ui/Inputs";
import { useUIStore } from "@state";
import { UserTheme } from "@entities";

interface SendMessageFormProps {
  // Убираем chatId из пропсов, он тут не нужен, так как отправляет родитель
  // chatId?: string;

  // Теперь ожидаем, что родитель примет строку или объект (как у вас в HomePage)
  onMessageSent?: (text: string) => void;
  className?: string;
  isLoading?: boolean; // Принимаем состояние загрузки снаружи
}

export const SendMessageForm = ({
  onMessageSent,
  className,
  isLoading,
}: SendMessageFormProps) => {
  // Локальный стейт только для текста
  const [text, setText] = useState("");
  const { theme } = useUIStore();

  const handleSend = () => {
    if (!text.trim() || isLoading) return;

    // 1. Просто передаем текст наверх. НЕ делаем запросов тут.
    onMessageSent?.(text);

    // 2. Очищаем поле
    setText("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={className}>
      <Inputs.TextField
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Напишите что-то тут"
        disabled={isLoading}
        wrapperClassName="shadow-sm"
        endIcon={
          <button
            onClick={handleSend}
            disabled={!text.trim() || isLoading}
            className="p-1.5 rounded-md bg-black/80 dark:bg-white text-white hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowRight size={16} color={theme === UserTheme.dark ? "#000000" : "#ffffff"} />
          </button>
        }
      />
    </div>
  );
};