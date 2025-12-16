import { clsx } from "clsx";
import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    wrapperClassName?: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
};

const TextField = ({
                       className,
                       wrapperClassName,
                       startIcon,
                       endIcon,
                       ...props
                   }: InputProps) => (
    <div className={clsx("w-full flex gap-2 items-center bg-white dark:bg-[#121212] border border-[#E5E5E5] p-3 px-4 rounded-xl focus-within:border-gray-400 transition-colors", wrapperClassName)}>
        {startIcon && <div className="flex items-center justify-center text-gray-500">{startIcon}</div>}
        <input
            className={clsx("w-full bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400", className)}
            {...props}
        />
        {endIcon && <div className="flex items-center justify-center text-gray-500">{endIcon}</div>}
    </div>
);

export const Inputs = {
    TextField
};