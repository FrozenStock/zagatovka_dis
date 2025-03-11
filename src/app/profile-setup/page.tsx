"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ProfileData } from "@/types/auth";
import ProfileSetupForm from "@/components/auth/ProfileSetupForm";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleProfileSetup = async (data: ProfileData) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Не авторизован");

      // Upload profile image if provided
      let profileImageUrl = null;
      if (data.profileImage) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(`${user.id}/${data.profileImage.name}`, data.profileImage);

        if (uploadError) throw uploadError;
        profileImageUrl = uploadData.path;
      }

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          artist_name: data.artistName,
          bio: data.bio,
          profile_image_url: profileImageUrl,
          genre: data.genre,
          social_links: data.socialLinks,
          updated_at: new Date().toISOString(),
        });

      if (updateError) throw updateError;

      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || "Ошибка при сохранении профиля");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Настройка профиля</h1>
          <p className="text-muted-foreground mt-2">
            Заполните информацию о себе
          </p>
        </div>

        {error && (
          <div className="p-3 bg-destructive/15 border border-destructive text-destructive rounded-md">
            {error}
          </div>
        )}

        <ProfileSetupForm onSubmit={handleProfileSetup} isLoading={isLoading} />
      </div>
    </div>
  );
}
