"use client";

import { clsx } from "clsx";
import { Plus, MessageSquarePlus, Scroll } from "lucide-react";
import { Buttons } from "@shared";
import { ChatButton, ChatsDTO } from "@/entities/chats";
import { UserBadge, UserDTO, UserTheme } from "@/entities/user"; // Import UserTheme
import LogoBlock from "@/shared/ui/LogoBlock/LogoBlock";

interface SidebarProps {
  className?: string;
  chats: ChatsDTO[];
  activeChatId?: string;
  user: UserDTO;

  // Добавляем проп для темы
  currentTheme: UserTheme;

  isLoading?: boolean;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onEditChat: (id: string, newTitle: string) => void;
  onLogout?: () => void;
  onThemeToggle?: (isDark: boolean) => void;
}

export const Sidebar = ({
                          className,
                          chats,
                          activeChatId,
                          user,
                          currentTheme, // Получаем тему
                          isLoading,
                          onNewChat,
                          onSelectChat,
                          onDeleteChat,
                          onEditChat,
                          onLogout,
                          onThemeToggle,
                        }: SidebarProps) => {
  return (
      <aside
          className={clsx(
              "flex h-full w-[260px] shrink-0 flex-col bg-[#F9F9F9] dark:bg-[#121212] p-3 border-r border-gray-200 dark:border-white/10 transition-colors",
              className,
          )}
      >
        <div className="flex items-center gap-2 mb-6 px-2 pt-2">
          <LogoBlock />
        </div>

        <Buttons.IconButtonBoth
            onClick={onNewChat}
            className="bg-[#F5F5F5] dark:bg-[#1E1E1E] rounded-md mb-5 cursor-pointer dark:text-gray-200"
            firstIcon={<Scroll size={18} />}
            secondIcon={<Plus size={18} />}
        >
          Новый чат
        </Buttons.IconButtonBoth>

        <div className="flex-1 overflow-y-auto overflow-x-hidden -mx-2 px-2 space-y-1 custom-scrollbar">
          <div className="text-xs font-semibold text-gray-400 px-2 mb-2 uppercase tracking-wider">
            История
          </div>

          {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                      key={i}
                      className="h-10 w-full bg-gray-200/50 dark:bg-white/5 rounded-md animate-pulse mb-2"
                  />
              ))
              : chats.map((chat) => (
                  <ChatButton
                      key={chat.id}
                      chat={chat}
                      isActive={chat.id === activeChatId}
                      onClick={() => onSelectChat(chat.id)}
                      onDelete={onDeleteChat}
                      onEdit={onEditChat}
                  />
              ))}

          {!isLoading && chats.length === 0 && (
              <div className="flex flex-col items-center justify-center text-gray-400 mt-10 gap-2">
                <MessageSquarePlus size={32} className="opacity-20" />
                <span className="text-sm">Нет чатов</span>
              </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-white/10">
          <UserBadge
              user={user}
              currentTheme={currentTheme} // Передаем в UserBadge
              onLogout={onLogout}
              onThemeToggle={onThemeToggle}
          />
        </div>
      </aside>
  );
};