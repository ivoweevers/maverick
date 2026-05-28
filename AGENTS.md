<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:supabase-grants-rule -->
# Supabase: explicit grants in every migration

Every migration that creates a table in the `public` schema must include explicit `grant` / `revoke` statements alongside `create table`, `enable row level security`, and any policies. Do **not** rely on Supabase's default grants — they are being removed (new projects from May 30, 2026; all projects from October 30, 2026 — see [supabase/discussions/45329](https://github.com/orgs/supabase/discussions/45329)).

Default posture for Maverick: server-only access via `service_role`. Unless a feature explicitly needs browser access, every new table should follow this pattern:

```sql
create table public.your_table ( ... );
alter table public.your_table enable row level security;

revoke all on table public.your_table from anon, authenticated;
grant select, insert, update, delete on table public.your_table to service_role;
```

If a table is meant to be reachable from the browser, grant the narrowest possible privileges to `anon` / `authenticated` and pair them with explicit RLS policies in the same migration.
<!-- END:supabase-grants-rule -->
