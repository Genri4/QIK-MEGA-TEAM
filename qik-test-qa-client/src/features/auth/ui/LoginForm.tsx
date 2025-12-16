"use client";

import { useState } from "react";
import { User, Key } from "lucide-react";
import { loginUser, UserDTO } from "@/entities/user";
import { Inputs } from "@/shared/ui/Inputs";

interface LoginFormProps {
  onSuccess: (user: UserDTO) => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser({
        method: "POST",
        body: { email, password },
      });

      console.log(response);

      if (response?.user) {
        onSuccess(response.user);
      }
    } catch (e) {
      console.error(e);
      setError("Неверный логин или пароль");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Inputs.TextField
        placeholder="Почта"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        endIcon={<User size={18} />}
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

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full py-4 bg-[#454545] text-white font-medium rounded-xl hover:bg-black transition-colors disabled:opacity-50 mt-4"
      >
        {isLoading ? "Вход..." : "Войти"}
      </button>
    </>
  );
};
