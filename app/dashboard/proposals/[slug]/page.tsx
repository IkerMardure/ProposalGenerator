import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Shell } from '@/components/shell';

export default async function DashboardProposalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const { data: proposal } = await supabase
    .from('proposals')
    .select('*')
    .eq('slug', slug)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!proposal) {
    notFound();
  }

  return (
    <Shell className="max-w-5xl">
      <main className="space-y-8">
        <section className="rounded-[2rem] border border-ink/10 bg-white/80 p-8 shadow-halo">
          <p className="text-sm uppercase tracking-[0.3em] text-moss">Internal proposal</p>
          <h1 className="mt-3 text-4xl font-semibold text-ink">{proposal.title}</h1>
          <p className="mt-4 text-sm text-ink/70">Client: {proposal.client_name}</p>
          <p className="mt-2 text-sm text-ink/70">Public URL: <Link href={`/proposals/${proposal.slug}`} className="text-moss underline">/proposals/{proposal.slug}</Link></p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.5rem] border border-ink/10 bg-paper/70 p-6">
            <h2 className="text-xl font-semibold text-ink">Draft summary</h2>
            <p className="mt-3 text-sm leading-6 text-ink/70">{proposal.project_summary}</p>
          </div>
          <div className="rounded-[1.5rem] border border-ink/10 bg-paper/70 p-6">
            <h2 className="text-xl font-semibold text-ink">Payment status</h2>
            <p className="mt-3 text-sm leading-6 text-ink/70">Status: {proposal.status}</p>
            <p className="mt-2 text-sm leading-6 text-ink/70">Amount: ${(proposal.amount_cents / 100).toFixed(2)} {proposal.currency.toUpperCase()}</p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-dashed border-ink/20 bg-white/50 p-8 text-sm text-ink/70">
          The client-facing version lives at the public proposal URL and does not require authentication.
        </section>
      </main>
    </Shell>
  );
}
