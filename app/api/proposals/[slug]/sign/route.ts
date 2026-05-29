import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = await request.json().catch(() => null);
  const signatureName = String(body?.signatureName ?? '').trim();
  const signatureDataUrl = String(body?.signatureDataUrl ?? '').trim();

  if (!signatureName || !signatureDataUrl) {
    return NextResponse.json({ error: 'Missing signature fields.' }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: proposal, error } = await supabase
    .from('proposals')
    .update({
      signature_name: signatureName,
      signature_data_url: signatureDataUrl,
      signed_at: new Date().toISOString(),
      status: 'signed'
    })
    .eq('slug', slug)
    .select('*')
    .maybeSingle();

  if (error || !proposal) {
    return NextResponse.json({ error: error?.message ?? 'Could not sign proposal.' }, { status: 500 });
  }

  return NextResponse.json({ proposal });
}
