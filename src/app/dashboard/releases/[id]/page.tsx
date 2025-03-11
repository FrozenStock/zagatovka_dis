import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Music, Calendar, BarChart3, Edit, 
  Trash, Share2, Download
} from "lucide-react";
import Link from "next/link";
import {
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Release, Track, StreamingStat } from "@/types/releases";

const getStatusLabel = (status: Release['status']) => {
  const statusMap = {
    published: "Опубликован",
    scheduled: "Запланирован",
    rejected: "Отклонен",
    draft: "Черновик"
  };
  return statusMap[status] || status;
};

const getStatusVariant = (status: Release['status']) => {
  const variantMap = {
    published: "default",
    scheduled: "outline",
    rejected: "secondary",
    draft: "secondary"
  };
  return variantMap[status] || "secondary";
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
};

const getPlatformColor = (platform: string) => {
  const colorMap = {
    'Spotify': 'bg-green-500',
    'Apple Music': 'bg-pink-500',
    'YouTube Music': 'bg-red-500'
  };
  return colorMap[platform as keyof typeof colorMap] || 'bg-blue-500';
};

export default async function ReleaseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = createClient();

  // Fetch all data in parallel
  const [releaseResponse, tracksResponse, statsResponse] = await Promise.all([
    supabase.from("releases")
      .select("*")
      .eq("id", params.id)
      .eq("artist_id", user.id)
      .single(),
    
    supabase.from("tracks")
      .select("*")
      .eq("release_id", params.id)
      .order("track_number", { ascending: true }),
    
    supabase.from("streaming_stats")
      .select("platform, sum(stream_count)")
      .eq("release_id", params.id)
      .group("platform")
  ]);

  const release = releaseResponse.data as Release;
  const tracks = tracksResponse.data as Track[];
  const streamingStats = statsResponse.data as StreamingStat[];

  if (!release) {
    redirect("/dashboard/releases");
  }

  return (
    <div className="container py-6 space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/releases">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Назад к релизам
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 aspect-square relative overflow-hidden bg-muted">
                {release.cover_art_url ? (
                  <img
                    src={release.cover_art_url}
                    alt={release.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <Music className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant={getStatusVariant(release.status)}
                    >
                      {getStatusLabel(release.status)}
                    </Badge>
                    <h1 className="text-3xl font-bold mt-2">{release.title}</h1>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Дата релиза:{" "}
                    {new Date(release.release_date).toLocaleDateString("ru-RU")}
                  </div>

                  {release.genre && (
                    <div className="text-sm">
                      <span className="font-medium">Жанр:</span> {release.genre}
                    </div>
                  )}

                  {release.upc && (
                    <div className="text-sm">
                      <span className="font-medium">UPC:</span>{" "}
                      <span className="font-mono">{release.upc}</span>
                    </div>
                  )}

                  {release.description && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        {release.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Треки</CardTitle>
              <CardDescription>
                {tracks?.length || 0}{" "}
                {tracks?.length === 1
                  ? "трек"
                  : tracks?.length && tracks.length > 1 && tracks.length < 5
                    ? "трека"
                    : "треков"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tracks && tracks.length > 0 ? (
                <div className="space-y-4">
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
                          {track.isrc && (
                            <p className="text-xs text-muted-foreground">
                              ISRC:{" "}
                              <span className="font-mono">{track.isrc}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {formatDuration(track.duration)}
                        </span>
                        {track.audio_url && (
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Нет треков в этом релизе
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
              <CardDescription>Данные о прослушиваниях релиза</CardDescription>
            </CardHeader>
            <CardContent>
              {streamingStats && streamingStats.length > 0 ? (
                <div className="space-y-4">
                  {streamingStats.map((stat: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {stat.platform}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {parseInt(stat.sum).toLocaleString()} прослушиваний
                        </span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getPlatformColor(stat.platform)}`}
                          style={{
                            width: `${Math.min(100, parseInt(stat.sum) / 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Нет данных о прослушиваниях
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/analytics">Подробная аналитика</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href={`/dashboard/releases/${release.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Редактировать релиз
                </Link>
              </Button>

              {release.status === "draft" && (
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Запланировать выпуск
                </Button>
              )}

              <Button variant="outline" className="w-full justify-start">
                <Share2 className="mr-2 h-4 w-4" />
                Поделиться релизом
              </Button>

              <Separator />

              <Button variant="destructive" className="w-full justify-start">
                <Trash className="mr-2 h-4 w-4" />
                Удалить релиз
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
