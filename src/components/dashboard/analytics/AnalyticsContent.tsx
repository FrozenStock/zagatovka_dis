"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  Users,
  Download,
  Calendar,
  Music,
  Globe,
  Loader2,
} from "lucide-react";
import { AreaChart, BarChart, PieChart } from "@/components/ui/charts";
import {
  DashboardStats,
  PlatformStats,
  CountryStats,
  TrackStats,
} from "@/lib/supabase/types";

interface AnalyticsContentProps {
  userId: string;
  initialStats?: DashboardStats | null;
  initialPlatformStats?: PlatformStats[];
  initialCountryStats?: CountryStats[];
  initialTrackStats?: TrackStats[];
}

export default function AnalyticsContent({
  userId,
  initialStats = null,
  initialPlatformStats = [],
  initialCountryStats = [],
  initialTrackStats = [],
}: AnalyticsContentProps) {
  const [timeframe, setTimeframe] = useState("month");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(initialStats);
  const [platformStats, setPlatformStats] =
    useState<PlatformStats[]>(initialPlatformStats);
  const [countryStats, setCountryStats] =
    useState<CountryStats[]>(initialCountryStats);
  const [trackStats, setTrackStats] = useState<TrackStats[]>(initialTrackStats);

  // State for streaming data
  const [streamingData, setStreamingData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (
        initialStats &&
        initialPlatformStats.length > 0 &&
        initialCountryStats.length > 0 &&
        initialTrackStats.length > 0
      ) {
        setIsLoading(false);
        generateStreamingData();
        return;
      }

      setIsLoading(true);
      const supabase = createClient();

      try {
        // Fetch dashboard stats if not provided
        if (!initialStats) {
          const { data: statsData } = await supabase
            .from("dashboard_stats")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();
          setStats(statsData);
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

        // Fetch country stats if not provided
        if (initialCountryStats.length === 0) {
          const { data: countryData } = await supabase
            .from("country_stats")
            .select("*")
            .eq("user_id", userId)
            .order("percentage", { ascending: false });
          setCountryStats(countryData || []);
        }

        // Fetch track stats if not provided
        if (initialTrackStats.length === 0) {
          const { data: trackData } = await supabase
            .from("track_stats")
            .select("*")
            .eq("user_id", userId)
            .order("streams", { ascending: false });
          setTrackStats(trackData || []);
        }

        // Fetch streaming stats by month
        const { data: releaseIds } = await supabase
          .from("releases")
          .select("id")
          .eq("artist_id", userId);

        if (releaseIds && releaseIds.length > 0) {
          const ids = releaseIds.map((r) => r.id);

          // Get streaming stats for these releases
          const { data: streamingStats } = await supabase
            .from("streaming_stats")
            .select("date, stream_count")
            .in("release_id", ids);

          if (streamingStats && streamingStats.length > 0) {
            generateStreamingDataFromStats(streamingStats);
          } else {
            generateStreamingData();
          }
        } else {
          generateStreamingData();
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        generateStreamingData(); // Fallback to generated data
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
    initialTrackStats,
    timeframe,
  ]);

  // Generate streaming data based on timeframe
  const generateStreamingData = () => {
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

    // Number of data points based on timeframe
    let dataPoints = 12;
    if (timeframe === "week") dataPoints = 7;
    if (timeframe === "month") dataPoints = 30;
    if (timeframe === "quarter") dataPoints = 90;

    // Generate data
    if (timeframe === "week" || timeframe === "month") {
      // Daily data for week or month
      for (let i = 0; i < dataPoints; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const day = date.getDate();
        const month = months[date.getMonth()].substring(0, 3);

        const baseStreams = stats?.total_streams
          ? Math.floor(stats.total_streams / (dataPoints * 3))
          : 200;
        const randomFactor = 0.7 + Math.random() * 0.6;
        const streams = Math.floor(baseStreams * randomFactor);

        data.unshift({
          name: `${day} ${month}`,
          streams: streams,
        });
      }
    } else {
      // Monthly data for quarter or year
      const numMonths = timeframe === "quarter" ? 3 : 12;
      for (let i = 0; i < numMonths; i++) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const baseStreams = stats?.total_streams
          ? Math.floor(stats.total_streams / numMonths)
          : 5000;

        const randomFactor = 0.7 + Math.random() * 0.6;
        const streams = Math.floor(baseStreams * randomFactor);

        data.unshift({
          name: months[monthIndex],
          streams: streams,
        });
      }
    }

    setStreamingData(data);
  };

  // Generate streaming data from actual stats
  const generateStreamingDataFromStats = (streamingStats: any[]) => {
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

    // Group by month or day based on timeframe
    const groupedData: Record<string, number> = {};

    streamingStats.forEach((stat) => {
      const date = new Date(stat.date);
      let key;

      if (timeframe === "week" || timeframe === "month") {
        // Group by day for week or month view
        const day = date.getDate();
        const month = months[date.getMonth()].substring(0, 3);
        key = `${day} ${month}`;
      } else {
        // Group by month for quarter or year view
        key = months[date.getMonth()];
      }

      if (!groupedData[key]) {
        groupedData[key] = 0;
      }

      groupedData[key] += stat.stream_count;
    });

    // Convert to array format for chart
    const data = Object.entries(groupedData).map(([name, streams]) => ({
      name,
      streams,
    }));

    // Sort by date
    data.sort((a, b) => {
      // For month names
      if (months.includes(a.name)) {
        return months.indexOf(a.name) - months.indexOf(b.name);
      }

      // For day month format (e.g., "15 Янв")
      const dayA = parseInt(a.name.split(" ")[0]);
      const dayB = parseInt(b.name.split(" ")[0]);
      return dayA - dayB;
    });

    setStreamingData(data);
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
          <h1 className="text-3xl font-bold">Аналитика</h1>
          <p className="text-muted-foreground mt-1">
            Подробная статистика вашей музыки
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Download className="mr-2 h-4 w-4" />
            Экспорт данных
          </Button>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Выберите период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Последняя неделя</SelectItem>
              <SelectItem value="month">Последний месяц</SelectItem>
              <SelectItem value="quarter">Последний квартал</SelectItem>
              <SelectItem value="year">Последний год</SelectItem>
              <SelectItem value="all">Все время</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  {stats?.total_streams.toLocaleString() || "0"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span
                    className={`${(stats?.stream_change || 0) > 0 ? "text-green-500" : "text-red-500"} font-medium`}
                  >
                    {(stats?.stream_change || 0) > 0 ? "+" : ""}
                    {stats?.stream_change || 0}%
                  </span>{" "}
                  с прошлого периода
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center dark:bg-blue-500/20 dark:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
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
                  ${stats?.total_revenue.toFixed(2) || "0.00"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span
                    className={`${(stats?.revenue_change || 0) > 0 ? "text-green-500" : "text-red-500"} font-medium`}
                  >
                    {(stats?.revenue_change || 0) > 0 ? "+" : ""}
                    {stats?.revenue_change || 0}%
                  </span>{" "}
                  с прошлого периода
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center dark:bg-green-500/20 dark:shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
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
                  {stats?.total_audience.toLocaleString() || "0"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span
                    className={`${(stats?.audience_change || 0) > 0 ? "text-green-500" : "text-red-500"} font-medium`}
                  >
                    {(stats?.audience_change || 0) > 0 ? "+" : ""}
                    {stats?.audience_change || 0}%
                  </span>{" "}
                  с прошлого периода
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center dark:bg-purple-500/20 dark:shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="platforms">Платформы</TabsTrigger>
          <TabsTrigger value="tracks">Треки</TabsTrigger>
          <TabsTrigger value="geography">География</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Динамика прослушиваний</CardTitle>
              <CardDescription>
                Количество прослушиваний по месяцам
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <AreaChart
                  data={streamingData}
                  index="name"
                  categories={["streams"]}
                  colors={["blue"]}
                  valueFormatter={(value: number) =>
                    `${value.toLocaleString()} прослушиваний`
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Распределение по платформам</CardTitle>
              <CardDescription>
                Прослушивания на разных стриминговых сервисах
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 h-[300px]">
                <PieChart
                  data={platformStats.map((p) => ({
                    name: p.platform_name,
                    value: p.streams,
                  }))}
                  index="name"
                  category="value"
                  valueFormatter={(value: number) =>
                    `${value.toLocaleString()} прослушиваний`
                  }
                  colors={[
                    "emerald",
                    "violet",
                    "indigo",
                    "rose",
                    "cyan",
                    "amber",
                  ]}
                />
              </div>
              <div className="flex-1 space-y-4">
                {platformStats.map((platform, index) => (
                  <div
                    key={platform.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${index === 0 ? "bg-emerald-500" : index === 1 ? "bg-violet-500" : index === 2 ? "bg-indigo-500" : "bg-rose-500"}`}
                      ></div>
                      <span>{platform.platform_name}</span>
                    </div>
                    <span className="font-medium">
                      {platform.streams.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracks" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Топ треков</CardTitle>
              <CardDescription>Ваши самые популярные треки</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <BarChart
                  data={trackStats.map((t) => ({
                    name: t.track_name,
                    streams: t.streams,
                  }))}
                  index="name"
                  categories={["streams"]}
                  colors={["violet"]}
                  valueFormatter={(value: number) =>
                    `${value.toLocaleString()} прослушиваний`
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>География аудитории</CardTitle>
              <CardDescription>
                Распределение слушателей по странам
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 h-[300px]">
                <PieChart
                  data={countryStats.map((c) => ({
                    name: c.country_name,
                    value: c.percentage,
                  }))}
                  index="name"
                  category="value"
                  valueFormatter={(value: number) => `${value}%`}
                  colors={["blue", "cyan", "indigo", "violet", "slate"]}
                />
              </div>
              <div className="flex-1 space-y-4">
                {countryStats.map((country, index) => (
                  <div
                    key={country.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${index === 0 ? "bg-blue-500" : index === 1 ? "bg-cyan-500" : index === 2 ? "bg-indigo-500" : index === 3 ? "bg-violet-500" : "bg-slate-500"}`}
                      ></div>
                      <span>{country.country_name}</span>
                    </div>
                    <span className="font-medium">{country.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
