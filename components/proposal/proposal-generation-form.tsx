"use client";

import { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? 'Generating proposal...' : 'Generate proposal'}
    </button>
  );
}

function GenerationProgress() {
  const { pending } = useFormStatus();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!pending) {
      setProgress(0);
      return;
    }

    setProgress(12);
    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 90) {
          return current;
        }

        return Math.min(current + Math.max(4, Math.round(Math.random() * 14)), 90);
      });
    }, 450);

    return () => window.clearInterval(interval);
  }, [pending]);

  if (!pending) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-2xl border border-moss/20 bg-moss/10 p-4">
      <div className="flex items-center justify-between text-sm text-ink/70">
        <span>AI is writing your proposal</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-moss transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs leading-5 text-ink/60">
        This can take a few seconds while the template is filled from your brief.
      </p>
    </div>
  );
}

type ProposalGenerationFormProps = {
  action: (formData: FormData) => void | Promise<void>;
};

export function ProposalGenerationForm({ action }: ProposalGenerationFormProps) {
  return (
    <form action={action} className="grid gap-6 rounded-[2rem] border border-ink/10 bg-white/80 p-8 shadow-halo">
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

      <GenerationProgress />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-xs leading-5 text-ink/55">
          After generation, you&apos;ll preview the proposal and continue to signature and payment.
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}
