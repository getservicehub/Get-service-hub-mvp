// Colocar en: src/app/api/account/delete-request-public/route.ts
//
// Flujo: alguien manda su correo desde la página pública -> le mandamos un link
// firmado/con token de un solo uso -> al hacer clic en ese link (otra ruta,
// /api/account/delete-confirm?token=...) ahí sí se ejecuta el borrado real
// usando la misma lógica de delete-account-route.ts.
//
// AJUSTAR: usa Resend (que ya tienes configurado) para mandar el correo real.

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../../../lib/supabase/server'; // ajustar import real
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const { email, reason } = await req.json();
  const supabase = createServerClient();

  // Siempre responde éxito, exista o no la cuenta — no reveles si un correo
  // está registrado o no (evita enumeración de usuarios).
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (profile) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(); // 24h

    await supabase.from('deletion_confirmation_tokens').insert({
      user_id: profile.id,
      token,
      expires_at: expiresAt,
      reason: reason || null,
    });

    // TODO: enviar correo real vía Resend con un link tipo:
    // https://getservihub.com/api/account/delete-confirm?token=${token}
    // await resend.emails.send({ ... })
  }

  return NextResponse.json({ success: true });
}
