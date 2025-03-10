import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { currentPassword, newPassword } = await request.json();

    // Get current session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    // First verify the current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: session.user.email!,
      password: currentPassword,
    });

    if (signInError) {
      return NextResponse.json(
        { error: "Текущий пароль неверен" },
        { status: 400 },
      );
    }

    // Update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || "Не удалось обновить пароль" },
        { status: 400 },
      );
    }

    // Add activity
    await supabase.from("user_activity").insert({
      user_id: session.user.id,
      activity_type: "password-changed",
      title: "Пароль был успешно изменен",
    });

    return NextResponse.json({
      success: true,
      message: "Пароль успешно обновлен",
    });
  } catch (error: any) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { error: error.message || "Произошла ошибка при обновлении пароля" },
      { status: 500 },
    );
  }
}
