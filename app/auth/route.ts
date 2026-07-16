import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const redirectOrigin = process.env.NEXT_PUBLIC_SITE_URL || origin;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (!code) {
    const params = new URLSearchParams();
    if (error) params.set('auth_error', error);
    if (errorDescription) params.set('auth_error_description', errorDescription);

    return NextResponse.redirect(
      new URL(`/onboarding?${params.toString()}`, redirectOrigin).toString()
    );
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError || !data?.session) {
    console.error('Supabase OAuth exchange error:', exchangeError);
    const params = new URLSearchParams();
    params.set('auth_error', 'exchange_failed');
    if (exchangeError?.message) params.set('auth_error_description', exchangeError.message);

    return NextResponse.redirect(
      new URL(`/onboarding?${params.toString()}`, redirectOrigin).toString()
    );
  }

  return NextResponse.redirect(new URL('/home', redirectOrigin).toString());
}
