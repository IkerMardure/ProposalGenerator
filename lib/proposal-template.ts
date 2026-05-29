export const proposalTemplateSections = [
  {
    id: 'hero',
    label: 'Business Proposal',
    title: 'Custom solutions for sustainable success',
    body:
      'This section should introduce the client, the business context, and the core value proposition in a confident, premium tone.'
  },
  {
    id: 'about',
    label: 'About Us',
    title: 'Our vision and mission',
    body:
      'Use this section to explain the brand story, point of view, and what makes the delivery team trustworthy.'
  },
  {
    id: 'services',
    label: 'What We Do',
    title: 'Business analysis, planning, and digital marketing',
    body:
      'Translate the client request into a concise scope, service list, and strategic actions.'
  },
  {
    id: 'team',
    label: 'Our Team',
    title: 'Expertise that executes',
    body:
      'Highlight roles, accountability, and confidence without sounding generic or inflated.'
  },
  {
    id: 'why',
    label: 'Why Choose Us',
    title: 'Plan for success and attention to detail',
    body:
      'Use this section to justify the recommendation, show benefits, and reinforce the implementation plan.'
  }
] as const;

export type ProposalTemplateSection = (typeof proposalTemplateSections)[number];