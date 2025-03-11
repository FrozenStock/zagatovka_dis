import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getProfile } from "@/lib/auth";
import EditReleaseForm from "@/components/dashboard/releases/EditReleaseForm";

export default async function EditReleasePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfile();

  if (!profile) {
    redirect("/profile-setup");
  }

  const supabase = createClient();

  // Fetch release details
  const { data: release } = await supabase
    .from("releases")
    .select("*")
    .eq("id", params.id)
    .eq("artist_id", user.id)
    .single();

  if (!release) {
    redirect("/dashboard/releases");
  }

  return (
    <DashboardLayout
      user={{
        name: profile.artist_name || user.email?.split("@")[0] || "Артист",
        email: user.email || "",
        avatar: profile.profile_image_url || undefined,
      }}
    >
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/releases/${release.id}`}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Назад к релизу
            </Link>
          </Button>
        </div>

        <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Редактирование релиза</CardTitle>
            <CardDescription>
              Обновите информацию о вашем релизе "{release.title}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EditReleaseForm userId={user.id} release={release} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
