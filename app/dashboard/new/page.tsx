import { createProposalAction } from '@/app/actions';
import { Shell } from '@/components/shell';
import { ProposalGenerationForm } from '@/components/proposal/proposal-generation-form';

export default function NewProposalPage() {
  return (
    <Shell className="max-w-4xl">
      <main className="space-y-8">
        <header>
          <p className="text-sm uppercase tracking-[0.3em] text-moss">New proposal</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">Generate a proposal from a short brief</h1>
        </header>

        <ProposalGenerationForm action={createProposalAction} />
      </main>
    </Shell>
  );
}
