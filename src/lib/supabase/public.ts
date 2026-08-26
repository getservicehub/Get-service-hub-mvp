import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente SIN cookies — el que usa todo el data layer actual.
 * Necesario porque generateStaticParams corre en build time sin
 * contexto de request, donde cookies() no está permitido.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
