create extension if not exists "pgcrypto";

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  title text not null,
  client_name text not null,
  project_summary text not null,
  amount_cents integer not null,
  currency text not null default 'usd',
  status text not null default 'draft',
  content_json jsonb not null default '{}'::jsonb,
  signature_name text,
  signature_data_url text,
  signed_at timestamptz,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists proposals_set_updated_at on public.proposals;
create trigger proposals_set_updated_at
before update on public.proposals
for each row execute function public.set_updated_at();

alter table public.proposals enable row level security;

drop policy if exists "Users can read their proposals" on public.proposals;
create policy "Users can read their proposals"
on public.proposals
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their proposals" on public.proposals;
create policy "Users can insert their proposals"
on public.proposals
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their proposals" on public.proposals;
create policy "Users can update their proposals"
on public.proposals
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
