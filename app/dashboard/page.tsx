import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { signOutAction } from '@/app/actions';
import { Shell } from '@/components/shell';

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const { data: proposals } = await supabase
    .from('proposals')
    .select('id, slug, title, client_name, status, amount_cents, currency, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const proposalList = proposals ?? [];

  return (
    <Shell>
      <main className="space-y-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-ink/10 bg-white/80 p-8 shadow-halo md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-moss">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-ink">Your proposals</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">
              Create a proposal, review the generated draft, and share the public URL with your client.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/new" className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper">
              Create new proposal
            </Link>
            <form action={signOutAction}>
              <button className="rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-medium text-ink">
                Sign out
              </button>
            </form>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {proposalList.length ? (
            proposalList.map((proposal) => (
              <article key={proposal.id} className="rounded-[1.5rem] border border-ink/10 bg-white/80 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-ink/40">{proposal.status}</p>
                <h2 className="mt-3 text-2xl font-semibold text-ink">{proposal.title}</h2>
                <p className="mt-2 text-sm text-ink/70">Client: {proposal.client_name}</p>
                <p className="mt-2 text-sm text-ink/70">Amount: ${(proposal.amount_cents / 100).toFixed(2)} {proposal.currency.toUpperCase()}</p>
                <Link href={`/dashboard/proposals/${proposal.slug}`} className="mt-4 inline-flex text-sm font-medium text-moss">
                  Open proposal
                </Link>
              </article>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-ink/20 bg-white/60 p-8 text-sm text-ink/70">
              No proposals yet. Create the first one to generate a shareable public page.
            </div>
          )}
        </section>

        <section className="rounded-[2rem] border border-dashed border-ink/20 bg-white/50 p-8 text-sm text-ink/70">
          The template structure is built into the generator, so every proposal starts from the same high-performing layout.
        </section>
      </main>
    </Shell>
  );
}