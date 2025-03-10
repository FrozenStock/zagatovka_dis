import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getSession, getProfile } from "@/lib/auth";
import ReleasesContent from "@/components/dashboard/releases/ReleasesContent";
import { getReleases } from "@/lib/supabase/actions";

export default async function ReleasesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const profile = await getProfile();

  if (!profile) {
    redirect("/profile-setup");
  }

  // Fetch all releases for the user
  const releases = await getReleases(session.user.id);

  return (
    <DashboardLayout
      user={{
        name:
          profile.artist_name || session.user.email?.split("@")[0] || "Артист",
        email: session.user.email || "",
        avatar: profile.profile_image_url || undefined,
      }}
    >
      <ReleasesContent userId={session.user.id} initialReleases={releases} />
    </DashboardLayout>
  );
}
