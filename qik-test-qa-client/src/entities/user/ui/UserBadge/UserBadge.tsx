"use client";

import { clsx } from "clsx";
import { Moon, Sun, LogOut } from "lucide-react";
import { UserDTO, UserTheme } from "@/entities/user";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface UserBadgeProps {
    user: UserDTO;
    currentTheme: UserTheme; // Принимаем текущую тему из пропсов
    className?: string;
    onLogout?: () => void;
    onThemeToggle?: (isDark: boolean) => void;
}

export const UserBadge = ({
                              user,
                              currentTheme,
                              className,
                              onLogout,
                              onThemeToggle,
                          }: UserBadgeProps) => {
    const initials = user.name.slice(0, 2).toUpperCase();
    const isDark = currentTheme === UserTheme.dark;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div
                    className={clsx(
                        "w-full flex items-center gap-3 p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl cursor-pointer transition-colors",
                        className
                    )}
                >
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col items-start overflow-hidden">
            <span className="font-medium text-sm truncate w-full text-left text-gray-900 dark:text-gray-100">
              {user.name}
            </span>
                        <span className="text-[10px] text-gray-500 truncate w-full text-left">
              {user.email}
            </span>
                    </div>
                </div>
            </PopoverTrigger>

            <PopoverContent
                side="top"
                align="start"
                className="w-[280px] p-2 rounded-2xl mb-2 shadow-xl border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1a1a]"
            >
                <div className="flex items-center gap-3 p-2 mb-2 border-b border-gray-100 dark:border-gray-800 pb-4">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
             <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                {user.name}
             </span>
                        <span className="text-xs text-gray-500">
                {user.email}
             </span>
                    </div>
                </div>

                {/* Переключатель темы с Shadcn Switch */}
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors mb-2">
                    <div className="flex items-center gap-2">
                        {isDark ? <Moon size={16} className="text-gray-500" /> : <Sun size={16} className="text-gray-500" />}
                        <Label htmlFor="theme-mode" className="text-sm font-medium cursor-pointer text-gray-700 dark:text-gray-300">
                            Темная тема
                        </Label>
                    </div>

                    <Switch
                        id="theme-mode"
                        checked={isDark}
                        onCheckedChange={onThemeToggle}
                    />
                </div>

                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 h-9 px-2 font-medium"
                    onClick={onLogout}
                >
                    <LogOut size={16} className="mr-2" />
                    Выйти из аккаунта
                </Button>
            </PopoverContent>
        </Popover>
    );
};