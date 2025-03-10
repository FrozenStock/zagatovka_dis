"use server";

import { createClient } from "./server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  DashboardStats,
  PlatformStats,
  CountryStats,
  TrackStats,
  UserActivity,
  Release,
  Track,
} from "./types";

// Dashboard Stats Actions
export async function getDashboardStats(
  userId: string,
): Promise<DashboardStats | null> {
  const supabase = createClient();

  try {
    // First check if there are multiple rows
    const { data: checkData, error: checkError } = await supabase
      .from("dashboard_stats")
      .select("id")
      .eq("user_id", userId);

    if (checkError) {
      console.error("Error checking dashboard stats:", checkError);
      return null;
    }

    // If multiple rows exist, get the most recent one
    if (checkData && checkData.length > 1) {
      const { data, error } = await supabase
        .from("dashboard_stats")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching dashboard stats:", error);
        return null;
      }

      return data;
    } else {
      // If only one row or no rows, use single()
      const { data, error } = await supabase
        .from("dashboard_stats")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching dashboard stats:", error);
        return null;
      }

      return data;
    }
  } catch (error) {
    console.error("Unexpected error fetching dashboard stats:", error);
    return null;
  }
}

// Platform Stats Actions
export async function getPlatformStats(
  userId: string,
): Promise<PlatformStats[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("platform_stats")
      .select("*")
      .eq("user_id", userId)
      .order("percentage", { ascending: false });

    if (error) {
      console.error("Error fetching platform stats:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching platform stats:", error);
    return [];
  }
}

// Country Stats Actions
export async function getCountryStats(userId: string): Promise<CountryStats[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("country_stats")
      .select("*")
      .eq("user_id", userId)
      .order("percentage", { ascending: false });

    if (error) {
      console.error("Error fetching country stats:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching country stats:", error);
    return [];
  }
}

// Track Stats Actions
export async function getTrackStats(userId: string): Promise<TrackStats[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("track_stats")
      .select("*")
      .eq("user_id", userId)
      .order("streams", { ascending: false });

    if (error) {
      console.error("Error fetching track stats:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching track stats:", error);
    return [];
  }
}

// User Activity Actions
export async function getUserActivities(
  userId: string,
): Promise<UserActivity[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("user_activity")
      .select("*")
      .eq("user_id", userId)
      .order("activity_time", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching user activities:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching user activities:", error);
    return [];
  }
}

// Release Actions
export async function getReleases(userId: string): Promise<Release[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("releases")
      .select("*")
      .eq("artist_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching releases:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching releases:", error);
    return [];
  }
}

export async function getRecentReleases(
  userId: string,
  limit: number = 3,
): Promise<Release[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("releases")
      .select("*")
      .eq("artist_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recent releases:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching recent releases:", error);
    return [];
  }
}

