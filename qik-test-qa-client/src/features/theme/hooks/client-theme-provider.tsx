"use client";

import { useEffect, ReactNode } from "react";
import { UserTheme, UserDTO, updateAuthorizedUser } from "@/entities/user";
import {useUIStore} from "@state";

interface ClientThemeProviderProps {
  children: ReactNode;
  user: UserDTO | null;
}

export const ClientThemeProvider = ({
                                      children,
                                      user,
                                    }: ClientThemeProviderProps) => {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  // 1. Инициализация при маунте
  useEffect(() => {
    // Если у юзера есть тема, используем её
    if (user?.theme && Object.values(UserTheme).includes(user.theme as UserTheme)) {
      setTheme(user.theme);
      return;
    }

    // Иначе пробуем достать из localStorage
    try {
      const localTheme = localStorage.getItem("theme") as UserTheme;
      if (localTheme && Object.values(UserTheme).includes(localTheme)) {
        setTheme(localTheme);
      }
    } catch (e) {
      console.warn("Ошибка доступа к localStorage", e);
    }
  }, [user, setTheme]);

  // 2. Реакция на изменение темы
  useEffect(() => {
    if (!theme) return;

    // A. Меняем CSS классы
    const root = document.documentElement;
    if (theme === UserTheme.dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // B. Сохраняем локально
    try {
      localStorage.setItem("theme", theme);
    } catch (e) { /* ignore */ }

    // C. Сохраняем на бэкенд (Безопасный вызов)
    const saveThemeToApi = async () => {
      // Пропускаем, если юзера нет или тема совпадает с той, что уже в базе
      if (!user || user.theme === theme) return;

      try {
        console.log(`Сохранение темы: ${theme}...`);

        await updateAuthorizedUser({
          method: "PUT",
          body: { theme },
        });

        console.log("Тема успешно сохранена на сервере.");
      } catch (error: any) {
        // Мы ловим ошибку здесь, чтобы она не краснила консоль Next.js
        console.warn("⚠️ Не удалось сохранить тему на сервере.");

        // Попытка показать полезную инфу
        if (error?.message) {
          console.warn("Сообщение сервера:", error.message);
        }

        // Совет для отладки
        console.warn("Проверьте вкладку Network -> Response. Возможно, бэкенд ждет 'DARK' вместо 'dark'?");
      }
    };

    saveThemeToApi();

  }, [theme, user]);

  return <>{children}</>;
};