"use client";

import React, { useEffect, useState } from "react";
import { Page } from "@/shared/ui/templates/page";

// Entities & Types
import { MessagesDTO } from "@/entities/messages";
import { UserDTO, UserTheme } from "@/entities/user";

// Widgets & Features
import { AuthLayout } from "@/widgets/auth-layout/ui";
import { LoginForm, RegisterForm } from "@/features/auth/ui";
import { Sidebar } from "@/widgets/sidebar/ui";
import { ChatWindow } from "@/widgets/chat-window/ui";

// Stores
import { useChatsStore } from "@/state/chats";
import { useMessagesStore } from "@/state/messages";
import { useUserStore, useUIStore } from "@state"; // Импортируем UI store

export const HomePage = () => {
    const { user, setUser, clearUser } = useUserStore();

    // UI Store для темы
    const { theme, setTheme } = useUIStore();

    const {
        chats,
        activeChatId,
        isLoading: isChatsLoading,
        fetchChats,
        createNewChat,
        selectChat,
        deleteChatById,
        updateChatTitle,
        reset: resetChats
    } = useChatsStore();

    const {
        messages,
        isLoading: isMessagesLoading,
        fetchMessages,
        sendMessage,
        clearMessages
    } = useMessagesStore();

    const [authView, setAuthView] = useState<"login" | "register">("login");

    // --- EFFECTS ---

    useEffect(() => {
        if (user) {
            fetchChats();
        }
    }, [user, fetchChats]);

    useEffect(() => {
        if (activeChatId) {
            fetchMessages(activeChatId);
        } else {
            clearMessages();
        }
    }, [activeChatId, fetchMessages, clearMessages]);

    // --- HANDLERS ---

    const handleAuthSuccess = (loggedInUser: UserDTO) => {
        setUser(loggedInUser);
    };

    const handleLogout = () => {
        clearUser();
        resetChats();
        clearMessages();
        setAuthView("login");
    };

    const handleSendMessage = async (input: string | MessagesDTO) => {
        const content = typeof input === "string" ? input : input.content;
        let targetChatId = activeChatId;

        if (!targetChatId) {
            const title = content.slice(0, 30) + (content.length > 30 ? "..." : "");
            const newChatId = await createNewChat(title);
            if (newChatId) {
                targetChatId = newChatId;
            } else {
                return;
            }
        }
        if (targetChatId) {
            await sendMessage(targetChatId, content);
        }
    };

    // Обработчик переключения темы
    const handleThemeToggle = (isDark: boolean) => {
        setTheme(isDark ? UserTheme.dark : UserTheme.light);
    };

    // --- RENDER ---

    if (!user) {
        const isLogin = authView === "login";
        return (
            <AuthLayout
                title={isLogin ? "Авторизация" : "Регистрация"}
                onBack={() => {}}
                footerLink={
                    isLogin ? (
                        <>Нет аккаунта? <button onClick={() => setAuthView("register")} className="text-primary hover:underline font-medium">Зарегистрироваться</button></>
                    ) : (
                        <>Есть аккаунт? <button onClick={() => setAuthView("login")} className="text-primary hover:underline font-medium">Войти</button></>
                    )
                }
            >
                {isLogin ? <LoginForm onSuccess={handleAuthSuccess} /> : <RegisterForm onSuccess={handleAuthSuccess} />}
            </AuthLayout>
        );
    }

    return (
        <Page
            Sidebar={
                <Sidebar
                    chats={chats}
                    activeChatId={activeChatId}
                    user={user}

                    // Передаем текущую тему из стора
                    currentTheme={theme}

                    isLoading={isChatsLoading}
                    onNewChat={() => createNewChat()}
                    onSelectChat={selectChat}
                    onEditChat={updateChatTitle}
                    onDeleteChat={deleteChatById}
                    onLogout={handleLogout}

                    // Передаем обработчик
                    onThemeToggle={handleThemeToggle}

                    className="h-full border-r border-sidebar-border bg-sidebar"
                />
            }
            Main={
                <ChatWindow
                    chatId={activeChatId || ""}
                    chatTitle={chats.find((c) => c.id === activeChatId)?.title}
                    messages={messages}
                    isLoading={isMessagesLoading}
                    onNewMessage={handleSendMessage}
                />
            }
        />
    );
};