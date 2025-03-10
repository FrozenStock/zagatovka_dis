"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileSetupForm from "@/components/auth/ProfileSetupForm";
import { createClient } from "@/lib/supabase/client";

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
    profileImage: File | null;
    genre: string;
    socialLinks: {
      spotify: string;
      instagram: string;
      twitter: string;
    };
  }) => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Upload profile image if provided
      let profileImageUrl = null;
      if (data.profileImage) {
        const fileExt = data.profileImage.name.split(".").pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("profile-images")
          .upload(fileName, data.profileImage);

        if (uploadError) throw uploadError;

        if (uploadData) {
          const { data: urlData } = supabase.storage
            .from("profile-images")
            .getPublicUrl(fileName);

          profileImageUrl = urlData.publicUrl;
        }
      }

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          artist_name: data.artistName,
          bio: data.bio,
          genre: data.genre,
          profile_image_url: profileImageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      // Add social links
      const socialLinks = [
        { platform: "spotify", url: data.socialLinks.spotify },
        { platform: "instagram", url: data.socialLinks.instagram },
        { platform: "twitter", url: data.socialLinks.twitter },
      ].filter((link) => link.url);

      if (socialLinks.length > 0) {
        const { error: linksError } = await supabase
          .from("social_links")
          .insert(
            socialLinks.map((link) => ({
              profile_id: userId,
              platform: link.platform,
              url: link.url,
            })),
          );

        if (linksError) throw linksError;
      }

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
          <div className="mb-4 p-3 bg-destructive/15 border border-destructive text-destructive rounded-md text-sm">
            {error}
          </div>
        )}

        <ProfileSetupForm onSubmit={handleProfileSetup} isLoading={isLoading} />
      </div>
    </div>
  );
}
