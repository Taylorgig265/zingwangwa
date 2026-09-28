import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Refreshes the Supabase auth session cookie on every request (required by
 * @supabase/ssr) so Server Components and route handlers always see a valid session.
 * Route protection itself happens in app/admin/layout.tsx (role check).
 */
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return NextResponse.next(); // demo mode

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // IMPORTANT: do not add logic between createServerClient and getUser().
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: [
    // Skip static assets, images, the service worker and the webhook (raw body)
    "/((?!api/stripe/webhook|_next/static|_next/image|favicon.ico|icon.svg|sw.js|menu/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
