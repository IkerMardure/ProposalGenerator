import { signInWithMagicLinkAction } from '@/app/actions';
import { Shell } from '@/components/shell';

export default function SignInPage({ searchParams }: any) {
  const sent = searchParams?.sent === '1';
  const error = typeof searchParams?.error === 'string' ? searchParams.error : null;

  return (
    <Shell>
      <main className="grid flex-1 place-items-center">
        <section className="w-full max-w-md rounded-[2rem] border border-ink/10 bg-white/80 p-8 shadow-halo">
          <p className="text-sm uppercase tracking-[0.3em] text-moss">Sign in</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">Email magic link</h1>
          <p className="mt-3 text-sm leading-6 text-ink/70">
            We&apos;ll send a secure link to your inbox so you can access the dashboard.
          </p>

          {sent ? <p className="mt-4 rounded-2xl bg-moss/10 px-4 py-3 text-sm text-moss">Check your email for the sign-in link.</p> : null}
          {error ? <p className="mt-4 rounded-2xl bg-ember/10 px-4 py-3 text-sm text-ember">{error}</p> : null}

          <form action={signInWithMagicLinkAction} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-ink">
              Email address
              <input
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none ring-0 placeholder:text-ink/30 focus:border-moss"
              />
            </label>
            <button className="w-full rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper">Send sign-in link</button>
          </form>
        </section>
      </main>
    </Shell>
  );
}
