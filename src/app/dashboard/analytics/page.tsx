import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getSession, getProfile } from "@/lib/auth";
import AnalyticsContent from "@/components/dashboard/analytics/AnalyticsContent";
import {
  getDashboardStats,
  getPlatformStats,
  getCountryStats,
  getTrackStats,
} from "@/lib/supabase/actions";

export default async function AnalyticsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const profile = await getProfile();

  if (!profile) {
    redirect("/profile-setup");
  }

  // Fetch data for analytics
  const stats = await getDashboardStats(session.user.id);
  const platformStats = await getPlatformStats(session.user.id);
  const countryStats = await getCountryStats(session.user.id);
  const trackStats = await getTrackStats(session.user.id);

  return (
    <DashboardLayout
      user={{
        name:
          profile.artist_name || session.user.email?.split("@")[0] || "Артист",
        email: session.user.email || "",
        avatar: profile.profile_image_url || undefined,
      }}
    >
      <AnalyticsContent
        userId={session.user.id}
        initialStats={stats}
        initialPlatformStats={platformStats}
        initialCountryStats={countryStats}
        initialTrackStats={trackStats}
      />
    </DashboardLayout>
  );
}
