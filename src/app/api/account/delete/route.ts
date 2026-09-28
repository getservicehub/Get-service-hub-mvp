// Colocar en: src/app/api/account/delete/route.ts
//
// AJUSTAR:
// - Nombres reales de tablas/columnas ("profiles", "service_requirements", etc.)
// - Cómo re-verificas contraseña con Supabase Auth (aquí uso signInWithPassword
//   como forma simple de reconfirmar identidad de una sesión ya autenticada).
// - Si usas Stripe, agrega aquí la cancelación inmediata de la suscripción
//   (a diferencia del botón de "cancelar suscripción" normal, en un delete de
//   cuenta sí tiene sentido cancelar de inmediato, no al final del periodo).

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../../../lib/supabase/server'; // ajustar import real

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ success: false, error: 'not-authenticated' }, { status: 401 });
  }

  // Reconfirmar identidad antes de un delete irreversible.
  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });
  if (reauthError) {
    return NextResponse.json({ success: false, error: 'wrong-password' }, { status: 403 });
  }

  try {
    // 1) Log mínimo de cumplimiento — SOLO lo esencial, no dupliques aquí los
    //    datos personales que estás a punto de borrar.
    await supabase.from('deletion_requests_log').insert({
      user_id_hash: user.id, // considera hashear si guardas esto en una tabla de retención larga
      requested_at: new Date().toISOString(),
      channel: 'self-service',
    });

    // 2) TODO: si hay suscripción activa en Stripe, cancelarla de inmediato aquí
    //    (stripe.subscriptions.cancel(...), no cancel_at_period_end).

    // 3) Anonimizar el perfil en vez de borrar la fila completa — así los
    //    completed_jobs que dependen del profesional contratado se mantienen
    //    sin exponer la identidad del cliente.
    await supabase
      .from('profiles')
      .update({
        full_name: null,
        email: null,
        phone: null,
        avatar_url: null,
        // AJUSTAR: cualquier otro campo identificable de tu tabla real
        anonymized_at: new Date().toISOString(),
        status: 'deleted',
      })
      .eq('id', user.id);

    // 4) Cualquier "service_requirements" del cliente que sigan abiertos:
    //    ciérralos/expíralos también, no los dejes huérfanos.
    await supabase
      .from('service_requirements')
      .update({ status: 'closed' })
      .eq('client_id', user.id)
      .eq('status', 'open');

    // 5) Eliminar el usuario de Supabase Auth (esto invalida su login).
    //    Requiere la service_role key — este endpoint debe correr solo server-side.
    const { createClient } = await import('@supabase/supabase-js');
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );
    await adminClient.auth.admin.deleteUser(user.id);

    // 6) TODO: enviar correo de confirmación de eliminación (vía Resend) a la
    //    dirección de correo que el usuario tenía ANTES de anonimizar (captúrala
    //    en una variable local arriba, antes del paso 3, si quieres confirmarle).

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('delete-account error', err);
    return NextResponse.json({ success: false, error: 'internal-error' }, { status: 500 });
  }
}
