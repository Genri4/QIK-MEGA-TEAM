import { clsx } from "clsx";
import React from "react";

type ButtonProps<T extends HTMLElement = HTMLElement> = React.PropsWithChildren &
    React.HTMLAttributes<T> & {
    className?: string;
    icon?: React.ReactNode;
};

type ButtonBothProps<T extends HTMLElement = HTMLElement> = React.PropsWithChildren &
    React.HTMLAttributes<T> & {
    className?: string;
    firstIcon?: React.ReactNode;
    secondIcon?: React.ReactNode;
};

// ДОБАВИЛ ...props
const IconButton = ({ children, className, icon, ...props }: ButtonProps) => (
    <div
        className={clsx("w-full mx-1 flex gap-2 items-center bg-[#EFEFEF] p-2 px-4 rounded-md cursor-pointer", className)}
        {...props} // <-- Самое важное: передаем onClick и другие HTML атрибуты
    >
        {icon}
        {children}
    </div>
);

// ДОБАВИЛ ...props
const IconButtonBoth = ({ children, className, firstIcon, secondIcon, ...props }: ButtonBothProps) => (
    <div
        className={clsx("w-full mx-1 flex items-center justify-between p-2 px-4 cursor-pointer", className)}
        {...props} // <-- Самое важное: передаем onClick и другие HTML атрибуты
    >
        <div className="flex gap-2 items-center">
            {firstIcon}
            {children}
        </div>
        {secondIcon}
    </div>
);

export const Buttons = {
    IconButton,
    IconButtonBoth
};