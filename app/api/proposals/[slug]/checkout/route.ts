import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { getAppUrl } from '@/lib/site';
import { getStripe } from '@/lib/stripe';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createSupabaseAdminClient();
  const { data: proposal, error } = await supabase.from('proposals').select('*').eq('slug', slug).maybeSingle();

  if (error || !proposal) {
    return NextResponse.json({ error: error?.message ?? 'Proposal not found.' }, { status: 404 });
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return NextResponse.json({ error: 'Stripe secret key missing.' }, { status: 500 });
  }

  const stripe = getStripe();
  const origin = request.headers.get('origin') ?? getAppUrl();

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: proposal.client_email ?? undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: proposal.currency,
          unit_amount: proposal.amount_cents,
          product_data: {
            name: proposal.title,
            description: proposal.client_name
          }
        }
      }
    ],
    metadata: {
      proposal_slug: proposal.slug,
      proposal_id: proposal.id
    },
    success_url: `${origin}/proposals/${proposal.slug}?paid=1`,
    cancel_url: `${origin}/proposals/${proposal.slug}?cancelled=1`
  });

  await supabase
    .from('proposals')
    .update({ stripe_checkout_session_id: session.id })
    .eq('id', proposal.id);

  return NextResponse.json({ url: session.url });
}
