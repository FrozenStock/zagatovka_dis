import { createClient } from "./server";

export async function getTrackStats(userId: string) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("track_stats")
      .select("*")
      .eq("user_id", userId)
      .order("streams", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching track stats:", error);
    return [];
  }
}
