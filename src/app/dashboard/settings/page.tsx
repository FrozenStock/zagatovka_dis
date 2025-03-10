import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getSession, getProfile } from "@/lib/auth";
import SettingsContent from "@/components/dashboard/settings/SettingsContent";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const profile = await getProfile();

  if (!profile) {
    redirect("/profile-setup");
  }

  return (
    <DashboardLayout
      user={{
        name:
          profile.artist_name || session.user.email?.split("@")[0] || "Артист",
        email: session.user.email || "",
        avatar: profile.profile_image_url || undefined,
      }}
    >
      <SettingsContent userId={session.user.id} profile={profile} />
    </DashboardLayout>
  );
}
