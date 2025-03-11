"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
  }) => {
    if (data.password !== data.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (!data.acceptTerms) {
      setError("Вы должны принять условия использования");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Ошибка регистрации");
      }

      setSuccess(true);
      setError(null);
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {error && (
          <div className="mb-4 p-3 bg-destructive/15 border border-destructive text-destructive rounded-md text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="w-full max-w-md bg-background p-6 rounded-lg border border-border">
            <div className="p-3 mb-4 bg-green-500/15 border border-green-500 text-green-500 rounded-md">
              <h3 className="font-semibold mb-1">Регистрация успешна!</h3>
              <p>
                Пожалуйста, проверьте вашу электронную почту для подтверждения
                аккаунта.
              </p>
            </div>
            <p className="mb-4 text-center text-muted-foreground">
              Мы отправили письмо с ссылкой для подтверждения на указанный вами
              адрес. Пожалуйста, перейдите по ссылке в письме для активации
              вашего аккаунта.
            </p>
            <Button className="w-full" onClick={() => router.push("/login")}>
              Перейти к странице входа
            </Button>
          </div>
        ) : (
          <RegisterForm
            onSubmit={handleRegister}
            onLoginClick={() => router.push("/login")}
          />
        )}

        <div className="mt-6 text-center text-sm">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}
