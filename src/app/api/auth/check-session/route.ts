import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    return NextResponse.json({
      session: data.session,
      user: data.session?.user || null,
    });
  } catch (error: any) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check session" },
      { status: 500 },
    );
  }
}
