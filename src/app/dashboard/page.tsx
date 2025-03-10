import { redirect } from "next/navigation";
import DashboardHome from "@/components/dashboard/DashboardHome";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getSession, getProfile } from "@/lib/auth";
import {
  getDashboardStats,
  getPlatformStats,
  getCountryStats,
  getRecentReleases,
  getUserActivities,
  initializeUserData,
} from "@/lib/supabase/actions";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const profile = await getProfile();

  if (!profile) {
    redirect("/profile-setup");
  }

  try {
    // Initialize user data if needed (for demo purposes)
    await initializeUserData(session.user.id);

    // Fetch data for the dashboard
    const stats = await getDashboardStats(session.user.id);
    const platformStats = await getPlatformStats(session.user.id);
    const countryStats = await getCountryStats(session.user.id);
    const recentReleases = await getRecentReleases(session.user.id, 3);
    const recentActivities = await getUserActivities(session.user.id);

    return (
      <DashboardLayout
        user={{
          name:
            profile.artist_name ||
            session.user.email?.split("@")[0] ||
            "Артист",
          email: session.user.email || "",
          avatar: profile.profile_image_url || undefined,
        }}
      >
        <DashboardHome
          userId={session.user.id}
          initialStats={stats}
          initialPlatformStats={platformStats}
          initialCountryStats={countryStats}
          initialReleases={recentReleases}
          initialActivities={recentActivities}
        />
      </DashboardLayout>
    );
  } catch (error) {
    console.error("Error loading dashboard data:", error);

    // Return dashboard with empty data in case of error
    return (
      <DashboardLayout
        user={{
          name:
            profile.artist_name ||
            session.user.email?.split("@")[0] ||
            "Артист",
          email: session.user.email || "",
          avatar: profile.profile_image_url || undefined,
        }}
      >
        <DashboardHome
          userId={session.user.id}
          initialStats={null}
          initialPlatformStats={[]}
          initialCountryStats={[]}
          initialReleases={[]}
          initialActivities={[]}
        />
      </DashboardLayout>
    );
  }
}
