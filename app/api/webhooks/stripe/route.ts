import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return NextResponse.json({ error: 'Missing Stripe secret key.' }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: '2025-08-27.basil' });
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const rawBody = await request.text();
  const signature = (await headers()).get('stripe-signature');

  let event: Stripe.Event;
  try {
    event = webhookSecret && signature
      ? stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
      : JSON.parse(rawBody) as Stripe.Event;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid webhook payload.';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const proposalSlug = String(session.metadata?.proposal_slug ?? '');

    if (proposalSlug) {
      const supabase = createSupabaseAdminClient();
      await supabase.from('proposals').update({
        status: 'completed',
        paid_at: new Date().toISOString(),
        stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null
      }).eq('slug', proposalSlug);
    }
  }

  return NextResponse.json({ received: true });
}
