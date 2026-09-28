// Colocar en: src/app/api/account/cancel-subscription/route.ts
//
// AJUSTAR:
// - El nombre real de tu tabla de perfiles/suscripciones (aquí asumo "profiles"
//   con columnas stripe_subscription_id y plan).
// - Si usas Stripe Billing Portal en vez de manejar esto tú mismo, este endpoint
//   puede simplificarse a solo redirigir al portal de Stripe — pero CARL exige
//   que el flujo sea "exclusivamente online, a voluntad", así que igual funciona,
//   solo cambia dónde vive la lógica de cancelación real.

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '../../../../lib/supabase/server'; // ajustar el import relativo real

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'not-authenticated' }, { status: 401 });
  }

  // AJUSTAR: nombre real de la tabla/columnas
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('stripe_subscription_id, plan')
    .eq('id', user.id)
    .single();

  if (profileError || !profile?.stripe_subscription_id) {
    return NextResponse.json({ success: false, error: 'no-active-subscription' }, { status: 400 });
  }

  try {
    // Cancela al final del periodo actual, no de inmediato — el usuario ya pagó ese periodo.
    await stripe.subscriptions.update(profile.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    // Marca en tu DB que la cancelación está en curso (el webhook de Stripe
    // "customer.subscription.deleted" es el que debe hacer el downgrade real a "free"
    // cuando efectivamente termine el periodo).
    await supabase
      .from('profiles')
      .update({ subscription_cancel_at_period_end: true })
      .eq('id', user.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('cancel-subscription error', err);
    return NextResponse.json({ success: false, error: 'stripe-error' }, { status: 500 });
  }
}
