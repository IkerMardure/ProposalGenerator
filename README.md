# Proposal Generator App

Initial scaffold for a proposal generation platform built with Next.js, Supabase, and Stripe.

## Environment

Set `NEXT_PUBLIC_SUPABASE_URL` plus one of `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` before running the app.

Current local Supabase project: `rxtkxhsescjziyhyieyj`.

For Stripe, set `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET` in your local env.

Use `db/schema.sql` in Supabase to create the `proposals` table and RLS policies.