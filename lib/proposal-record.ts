export type ProposalContentSection = {
  heading: string;
  body: string;
  bullets: string[];
};

export type ProposalContent = {
  summary: string;
  sections: ProposalContentSection[];
  investment: string;
  closing: string;
};

export type ProposalRecord = {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  client_name: string;
  project_summary: string;
  amount_cents: number;
  currency: string;
  status: 'draft' | 'published' | 'signed' | 'paid' | 'completed';
  content_json: ProposalContent;
  signature_name: string | null;
  signature_data_url: string | null;
  signed_at: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};
