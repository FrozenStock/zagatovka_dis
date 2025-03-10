"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  BarChart3,
  Download,
  Music,
  Play,
  PlusCircle,
  TrendingUp,
  Users,
  Calendar,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Headphones,
  Share2,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { createClient } from "@/lib/supabase/client";
import {
  DashboardStats,
  PlatformStats,
  CountryStats,
  Release,
  UserActivity,
} from "@/lib/supabase/types";

interface DashboardHomeProps {
  userId: string;
  initialStats?: DashboardStats | null;
  initialPlatformStats?: PlatformStats[];
  initialCountryStats?: CountryStats[];
  initialReleases?: Release[];
  initialActivities?: UserActivity[];
}

const DashboardHome = ({
  userId,
  initialStats = null,
  initialPlatformStats = [],
  initialCountryStats = [],
  initialReleases = [],
  initialActivities = [],
}: DashboardHomeProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("month");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(initialStats);
  const [platformStats, setPlatformStats] =
    useState<PlatformStats[]>(initialPlatformStats);
  const [countryStats, setCountryStats] =
    useState<CountryStats[]>(initialCountryStats);
  const [recentReleases, setRecentReleases] =
    useState<Release[]>(initialReleases);
  const [recentActivity, setRecentActivity] =
    useState<UserActivity[]>(initialActivities);
  const [upcomingReleases, setUpcomingReleases] = useState<Release[]>([]);
  const [streamingData, setStreamingData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.error("No user ID provided");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const supabase = createClient();

      try {
        // Initialize user data if needed
        const { data: existingStats } = await supabase
          .from("dashboard_stats")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();

        if (!existingStats) {
          // Create initial dashboard stats for new user
          await supabase.from("dashboard_stats").insert({
            user_id: userId,
            total_streams: Math.floor(Math.random() * 5000),
            stream_change: Math.floor(Math.random() * 20) + 5,
            total_revenue: parseFloat((Math.random() * 500 + 100).toFixed(2)),
            revenue_change: Math.floor(Math.random() * 15) + 5,
            total_audience: Math.floor(Math.random() * 2000) + 500,
            audience_change: Math.floor(Math.random() * 10) + 5,
          });
        }

        // Fetch dashboard stats if not provided
        if (!initialStats) {
          const { data: statsData } = await supabase
            .from("dashboard_stats")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();
          setStats(statsData);
        }

        // Check if platform stats exist
        const { data: existingPlatformStats } = await supabase
          .from("platform_stats")
          .select("id")
          .eq("user_id", userId)
          .limit(1);

        if (!existingPlatformStats || existingPlatformStats.length === 0) {
          // Create initial platform stats
          const platforms = [
            {
              name: "Spotify",
              percentage: 45,
              streams: Math.floor(Math.random() * 3000) + 1000,
            },
            {
              name: "Apple Music",
              percentage: 25,
              streams: Math.floor(Math.random() * 2000) + 500,
            },
            {
              name: "YouTube Music",
              percentage: 15,
              streams: Math.floor(Math.random() * 1000) + 300,
            },
            {
              name: "Deezer",
              percentage: 10,
              streams: Math.floor(Math.random() * 800) + 200,
            },
            {
              name: "Tidal",
              percentage: 5,
              streams: Math.floor(Math.random() * 400) + 100,
            },
          ];

          for (const platform of platforms) {
            await supabase.from("platform_stats").insert({
              user_id: userId,
              platform_name: platform.name,
              streams: platform.streams,
              percentage: platform.percentage,
            });
          }
        }

        // Fetch platform stats if not provided
        if (initialPlatformStats.length === 0) {
          const { data: platformData } = await supabase
            .from("platform_stats")
            .select("*")
            .eq("user_id", userId)
            .order("percentage", { ascending: false });
          setPlatformStats(platformData || []);
        }

        // Check if country stats exist
        const { data: existingCountryStats } = await supabase
          .from("country_stats")
          .select("id")
          .eq("user_id", userId)
          .limit(1);

        if (!existingCountryStats || existingCountryStats.length === 0) {
          // Create initial country stats
          const countries = [
            {
              name: "United States",
              percentage: 30,
              listeners: Math.floor(Math.random() * 1000) + 300,
            },
            {
              name: "United Kingdom",
              percentage: 20,
              listeners: Math.floor(Math.random() * 800) + 200,
            },
            {
              name: "Germany",
              percentage: 15,
              listeners: Math.floor(Math.random() * 600) + 150,
            },
            {
              name: "France",
              percentage: 10,
              listeners: Math.floor(Math.random() * 400) + 100,
            },
            {
              name: "Russia",
              percentage: 10,
              listeners: Math.floor(Math.random() * 400) + 100,
            },
            {
              name: "Others",
              percentage: 15,
              listeners: Math.floor(Math.random() * 600) + 150,
            },
          ];

          for (const country of countries) {
            await supabase.from("country_stats").insert({
              user_id: userId,
              country_name: country.name,
              listeners: country.listeners,
              percentage: country.percentage,
            });
          }
        }

        // Fetch country stats if not provided
        if (initialCountryStats.length === 0) {
          const { data: countryData } = await supabase
            .from("country_stats")
            .select("*")
            .eq("user_id", userId)
            .order("percentage", { ascending: false });
          setCountryStats(countryData || []);
        }

        // Fetch recent releases if not provided
        if (initialReleases.length === 0) {
          const { data: releasesData } = await supabase
            .from("releases")
            .select("*")
            .eq("artist_id", userId)
            .eq("status", "published")
            .order("created_at", { ascending: false })
            .limit(3);
          setRecentReleases(releasesData || []);
        }

        // Fetch upcoming releases
        const { data: upcomingData } = await supabase
          .from("releases")
          .select("*")
          .eq("artist_id", userId)
          .or("status.eq.scheduled,status.eq.draft")
          .order("release_date", { ascending: true });
        setUpcomingReleases(upcomingData || []);

        // Check if user activities exist
        const { data: existingActivities } = await supabase
          .from("user_activity")
          .select("id")
          .eq("user_id", userId)
          .limit(1);

        if (!existingActivities || existingActivities.length === 0) {
          // Create initial activities
          const activities = [
            {
              activity_type: "account-created",
              title: "Аккаунт успешно создан",
              activity_time: new Date(
                Date.now() - 7 * 24 * 60 * 60 * 1000,
              ).toISOString(),
            },
            {
              activity_type: "profile-updated",
              title: "Профиль был обновлен",
              activity_time: new Date(
                Date.now() - 5 * 24 * 60 * 60 * 1000,
              ).toISOString(),
            },
            {
              activity_type: "settings-updated",
              title: "Настройки уведомлений обновлены",
              activity_time: new Date(
                Date.now() - 3 * 24 * 60 * 60 * 1000,
              ).toISOString(),
            },
          ];

          for (const activity of activities) {
            await supabase.from("user_activity").insert({
              user_id: userId,
              activity_type: activity.activity_type,
              title: activity.title,
              activity_time: activity.activity_time,
            });
          }
        }

        // Fetch recent activities if not provided
        if (initialActivities.length === 0) {
          const { data: activitiesData } = await supabase
            .from("user_activity")
            .select("*")
            .eq("user_id", userId)
            .order("activity_time", { ascending: false })
            .limit(3);
          setRecentActivity(activitiesData || []);
        }

        // Generate streaming data for chart
        generateStreamingData();
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    userId,
    initialStats,
    initialPlatformStats,
    initialCountryStats,
    initialReleases,
    initialActivities,
  ]);

  const generateStreamingData = () => {
    // Generate streaming data based on user's releases
    const months = [
      "Янв",
      "Фев",
      "Мар",
      "Апр",
      "Май",
      "Июн",
      "Июл",
      "Авг",
      "Сен",
      "Окт",
      "Ноя",
      "Дек",
    ];

    const currentMonth = new Date().getMonth();
    const data = [];

    // Generate data for the last 12 months
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const baseStreams = stats?.total_streams
        ? Math.floor(stats.total_streams / 12)
        : 5000;

      // Add some randomness to make the chart look more realistic
      const randomFactor = 0.7 + Math.random() * 0.6; // Between 0.7 and 1.3
      const streams = Math.floor(baseStreams * randomFactor);

      data.unshift({
        name: months[monthIndex],
        streams: streams,
      });
    }

    setStreamingData(data);
  };

  const toggleCardExpansion = (cardId: string) => {
    if (expandedCard === cardId) {
      setExpandedCard(null);
    } else {
      setExpandedCard(cardId);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "только что";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "минуту" : minutes < 5 ? "минуты" : "минут"} назад`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "час" : hours < 5 ? "часа" : "часов"} назад`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "день" : days < 5 ? "дня" : "дней"} назад`;
    } else {
      return date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case "stream-milestone":
        return <Headphones className="h-4 w-4 text-green-500" />;
      case "new-follower":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "payment":
        return <TrendingUp className="h-4 w-4 text-purple-500" />;
      case "release-created":
        return <Music className="h-4 w-4 text-indigo-500" />;
      case "track-added":
        return <Music className="h-4 w-4 text-pink-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Панель управления</h1>
          <p className="text-muted-foreground mt-1">
            Добро пожаловать в ваш музыкальный центр управления
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Download className="mr-2 h-4 w-4" />
            Экспорт данных
          </Button>
          <Button
            size="sm"
            onClick={() => router.push("/dashboard/releases/new")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Новый релиз
          </Button>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="flex justify-between items-center">
        <Tabs
          defaultValue="month"
          value={timeframe}
          onValueChange={setTimeframe}
          className="w-full max-w-md"
        >
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="week">Неделя</TabsTrigger>
            <TabsTrigger value="month">Месяц</TabsTrigger>
            <TabsTrigger value="year">Год</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="ghost" size="sm" className="hidden md:flex">
          <Calendar className="mr-2 h-4 w-4" />
          Выбрать даты
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="overflow-hidden border-l-4 border-l-blue-500 dark:bg-card/80 dark:backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Всего прослушиваний
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">
                  {stats?.total_streams?.toLocaleString() || "0"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span
                    className={`${(stats?.stream_change || 0) > 0 ? "text-green-500" : "text-red-500"} font-medium`}
                  >
                    {(stats?.stream_change || 0) > 0 ? "+" : ""}
                    {stats?.stream_change || 0}%
                  </span>{" "}
                  с прошлого месяца
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center dark:bg-blue-500/20 dark:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={65} className="h-1 bg-muted" />
              <p className="text-xs text-muted-foreground mt-2">
                65% от цели в 130,000
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-green-500 dark:bg-card/80 dark:backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Доход
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">
                  ${stats?.total_revenue?.toFixed(2) || "0.00"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span
                    className={`${(stats?.revenue_change || 0) > 0 ? "text-green-500" : "text-red-500"} font-medium`}
                  >
                    {(stats?.revenue_change || 0) > 0 ? "+" : ""}
                    {stats?.revenue_change || 0}%
                  </span>{" "}
                  с прошлого месяца
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center dark:bg-green-500/20 dark:shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={83} className="h-1 bg-muted" />
              <p className="text-xs text-muted-foreground mt-2">
                83% от цели в $4,000
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-purple-500 dark:bg-card/80 dark:backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Аудитория
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">
                  {stats?.total_audience?.toLocaleString() || "0"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span
                    className={`${(stats?.audience_change || 0) > 0 ? "text-green-500" : "text-red-500"} font-medium`}
                  >
                    {(stats?.audience_change || 0) > 0 ? "+" : ""}
                    {stats?.audience_change || 0}%
                  </span>{" "}
                  с прошлого месяца
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center dark:bg-purple-500/20 dark:shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={45} className="h-1 bg-muted" />
              <p className="text-xs text-muted-foreground mt-2">
                45% от цели в 70,000
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Releases */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Недавние релизы</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => router.push("/dashboard/releases")}
                >
                  Все релизы <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Ваши последние музыкальные релизы
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentReleases.length > 0 ? (
                <div className="space-y-6">
                  {recentReleases.map((release) => (
                    <div key={release.id} className="flex gap-4">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={
                            release.cover_art_url ||
                            "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&q=80"
                          }
                          alt={release.title}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                          >
                            <Play className="h-4 w-4 text-white" fill="white" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold truncate">
                            {release.title}
                          </h3>
                          <Badge variant="secondary" className="ml-2">
                            {new Date(release.release_date).toLocaleDateString(
                              "ru-RU",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </Badge>
                        </div>
                        <div className="flex flex-col gap-1 mt-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Headphones className="h-4 w-4 mr-1" />
                            <span>
                              {Math.floor(Math.random() * 50000) + 5000}{" "}
                              прослушиваний
                            </span>
                          </div>
                          {release.upc && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span className="font-medium mr-1">UPC:</span>
                              <span className="font-mono">{release.upc}</span>
                            </div>
                          )}
                        </div>
                        <Progress value={75} className="h-1 mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <Music className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center mb-4">
                    У вас пока нет опубликованных релизов
                  </p>
                  <Button
                    onClick={() => router.push("/dashboard/releases/new")}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Создать релиз
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Platform Distribution */}
          <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Распределение по платформам</CardTitle>
              <CardDescription>
                Статистика прослушиваний по платформам
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformStats.map((platform) => (
                  <div key={platform.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {platform.platform_name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {platform.streams.toLocaleString()} прослушиваний
                      </span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${platform.platform_name === "Spotify" ? "bg-green-500" : platform.platform_name === "Apple Music" ? "bg-pink-500" : platform.platform_name === "YouTube Music" ? "bg-red-500" : "bg-blue-500"}`}
                        style={{ width: `${platform.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Releases */}
          <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Предстоящие релизы</CardTitle>
              <CardDescription>Запланированные и черновики</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingReleases.length > 0 ? (
                <>
                  {upcomingReleases.map((release) => (
                    <Card
                      key={release.id}
                      className="overflow-hidden border-border"
                    >
                      <div className="flex">
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            src={
                              release.cover_art_url ||
                              "https://images.unsplash.com/photo-1535478044878-3ed83d5456ef?w=400&q=80"
                            }
                            alt={release.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-sm">
                                {release.title}
                              </h4>
                              <div className="flex items-center mt-1">
                                <Badge
                                  variant={
                                    release.status === "scheduled"
                                      ? "outline"
                                      : "secondary"
                                  }
                                  className="text-xs px-1 py-0"
                                >
                                  {release.status === "scheduled"
                                    ? "Запланирован"
                                    : "Черновик"}
                                </Badge>
                                {release.release_date && (
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {new Date(
                                      release.release_date,
                                    ).toLocaleDateString("ru-RU", {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => toggleCardExpansion(release.id)}
                            >
                              {expandedCard === release.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                      {expandedCard === release.id && (
                        <div className="px-3 pb-3 pt-0">
                          {release.status === "scheduled" ? (
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground">
                                Будет выпущен на:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                <Badge variant="secondary" className="text-xs">
                                  Spotify
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  Apple Music
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  YouTube Music
                                </Badge>
                              </div>
                              <div className="flex justify-end gap-2 mt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/releases/${release.id}`,
                                    )
                                  }
                                >
                                  Редактировать
                                </Button>
                                <Button
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/releases/${release.id}`,
                                    )
                                  }
                                >
                                  Детали
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground">
                                Завершите настройку релиза
                              </p>
                              <div className="flex justify-end gap-2 mt-2">
                                <Button
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/releases/${release.id}`,
                                    )
                                  }
                                >
                                  Продолжить настройку
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  ))}
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-sm mb-4">
                    У вас нет предстоящих релизов
                  </p>
                </div>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/dashboard/releases/new")}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Создать новый релиз
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Недавняя активность</CardTitle>
              <CardDescription>Последние события</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      {getActivityIcon(activity.activity_type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />{" "}
                        {formatTimeAgo(
                          activity.activity_time || activity.created_at,
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => router.push("/dashboard/activity")}
              >
                Показать все активности
              </Button>
            </CardFooter>
          </Card>

          {/* Quick Actions */}
          <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="h-auto flex flex-col items-center justify-center p-4 space-y-2"
                  onClick={() => router.push("/dashboard/releases/new")}
                >
                  <PlusCircle className="h-5 w-5" />
                  <span className="text-xs">Новый релиз</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto flex flex-col items-center justify-center p-4 space-y-2"
                  onClick={() => router.push("/dashboard/analytics")}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs">Аналитика</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto flex flex-col items-center justify-center p-4 space-y-2"
                >
                  <Share2 className="h-5 w-5" />
                  <span className="text-xs">Поделиться</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto flex flex-col items-center justify-center p-4 space-y-2"
                >
                  <Sparkles className="h-5 w-5" />
                  <span className="text-xs">Промо</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Geography */}
      <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>География аудитории</CardTitle>
              <CardDescription>
                Распределение слушателей по странам
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Экспорт данных</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/analytics")}
                >
                  Подробная аналитика
                </DropdownMenuItem>
                <DropdownMenuItem>Настроить отображение</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {countryStats.map((country) => (
                <div key={country.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {country.country_name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {country.listeners.toLocaleString()} слушателей
                    </span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full max-w-xs aspect-square rounded-full border-8 border-muted relative">
                <div className="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center bg-muted/50">
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {stats?.total_audience?.toLocaleString() || "0"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Всего слушателей
                    </p>
                  </div>
                </div>
                {countryStats.map((country, index) => {
                  // Calculate position around the circle
                  const angle = (index / countryStats.length) * 2 * Math.PI;
                  const radius = 42; // % of circle radius
                  const x = 50 + radius * Math.cos(angle);
                  const y = 50 + radius * Math.sin(angle);

                  return (
                    <div
                      key={country.id}
                      className="absolute w-8 h-8 rounded-full bg-background shadow-md flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 border border-border"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        zIndex: 10 - index,
                      }}
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {country.country_name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