export async function createRelease(data: {
  userId: string;
  title: string;
  releaseDate: string;
  status: string;
  genre?: string;
  description?: string;
  releaseType?: string;
  coverArtUrl?: string;
}) {
  const supabase = createClient();

  try {
    const { data: release, error } = await supabase
      .from("releases")
      .insert({
        artist_id: data.userId,
        title: data.title,
        release_date: data.releaseDate,
        status: data.status,
        genre: data.genre || null,
        description: data.description || null,
        release_type: data.releaseType || "single",
        cover_art_url: data.coverArtUrl || null,
        moderation_status: "pending",
        distribution_status: "not_started",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating release:", error);
      return null;
    }

    // Add activity
    await supabase.from("user_activity").insert({
      user_id: data.userId,
      activity_type: "release-created",
      title: `Создан новый релиз "${data.title}"`,
    });

    revalidatePath("/dashboard/releases");
    revalidatePath("/dashboard");

    return release;
  } catch (error) {
    console.error("Unexpected error creating release:", error);
    return null;
  }
}

// Track Actions
export async function getTracks(releaseId: string): Promise<Track[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("tracks")
      .select("*")
      .eq("release_id", releaseId)
      .order("track_number", { ascending: true });

    if (error) {
      console.error("Error fetching tracks:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching tracks:", error);
    return [];
  }
}

export async function createTrack(data: {
  releaseId: string;
  userId: string;
  title: string;
  trackNumber: number;
}) {
  const supabase = createClient();

  try {
    const { data: track, error } = await supabase
      .from("tracks")
      .insert({
        release_id: data.releaseId,
        title: data.title,
        track_number: data.trackNumber,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating track:", error);
      return null;
    }

    // Add activity
    await supabase.from("user_activity").insert({
      user_id: data.userId,
      activity_type: "track-added",
      title: `Добавлен новый трек "${data.title}"`,
    });

    revalidatePath(`/dashboard/releases/${data.releaseId}`);

    return track;
  } catch (error) {
    console.error("Unexpected error creating track:", error);
    return null;
  }
}

// Profile Actions
export async function updateProfile(data: {
  userId: string;
  artistName?: string;
  bio?: string;
  genre?: string;
  profileImageUrl?: string;
}) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        artist_name: data.artistName,
        bio: data.bio,
        genre: data.genre,
        profile_image_url: data.profileImageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.userId);

    if (error) {
      console.error("Error updating profile:", error);
      return false;
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return true;
  } catch (error) {
    console.error("Unexpected error updating profile:", error);
    return false;
  }
}

// License Agreement Actions
export async function getLicenseAgreement(userId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("license_agreements")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching license agreement:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching license agreement:", error);
    return null;
  }
}

export async function updatePassword(data: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) {
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.updateUser({
      password: data.newPassword,
    });

    if (error) {
      console.error("Error updating password:", error);
      return { success: false, message: error.message };
    }

    return { success: true, message: "Пароль успешно обновлен" };
  } catch (error: any) {
    console.error("Unexpected error updating password:", error);
    return {
      success: false,
      message: error.message || "Произошла ошибка при обновлении пароля",
    };
  }
}

