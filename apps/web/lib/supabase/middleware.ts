import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type CookieToSet = { name: string; value: string; options: CookieOptions };

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Local prototyping: when Supabase env vars are absent, skip the auth
  // middleware entirely. Public routes work without auth; in-app routes
  // will surface a clearer error than a Supabase-client crash.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnon) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnon,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/auth');
  const isApiRoute = pathname.startsWith('/api');
  const isPublicRoute =
    pathname === '/' ||
    isAuthRoute ||
    isApiRoute ||
    pathname.startsWith('/invite') ||
    pathname.startsWith('/pricing') ||
    pathname.startsWith('/for/') ||
    pathname.startsWith('/demo') ||
    pathname.startsWith('/dev/');

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (user && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    const url = request.nextUrl.clone();
    url.pathname = '/inbox';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
