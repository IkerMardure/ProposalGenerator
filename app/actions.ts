"use server";

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { generateProposalDraft } from '@/lib/proposal-generator';
import { getAppUrl } from '@/lib/site';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'proposal';
}

export async function signInWithMagicLinkAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  if (!email) {
    redirect('/sign-in?error=missing-email');
  }

  const devBypass =
    process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === '1';

  if (devBypass) {
    // For local development we avoid sending emails and skip the proposal form.
    redirect('/dashboard?dev=1');
  }

  const supabase = await createSupabaseServerClient();
  const redirectUrl = `${getAppUrl()}/auth/callback?next=/dashboard/new`;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectUrl }
  });

  if (error) {
    redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/sign-in?sent=1');
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/');
}

export async function createProposalAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const title = String(formData.get('title') ?? '').trim();
  const clientName = String(formData.get('clientName') ?? '').trim();
  const projectSummary = String(formData.get('projectSummary') ?? '').trim();
  const amountCents = Number.parseInt(String(formData.get('amountCents') ?? '0'), 10);
  const currency = String(formData.get('currency') ?? 'usd').trim() || 'usd';

  if (!clientName || !projectSummary || !Number.isFinite(amountCents) || amountCents <= 0) {
    redirect('/dashboard/new?error=missing-fields');
  }

  const draft = await generateProposalDraft({ clientName, projectSummary, amountCents });
  const slug = `${makeSlug(title || draft.title || clientName)}-${crypto.randomUUID().slice(0, 8)}`;

  const { error } = await supabase.from('proposals').insert({
    user_id: user.id,
    slug,
    title: title || draft.title,
    client_name: clientName,
    project_summary: projectSummary,
    amount_cents: amountCents,
    currency,
    status: 'published',
    content_json: draft
  });

  if (error) {
    redirect(`/dashboard/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/dashboard');
  redirect(`/dashboard/proposals/${slug}`);
}
