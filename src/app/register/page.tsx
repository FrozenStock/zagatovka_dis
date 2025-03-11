"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";
import { createClient } from "@/lib/supabase/client";
import { RegisterData } from "@/types/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleRegister = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      setSuccess(true);
    } catch (error: any) {
      setError(error.message || "Ошибка при создании аккаунта");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {error && (
          <div className="mb-4 p-3 bg-destructive/15 border border-destructive text-destructive rounded-md">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-background p-6 rounded-lg border">
            <div className="p-3 mb-4 bg-green-500/15 border border-green-500 text-green-500 rounded-md">
              <h3 className="font-semibold mb-1">Регистрация успешна!</h3>
              <p>Проверьте вашу почту для подтверждения аккаунта.</p>
            </div>
            <Button 
              className="w-full" 
              onClick={() => router.push("/login")}
            >
              Перейти к входу
            </Button>
          </div>
        ) : (
          <RegisterForm
            onSubmit={handleRegister}
            onLoginClick={() => router.push("/login")}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
