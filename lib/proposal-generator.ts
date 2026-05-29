import { proposalTemplateSections } from './proposal-template';
import { z } from 'zod';
import OpenAI from 'openai';

export type ProposalGenerationInput = {
  clientName: string;
  projectSummary: string;
  amountCents: number;
};

export type ProposalDraft = {
  title: string;
  summary: string;
  sections: Array<{
    heading: string;
    body: string;
    bullets: string[];
  }>;
  investment: string;
  closing: string;
};

const proposalDraftSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(20),
  sections: z
    .array(
      z.object({
        heading: z.string().min(3),
        body: z.string().min(20),
        bullets: z.array(z.string()).default([])
      })
    )
    .min(3),
  investment: z.string().min(10),
  closing: z.string().min(10)
});

export function buildProposalPrompt(input: ProposalGenerationInput) {
  const sectionOutline = proposalTemplateSections
    .map((section) => `${section.label}: ${section.title} - ${section.body}`)
    .join('\n');

  return [
    'You are drafting a premium business proposal that must feel tailored, concise, and persuasive.',
    `Client name: ${input.clientName}`,
    `Project summary: ${input.projectSummary}`,
    `Investment amount: $${(input.amountCents / 100).toFixed(2)}`,
    'Use the following section structure as the default template:',
    sectionOutline,
    'Return valid JSON with keys title, summary, sections, investment, and closing.',
    'Each section should have heading, body, and bullets.'
  ].join('\n\n');
}

function buildFallbackDraft(input: ProposalGenerationInput): ProposalDraft {
  return {
    title: `${input.clientName} Proposal`,
    summary: input.projectSummary,
    sections: proposalTemplateSections.map((section) => ({
      heading: section.title,
      body: section.body,
      bullets: [section.label, input.clientName, input.projectSummary].filter(Boolean)
    })),
    investment: `Investment: $${(input.amountCents / 100).toFixed(2)}`,
    closing: 'We are ready to move forward and deliver the proposal with care and precision.'
  };
}

export async function generateProposalDraft(input: ProposalGenerationInput): Promise<ProposalDraft> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return buildFallbackDraft(input);
  }

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
      input: buildProposalPrompt(input)
    });

    const parsed = JSON.parse(response.output_text ?? '{}');
    const result = proposalDraftSchema.parse(parsed);
    return result;
  } catch {
    return buildFallbackDraft(input);
  }
}