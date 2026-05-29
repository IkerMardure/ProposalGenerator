import { ButtonLink } from '@/components/button';
import { Shell } from '@/components/shell';

export default function HomePage() {
  return (
    <Shell>
      <main className="grid flex-1 place-items-center">
        <section className="max-w-4xl rounded-[2rem] border border-ink/10 bg-white/70 p-8 shadow-halo backdrop-blur md:p-12">
          <p className="text-sm uppercase tracking-[0.3em] text-moss">Proposal Generator</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-ink md:text-6xl">
            Generate client-ready proposals, sign them, and get paid from a single shareable page.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-ink/70 md:text-lg">
            This build starts with your proven proposal template and turns it into a polished workflow for drafting,
            publishing, signing, and collecting payment.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/dashboard">Open dashboard</ButtonLink>
            <ButtonLink href="/sign-in" variant="secondary">
              Sign in
            </ButtonLink>
          </div>
        </section>
      </main>
    </Shell>
  );
}