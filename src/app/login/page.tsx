"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import { createClient } from "@/lib/supabase/client";
import { LoginData } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleLogin = async (data: LoginData) => {
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message || "Ошибка входа");
    }
  };

  const handleForgotPassword = async () => {
    router.push("/forgot-password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {error && (
          <div className="mb-4 p-3 bg-destructive/15 border border-destructive text-destructive rounded-md">
            {error}
          </div>
        )}

        <LoginForm
          onSubmit={handleLogin}
          onForgotPassword={handleForgotPassword}
        />

        <div className="mt-6 text-center text-sm">
          Нет аккаунта?{" "}
          <Link 
            href="/register" 
            className="text-primary hover:underline"
          >
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
}
