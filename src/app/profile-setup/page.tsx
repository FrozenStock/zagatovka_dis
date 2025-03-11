"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileSetupForm from "@/components/auth/ProfileSetupForm";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
        return;
      }

      setUserId(data.session.user.id);
    };

    checkAuth();
  }, []);

  const handleProfileSetup = async (data: {
    artistName: string;
    bio: string;
    profileImageUrl: string | null;
    genre: string;
  }) => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          artist_name: data.artistName,
          bio: data.bio || null,
          genre: data.genre || null,
          profile_image_url: data.profileImageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      // Add activity
      await supabase.from("user_activity").insert({
        user_id: userId,
        activity_type: "profile-created",
        title: "Профиль артиста создан",
        activity_time: new Date().toISOString(),
      });

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Profile setup error:", error);
      setError(error.message || "Failed to set up profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              Настройка профиля артиста
            </CardTitle>
            <CardDescription>
              Заполните информацию о себе, чтобы начать использовать платформу
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileSetupForm
              onSubmit={handleProfileSetup}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
