import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { clsx } from "clsx";
import {LogoIcon} from "@icons";

interface AuthLayoutProps {
    title: string;
    children: ReactNode;
    footerLink: ReactNode;
    onBack?: () => void;
}

export const AuthLayout = ({ title, children, footerLink, onBack }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F9FA] relative">

            <div className="absolute top-10 left-10">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 bg-[#F3F3F3] hover:bg-[#e5e5e5] rounded-lg text-gray-700 transition-colors font-medium"
                >
                    <ArrowLeft size={18} />
                    <span>Назад</span>
                </button>
            </div>

            <div className="bg-[#F3F3F3] w-full max-w-[500px] p-10 rounded-[40px] shadow-sm flex flex-col items-center">

                <div className="mb-6 relative">
                    <div className="transform scale-150">
                        <LogoIcon />
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-8 text-black">{title}</h1>

                <div className="w-full space-y-4">
                    {children}
                </div>

                <div className="mt-8 text-sm text-gray-500">
                    {footerLink}
                </div>
            </div>
        </div>
    );
};