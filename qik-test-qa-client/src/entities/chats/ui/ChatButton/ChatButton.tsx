"use client"

import { useState, useRef, useEffect } from "react";
import { Buttons } from "@shared";
import { Ellipsis, MessageSquare, Trash2, Pencil } from "lucide-react";
import { clsx } from "clsx";
import type { ChatsDTO } from "@entities";

interface ChatButtonProps {
    chat: ChatsDTO;
    isActive?: boolean;
    onClick?: () => void;
    onDelete?: (id: string) => void;
    onEdit?: (id: string, newTitle: string) => void;
}

export const ChatButton = ({
                               chat,
                               isActive,
                               onClick,
                               onDelete,
                               onEdit
                           }: ChatButtonProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMenuToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(false);
        onEdit?.(chat.id, chat.title);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(false);
        onDelete?.(chat.id);
    };

    return (
        <Buttons.IconButtonBoth
            onClick={onClick}
            className={clsx(
                "transition-colors cursor-pointer border border-transparent group relative rounded-md",
                isActive
                    ? "bg-[#EFEFEF] dark:bg-[#1E1E1E] "
                    : "bg-transparent hover:bg-[#F5F5F5] dark:hover:bg-[#1E1E1E] dark:bg-[#121212]"
            )}
            firstIcon={<MessageSquare size={18} className="opacity-70" />}
            secondIcon={
                <div className="relative h-5 w-5 flex items-center justify-center" ref={menuRef}>
                    <button
                        onClick={handleMenuToggle}
                        className={clsx(
                            "flex items-center cursor-pointer justify-center rounded-sm transition-colors hover:bg-black/10 text-gray-500",
                            isMenuOpen ? "bg-black/10 text-black" : "opacity-0 group-hover:opacity-100 focus:opacity-100"
                        )}
                    >
                        <Ellipsis size={16} />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 top-6 z-10 w-32 origin-top-right rounded-md bg-white dark:bg-[#121212] dark:ring-gray-700 shadow-lg ring-1 ring-gray-200 ring-opacity-5 focus:outline-none py-1">
                            {onDelete && (
                                <button
                                    onClick={handleDelete}
                                    className="flex w-full rounded-md cursor-pointer items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950 gap-2"
                                >
                                    <Trash2 size={14} />
                                    <span>Delete</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            }
        >
            <span className="truncate text-sm text-left flex-1 px-2 max-w-[160px]">{chat.title}</span>
        </Buttons.IconButtonBoth>
    );
};