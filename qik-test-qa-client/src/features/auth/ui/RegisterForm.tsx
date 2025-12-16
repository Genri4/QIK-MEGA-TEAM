"use client";

import { useState } from "react";
import { User, Mail, Key } from "lucide-react";
import { registerUser, UserDTO } from "@/entities/user";
import { Inputs } from "@/shared/ui/Inputs";

interface RegisterFormProps {
    onSuccess: (user: UserDTO) => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setError("");
        if (!name || !email || !password) {
            setError("Заполните все поля");
            return;
        }
        if (password !== confirmPass) {
            setError("Пароли не совпадают");
            return;
        }

        setIsLoading(true);

        try {
            const response = await registerUser({
                method: "POST",
                body: { name, email, password }
            });

            if (response?.user) {
                onSuccess(response.user);
            }
        } catch (e) {
            console.error(e);
            setError("Ошибка регистрации");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Inputs.TextField
                placeholder="Логин"
                value={name}
                onChange={(e) => setName(e.target.value)}
                endIcon={<User size={18} />}
                wrapperClassName="bg-[#F9F9F9] border-none py-3"
            />
            <Inputs.TextField
                placeholder="Почта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                endIcon={<Mail size={18} />}
                wrapperClassName="bg-[#F9F9F9] border-none py-3"
            />
            <Inputs.TextField
                placeholder="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endIcon={<Key size={18} />}
                wrapperClassName="bg-[#F9F9F9] border-none py-3"
            />
            <Inputs.TextField
                placeholder="Повторите пароль"
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                endIcon={<Key size={18} />}
                wrapperClassName="bg-[#F9F9F9] border-none py-3"
            />

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-4 bg-[#454545] text-white font-medium rounded-xl hover:bg-black transition-colors disabled:opacity-50 mt-4"
            >
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
            </button>
        </>
    );
};