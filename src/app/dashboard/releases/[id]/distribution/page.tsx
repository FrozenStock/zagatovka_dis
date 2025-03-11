import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Globe, Music } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";

export default async function ReleaseDistributionPage({
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

  // Fetch tracks for this release to check if there are any
  const { count } = await supabase
    .from("tracks")
    .select("id", { count: "exact" })
    .eq("release_id", release.id);

  if (!count || count === 0) {
    redirect(`/dashboard/releases/${release.id}/tracks`);
  }

  const platforms = [
    {
      id: "spotify",
      name: "Spotify",
      logo: "/platforms/spotify.svg",
      popular: true,
    },
    {
      id: "apple_music",
      name: "Apple Music",
      logo: "/platforms/apple-music.svg",
      popular: true,
    },
    {
      id: "youtube_music",
      name: "YouTube Music",
      logo: "/platforms/youtube-music.svg",
      popular: true,
    },
    {
      id: "deezer",
      name: "Deezer",
      logo: "/platforms/deezer.svg",
      popular: true,
    },
    { id: "tidal", name: "Tidal", logo: "/platforms/tidal.svg", popular: true },
    {
      id: "amazon_music",
      name: "Amazon Music",
      logo: "/platforms/amazon-music.svg",
      popular: false,
    },
    {
      id: "pandora",
      name: "Pandora",
      logo: "/platforms/pandora.svg",
      popular: false,
    },
    {
      id: "napster",
      name: "Napster",
      logo: "/platforms/napster.svg",
      popular: false,
    },
  ];

  return (
    <div className="container py-6 space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/releases/${release.id}/tracks`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Назад к трекам
          </Link>
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Дистрибуция</CardTitle>
                <CardDescription>
                  Выберите платформы для распространения релиза "{release.title}
                  "
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
            <div className="bg-muted/50 p-4 rounded-md flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Выберите платформы</h3>
                <p className="text-sm text-muted-foreground">
                  Ваша музыка будет распространена на выбранные платформы после
                  модерации
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Популярные платформы</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {platforms
                  .filter((p) => p.popular)
                  .map((platform) => (
                    <div
                      key={platform.id}
                      className="flex items-center space-x-3 border rounded-md p-4"
                    >
                      <Checkbox id={platform.id} defaultChecked />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 flex items-center justify-center">
                          <Music className="h-6 w-6 text-primary" />
                        </div>
                        <label
                          htmlFor={platform.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {platform.name}
                        </label>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Другие платформы</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {platforms
                  .filter((p) => !p.popular)
                  .map((platform) => (
                    <div
                      key={platform.id}
                      className="flex items-center space-x-3 border rounded-md p-4"
                    >
                      <Checkbox id={platform.id} defaultChecked />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 flex items-center justify-center">
                          <Music className="h-6 w-6 text-primary" />
                        </div>
                        <label
                          htmlFor={platform.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {platform.name}
                        </label>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium cursor-pointer"
                >
                  Я подтверждаю, что имею права на распространение этой музыки
                </label>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                Подтверждая, вы соглашаетесь с нашими условиями использования и
                политикой конфиденциальности
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/releases/${release.id}/tracks`}>
                Назад
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/releases/${release.id}/review`}>
                <Check className="mr-2 h-4 w-4" />
                Отправить на модерацию
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
