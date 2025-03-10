"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PlusCircle,
  Search,
  Music,
  Calendar,
  Clock,
  Filter,
  MoreHorizontal,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock4,
  XCircle,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Release } from "@/lib/supabase/types";

interface ReleasesContentProps {
  userId: string;
  initialReleases?: Release[];
}

export default function ReleasesContent({
  userId,
  initialReleases = [],
}: ReleasesContentProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [releases, setReleases] = useState<Release[]>(initialReleases);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (initialReleases.length > 0) {
      setIsLoading(false);
    } else {
      fetchReleases();
    }
  }, [initialReleases]);

  const fetchReleases = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from("releases")
        .select("*")
        .eq("artist_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReleases(data || []);
    } catch (error) {
      console.error("Error fetching releases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReleases = releases.filter((release) => {
    // Filter by search query
    const matchesSearch = release.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Filter by tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "published")
      return release.status === "published" && matchesSearch;
    if (activeTab === "scheduled")
      return release.status === "scheduled" && matchesSearch;
    if (activeTab === "drafts")
      return release.status === "draft" && matchesSearch;
    if (activeTab === "moderation")
      return release.moderation_status === "pending" && matchesSearch;
    if (activeTab === "distribution") {
      return (
        release.distribution_status !== "not_started" &&
        release.distribution_status !== "completed" &&
        matchesSearch
      );
    }

    return matchesSearch;
  });

  const getModerationStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-500 border-green-500/20"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" /> Одобрен
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-500 border-red-500/20"
          >
            <XCircle className="mr-1 h-3 w-3" /> Отклонен
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
          >
            <Clock4 className="mr-1 h-3 w-3" /> На модерации
          </Badge>
        );
    }
  };

  const getDistributionStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-500 border-blue-500/20"
          >
            <Loader2 className="mr-1 h-3 w-3 animate-spin" /> В процессе
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-500 border-green-500/20"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" /> Завершено
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-500 border-red-500/20"
          >
            <AlertCircle className="mr-1 h-3 w-3" /> Ошибка
          </Badge>
        );
      case "not_started":
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-500/10 text-gray-500 border-gray-500/20"
          >
            <Clock className="mr-1 h-3 w-3" /> Не начато
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-500 border-green-500/20"
          >
            Опубликован
          </Badge>
        );
      case "scheduled":
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-500 border-blue-500/20"
          >
            Запланирован
          </Badge>
        );
      case "draft":
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-500/10 text-gray-500 border-gray-500/20"
          >
            Черновик
          </Badge>
        );
    }
  };

  const formatReleaseType = (type: string) => {
    switch (type) {
      case "single":
        return "Сингл";
      case "ep":
        return "EP";
      case "album":
        return "Альбом";
      case "compilation":
        return "Сборник";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Мои релизы</h1>
          <p className="text-muted-foreground mt-1">
            Управляйте вашими музыкальными релизами
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/releases/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Новый релиз
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="published">Опубликованные</TabsTrigger>
            <TabsTrigger value="scheduled">Запланированные</TabsTrigger>
            <TabsTrigger value="drafts">Черновики</TabsTrigger>
            <TabsTrigger value="moderation">На модерации</TabsTrigger>
            <TabsTrigger value="distribution">На отгрузке</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск релизов..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredReleases.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Релиз</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Дата релиза</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Модерация</TableHead>
                  <TableHead>Дистрибуция</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReleases.map((release) => (
                  <TableRow key={release.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          {release.cover_art_url ? (
                            <img
                              src={release.cover_art_url}
                              alt={release.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary/10">
                              <Music className="h-5 w-5 text-primary" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{release.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {release.genre || "Жанр не указан"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatReleaseType(release.release_type)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>
                          {new Date(release.release_date).toLocaleDateString(
                            "ru-RU",
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(release.status)}</TableCell>
                    <TableCell>
                      {getModerationStatusBadge(release.moderation_status)}
                    </TableCell>
                    <TableCell>
                      {getDistributionStatusBadge(release.distribution_status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/releases/${release.id}`)
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Просмотр
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/dashboard/releases/${release.id}/edit`,
                              )
                            }
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed dark:bg-card/80 dark:backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 dark:bg-primary/20 dark:shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              <Music className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Нет релизов</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {searchQuery
                ? "Не найдено релизов, соответствующих вашему запросу."
                : "У вас пока нет релизов. Создайте свой первый релиз, чтобы начать распространение вашей музыки."}
            </p>
            <Button onClick={() => router.push("/dashboard/releases/new")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Создать релиз
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
