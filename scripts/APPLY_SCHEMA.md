# Applying the DB schema to Supabase

Options to apply `db/schema.sql` into your Supabase project.

1) Quick/manual (recommended)
   - Open your Supabase project dashboard → SQL Editor → New Query.
   - Copy the contents of `db/schema.sql` and paste into the editor.
   - Run the query. This creates the `proposals` table and RLS policies.

2) Using the Supabase CLI (local)
   - Install the Supabase CLI: https://supabase.com/docs/guides/cli
   - Authenticate the CLI (`supabase login`) with your account.
   - Set the project ref (your project id is `rxtkxhsescjziyhyieyj`).
   - Run the SQL file:

```powershell
supabase --project-ref rxtkxhsescjziyhyieyj db query db/schema.sql
```

3) Using psql (if you have DB connection string)
   - Get the Postgres connection string from Supabase (Settings → Database → Connection string).
   - Run:

```powershell
psql "postgresql://<db_user>:<db_pass>@<host>:5432/postgres?sslmode=require" -f db/schema.sql
```

Notes
- The SQL file creates RLS policies that expect authenticated users to have `auth.uid()` matching `user_id`.
- If you prefer, I can attempt to run the SQL automatically from this workspace using the service role key present in `.env.local`. To do that I need your explicit confirmation.
