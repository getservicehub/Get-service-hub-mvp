import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase SIN manejo de cookies/sesión — seguro de usar
 * en cualquier contexto, incluyendo generateStaticParams (que corre
 * en build time, sin request HTTP, donde cookies() no está permitido).
 *
 * Úsalo para lecturas públicas que no dependen de quién está
 * logueado — que es todo lo que existe en el data layer de Pro por
 * ahora (especialidades y profesionales publicados son de lectura
 * pública vía RLS). Cuando exista una función que sí necesite sesión
 * (ej. "el profesional edita su propio perfil", Bloque 6+), esa sí
 * debe usar lib/supabase/server.ts en su lugar.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
