import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const env = {
    supabase_url: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabase_anon: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    supabase_service: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    gemini: Boolean(process.env.GEMINI_API_KEY),
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
  };

  return NextResponse.json({
    ok: true,
    service: 'flowaios-web',
    timestamp: new Date().toISOString(),
    env,
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'dev',
    region: process.env.VERCEL_REGION ?? 'local',
  });
}
