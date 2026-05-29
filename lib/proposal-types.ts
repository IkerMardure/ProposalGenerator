export type ProposalStatus = 'draft' | 'published' | 'signed' | 'paid' | 'completed';

export type Proposal = {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  description: string;
  status: ProposalStatus;
  amountCents: number;
  currency: string;
  createdAt: string;
};