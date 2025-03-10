import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { email, password } = await request.json();

    // First check if the user exists
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", email)
      .maybeSingle();

    // If user doesn't exist in profiles table, return error
    if (!userData) {
      return NextResponse.json(
        { error: "Пользователь не найден. Пожалуйста, зарегистрируйтесь." },
        { status: 404 },
      );
    }

    // Now attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === "Email not confirmed") {
        return NextResponse.json(
          {
            error:
              "Пожалуйста, подтвердите вашу электронную почту. Проверьте входящие сообщения.",
          },
          { status: 400 },
        );
      }

      return NextResponse.json(
        { error: error.message || "Ошибка входа" },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, session: data.session });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Произошла ошибка при входе" },
      { status: 500 },
    );
  }
}
