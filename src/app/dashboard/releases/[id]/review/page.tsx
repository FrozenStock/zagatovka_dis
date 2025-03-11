import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, CheckCircle, Clock, Music } from "lucide-react";
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

export default async function ReleaseReviewPage({
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

  if (!tracks || tracks.length === 0) {
    redirect(`/dashboard/releases/${release.id}/tracks`);
  }

  return (
    <div className="container py-6 space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/releases/${release.id}/distribution`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Назад к дистрибуции
          </Link>
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Проверка релиза</CardTitle>
                <CardDescription>
                  Проверьте информацию перед отправкой на модерацию
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
          <CardContent className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="aspect-square relative overflow-hidden rounded-md border border-border bg-muted">
                  {release.cover_art_url ? (
                    <img
                      src={release.cover_art_url}
                      alt={release.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <Music className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              <div className="md:w-2/3 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{release.title}</h2>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(release.release_date).toLocaleDateString(
                        "ru-RU",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Тип релиза</p>
                    <p className="text-sm text-muted-foreground">
                      {release.release_type === "single"
                        ? "Сингл"
                        : release.release_type === "ep"
                          ? "EP"
                          : release.release_type === "album"
                            ? "Альбом"
                            : "Сборник"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Жанр</p>
                    <p className="text-sm text-muted-foreground">
                      {release.genre || "Не указан"}
                    </p>
                  </div>
                </div>

                {release.description && (
                  <div>
                    <p className="text-sm font-medium">Описание</p>
                    <p className="text-sm text-muted-foreground">
                      {release.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Треки ({tracks.length})</h3>
              <div className="space-y-2">
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-3 rounded-md border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                        {track.track_number}
                      </div>
                      <div>
                        <p className="font-medium">{track.title}</p>
                        {track.duration && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {Math.floor(track.duration / 60)}:
                            {(track.duration % 60).toString().padStart(2, "0")}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Аудио загружено
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-md">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Готово к отправке</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ваш релиз будет отправлен на модерацию. После одобрения он
                    будет распространен на выбранные платформы в указанную дату.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Обычно модерация занимает 1-2 рабочих дня. Вы получите
                    уведомление о результатах модерации.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/releases/${release.id}/distribution`}>
                Назад
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/releases">
                <CheckCircle className="mr-2 h-4 w-4" />
                Отправить релиз
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