// Initialize user data for demo purposes
export async function initializeUserData(userId: string) {
  const supabase = createClient();

  try {
    // Check if user already has dashboard stats
    const { data: existingStats } = await supabase
      .from("dashboard_stats")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingStats) {
      // User already has data initialized
      return true;
    }

    // Initialize dashboard stats
    await supabase.from("dashboard_stats").insert({
      user_id: userId,
      total_streams: 86520,
      stream_change: 12.5,
      total_revenue: 3245.78,
      revenue_change: 8.3,
      total_audience: 32450,
      audience_change: 15.2,
    });

    // Initialize platform stats
    await supabase.from("platform_stats").insert([
      {
        user_id: userId,
        platform_name: "Spotify",
        streams: 45000,
        percentage: 52,
      },
      {
        user_id: userId,
        platform_name: "Apple Music",
        streams: 22000,
        percentage: 25,
      },
      {
        user_id: userId,
        platform_name: "YouTube Music",
        streams: 12000,
        percentage: 14,
      },
      {
        user_id: userId,
        platform_name: "Others",
        streams: 7520,
        percentage: 9,
      },
    ]);

    // Initialize country stats
    await supabase.from("country_stats").insert([
      {
        user_id: userId,
        country_name: "United States",
        listeners: 12500,
        percentage: 38,
      },
      {
        user_id: userId,
        country_name: "United Kingdom",
        listeners: 5600,
        percentage: 17,
      },
      {
        user_id: userId,
        country_name: "Germany",
        listeners: 4200,
        percentage: 13,
      },
      {
        user_id: userId,
        country_name: "Canada",
        listeners: 3800,
        percentage: 12,
      },
      {
        user_id: userId,
        country_name: "Others",
        listeners: 6350,
        percentage: 20,
      },
    ]);

    // Initialize track stats
    await supabase.from("track_stats").insert([
      { user_id: userId, track_name: "Summer Vibes", streams: 25000 },
      { user_id: userId, track_name: "Midnight Dreams", streams: 18000 },
      { user_id: userId, track_name: "Urban Echoes", streams: 15000 },
      { user_id: userId, track_name: "Neon Nights", streams: 12000 },
      { user_id: userId, track_name: "Cosmic Journey", streams: 8000 },
    ]);

    // Initialize user activities
    await supabase.from("user_activity").insert([
      {
        user_id: userId,
        activity_type: "stream-milestone",
        title: "Summer Vibes EP достиг 10,000 прослушиваний",
        activity_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      },
      {
        user_id: userId,
        activity_type: "new-follower",
        title: "5 новых подписчиков на Spotify",
        activity_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      },
      {
        user_id: userId,
        activity_type: "payment",
        title: "Получен платеж в размере $127.45",
        activity_time: new Date(
          Date.now() - 3 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 3 days ago
      },
    ]);

    // Initialize releases
    const { data: release1 } = await supabase
      .from("releases")
      .insert({
        artist_id: userId,
        title: "Summer Vibes EP",
        release_date: "2023-06-15",
        status: "published",
        genre: "electronic",
        release_type: "ep",
        moderation_status: "approved",
        distribution_status: "completed",
        description: "Летний EP с танцевальными треками",
        cover_art_url:
          "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
      })
      .select()
      .single();

    const { data: release2 } = await supabase
      .from("releases")
      .insert({
        artist_id: userId,
        title: "Midnight Dreams",
        release_date: "2023-04-22",
        status: "published",
        genre: "pop",
        release_type: "single",
        moderation_status: "approved",
        distribution_status: "completed",
        description: "Атмосферный сингл о ночных мечтах",
        cover_art_url:
          "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&q=80",
      })
      .select()
      .single();

    const { data: release3 } = await supabase
      .from("releases")
      .insert({
        artist_id: userId,
        title: "Urban Echoes",
        release_date: "2023-02-10",
        status: "published",
        genre: "hip-hop",
        release_type: "album",
        moderation_status: "approved",
        distribution_status: "completed",
        description: "Альбом о городской жизни и ее отголосках",
        cover_art_url:
          "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80",
      })
      .select()
      .single();

    // Initialize upcoming releases
    await supabase.from("releases").insert({
      artist_id: userId,
      title: "Neon Nights",
      release_date: "2024-07-15",
      status: "scheduled",
      genre: "electronic",
      release_type: "single",
      moderation_status: "pending",
      distribution_status: "not_started",
      description: "Электронный сингл с неоновыми мотивами",
      cover_art_url:
        "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=400&q=80",
    });

    await supabase.from("releases").insert({
      artist_id: userId,
      title: "Cosmic Journey",
      release_date: new Date().toISOString().split("T")[0],
      status: "draft",
      genre: "electronic",
      release_type: "ep",
      moderation_status: "pending",
      distribution_status: "not_started",
      description: "Космическое путешествие в звуках",
      cover_art_url:
        "https://images.unsplash.com/photo-1535478044878-3ed83d5456ef?w=400&q=80",
    });

    // Add tracks to releases
    if (release1) {
      await supabase.from("tracks").insert([
        { release_id: release1.id, title: "Summer Vibes", track_number: 1 },
        { release_id: release1.id, title: "Beach Party", track_number: 2 },
        { release_id: release1.id, title: "Sunset Dreams", track_number: 3 },
      ]);
    }

    if (release2) {
      await supabase.from("tracks").insert([
        { release_id: release2.id, title: "Midnight Dreams", track_number: 1 },
        { release_id: release2.id, title: "Starlight", track_number: 2 },
        { release_id: release2.id, title: "Moonwalk", track_number: 3 },
      ]);
    }

    if (release3) {
      await supabase.from("tracks").insert([
        { release_id: release3.id, title: "Urban Echoes", track_number: 1 },
        { release_id: release3.id, title: "City Lights", track_number: 2 },
        { release_id: release3.id, title: "Downtown", track_number: 3 },
      ]);
    }

    return true;
  } catch (error) {
    console.error("Error initializing user data:", error);
    return false;
  }
}
