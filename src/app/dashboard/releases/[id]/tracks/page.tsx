import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music, Upload, Plus } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function ReleaseTracksPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
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

  // Fetch tracks for this release
  const { data: tracks } = await supabase
    .from("tracks")
    .select("*")
    .eq("release_id", release.id)
    .order("track_number", { ascending: true });

  return (
    <div className="container py-6 space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/releases/${release.id}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Назад к релизу
          </Link>
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Треки релиза</CardTitle>
                <CardDescription>
                  {release.title} - {tracks?.length || 0}{" "}
                  {tracks?.length === 1
                    ? "трек"
                    : tracks?.length && tracks.length > 1 && tracks.length < 5
                      ? "трека"
                      : "треков"}
                </CardDescription>
              </div>
              <Badge
                variant={
                  release.status === "published"
                    ? "default"
                    : release.status === "scheduled"
                      ? "outline"
                      : "secondary"
                }
              >
                {release.status === "published"
                  ? "Опубликован"
                  : release.status === "scheduled"
                    ? "Запланирован"
                    : release.status === "rejected"
                      ? "Отклонен"
                      : "Черновик"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {tracks && tracks.length > 0 ? (
              <div className="space-y-4">
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-4 rounded-md border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                        {track.track_number}
                      </div>
                      <div>
                        <p className="font-medium">{track.title}</p>
                        {track.duration && (
                          <p className="text-sm text-muted-foreground">
                            {Math.floor(track.duration / 60)}:
                            {(track.duration % 60).toString().padStart(2, "0")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Music className="mr-2 h-4 w-4" />
                        Прослушать
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Заменить
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  У этого релиза пока нет треков
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Добавьте треки к вашему релизу, чтобы продолжить
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Добавить трек
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/releases/${release.id}`}>
                Назад к релизу
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/releases/${release.id}/distribution`}>
                Продолжить
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
