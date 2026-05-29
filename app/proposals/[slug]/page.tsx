import { notFound } from 'next/navigation';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { Shell } from '@/components/shell';
import { ProposalPublicView } from '@/components/proposal/proposal-public-view';

export default async function PublicProposalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createSupabaseAdminClient();
  const { data: proposal } = await supabase
    .from('proposals')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (!proposal) {
    notFound();
  }

  return (
    <Shell className="max-w-5xl">
      <main className="py-10">
        <ProposalPublicView proposal={proposal} />
      </main>
    </Shell>
  );
}
