import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { password } = await request.json();

    // Get current session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    // First verify the password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: session.user.email!,
      password: password,
    });

    if (signInError) {
      return NextResponse.json({ error: "Пароль неверен" }, { status: 400 });
    }

    // Delete all user data
    // 1. Delete user activities
    await supabase
      .from("user_activity")
      .delete()
      .eq("user_id", session.user.id);

    // 2. Delete dashboard stats
    await supabase
      .from("dashboard_stats")
      .delete()
      .eq("user_id", session.user.id);

    // 3. Delete platform stats
    await supabase
      .from("platform_stats")
      .delete()
      .eq("user_id", session.user.id);

    // 4. Delete country stats
    await supabase
      .from("country_stats")
      .delete()
      .eq("user_id", session.user.id);

    // 5. Delete track stats
    await supabase.from("track_stats").delete().eq("user_id", session.user.id);

    // 6. Delete license agreements
    await supabase
      .from("license_agreements")
      .delete()
      .eq("user_id", session.user.id);

    // 7. Delete streaming stats for user's tracks
    const { data: releases } = await supabase
      .from("releases")
      .select("id")
      .eq("artist_id", session.user.id);

    if (releases && releases.length > 0) {
      const releaseIds = releases.map((r) => r.id);

      // Delete streaming stats for these releases
      await supabase
        .from("streaming_stats")
        .delete()
        .in("release_id", releaseIds);

      // Get tracks for these releases
      const { data: tracks } = await supabase
        .from("tracks")
        .select("id")
        .in("release_id", releaseIds);

      if (tracks && tracks.length > 0) {
        const trackIds = tracks.map((t) => t.id);

        // Delete streaming stats for these tracks
        await supabase
          .from("streaming_stats")
          .delete()
          .in("track_id", trackIds);

        // Delete tracks
        await supabase.from("tracks").delete().in("id", trackIds);
      }

      // Delete releases
      await supabase.from("releases").delete().in("id", releaseIds);
    }

    // 8. Delete profile
    await supabase.from("profiles").delete().eq("id", session.user.id);

    // 9. Delete auth user
    const { error: deleteUserError } = await supabase.auth.admin.deleteUser(
      session.user.id,
    );

    if (deleteUserError) {
      return NextResponse.json(
        { error: deleteUserError.message || "Не удалось удалить аккаунт" },
        { status: 400 },
      );
    }

    // Sign out
    await supabase.auth.signOut();

    return NextResponse.json({
      success: true,
      message: "Аккаунт успешно удален",
    });
  } catch (error: any) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: error.message || "Произошла ошибка при удалении аккаунта" },
      { status: 500 },
    );
  }
}
