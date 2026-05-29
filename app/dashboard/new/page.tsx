import { createProposalAction } from '@/app/actions';
import { Shell } from '@/components/shell';

export default function NewProposalPage() {
  return (
    <Shell className="max-w-4xl">
      <main className="space-y-8">
        <header>
          <p className="text-sm uppercase tracking-[0.3em] text-moss">New proposal</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">Generate a proposal from a short brief</h1>
        </header>

        <form action={createProposalAction} className="grid gap-6 rounded-[2rem] border border-ink/10 bg-white/80 p-8 shadow-halo">
          <label className="block text-sm font-medium text-ink">
            Proposal title
            <input name="title" placeholder="Growth Strategy Proposal" className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm" />
          </label>

          <label className="block text-sm font-medium text-ink">
            Client name
            <input name="clientName" required placeholder="Hannah Morales" className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm" />
          </label>

          <label className="block text-sm font-medium text-ink">
            Project summary
            <textarea
              name="projectSummary"
              required
              rows={6}
              placeholder="Two paragraphs describing the client need, scope, and desired outcome."
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-ink">
              Amount in cents
              <input name="amountCents" type="number" min="1" required defaultValue={250000} className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm" />
            </label>

            <label className="block text-sm font-medium text-ink">
              Currency
              <input name="currency" defaultValue="usd" className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm uppercase" />
            </label>
          </div>

          <button className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper">Generate proposal</button>
        </form>
      </main>
    </Shell>
  );
}
