import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { name, email, password } = await request.json();

    // Register the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          artist_name: name,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/auth/callback`,
      },
    });

    if (authError) throw authError;

    // Create profile record
    if (authData?.user) {
      // Skip profile creation here as it will be handled by the trigger
      // The trigger will automatically create a profile when a user is created
    }

    return NextResponse.json({
      success: true,
      user: authData?.user,
      emailConfirmed:
        !authData?.user?.identities?.[0]?.identity_data?.email_verified,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create account" },
      { status: 400 },
    );
  }
}
