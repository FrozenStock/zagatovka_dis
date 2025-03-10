import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      releaseNotifications,
      analyticsNotifications,
      paymentNotifications,
      marketingNotifications,
    } = await request.json();

    // Get current session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    // Update notification preferences in user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        notification_preferences: {
          releases: releaseNotifications,
          analytics: analyticsNotifications,
          payments: paymentNotifications,
          marketing: marketingNotifications,
        },
      },
    });

    if (updateError) {
      return NextResponse.json(
        {
          error:
            updateError.message || "Не удалось обновить настройки уведомлений",
        },
        { status: 400 },
      );
    }

    // Add activity
    await supabase.from("user_activity").insert({
      user_id: session.user.id,
      activity_type: "settings-updated",
      title: "Настройки уведомлений обновлены",
    });

    return NextResponse.json({
      success: true,
      message: "Настройки уведомлений успешно обновлены",
    });
  } catch (error: any) {
    console.error("Notification settings update error:", error);
    return NextResponse.json(
      {
        error:
          error.message ||
          "Произошла ошибка при обновлении настроек уведомлений",
      },
      { status: 500 },
    );
  }
}
