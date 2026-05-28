# Database

Maverick uses [Supabase](https://supabase.com) (Postgres) as the system of record for **user business profiles** keyed by WhatsApp numbers in E.164 format.

## Access model (v1)

- The Next.js **webhook** route loads profiles with the **service role** key via [`src/lib/supabaseAdmin.ts`](../../src/lib/supabaseAdmin.ts).
- **Row Level Security (RLS)** is enabled on `public.user_profiles`. There are **no** policies granting `anon` or `authenticated` access, so the table is not exposed to anonymous clients. The service role **bypasses RLS** for server-side reads (and future writes).
- **Grants are explicit** in the migration: `anon` and `authenticated` have `all` privileges revoked; `service_role` is granted `select, insert, update, delete`. This makes the migration portable to fresh Supabase projects after the May 30, 2026 default-grant change ([supabase/discussions/45329](https://github.com/orgs/supabase/discussions/45329)).
- Do **not** prefix `SUPABASE_SERVICE_ROLE_KEY` with `NEXT_PUBLIC_` or import `getSupabaseAdmin` from client components.

## Environment variables

Documented in [`.env.local.example`](../../.env.local.example):

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Project URL (Settings → API) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role secret (server only) |

Set the same variables on **Vercel** (or your host) for Production and Preview as needed, then redeploy.

## Schema: `public.user_profiles`

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `whatsapp_e164` | `text` | Unique, **not null**; must match Twilio `From` after [`normalizePhoneFromTwilio`](../../src/lib/profiles.ts) (`+` prefix) |
| `name` | `text` | Display / prompt name |
| `country` | `text` | Country context |
| `tax_regime` | `text` | Tax regime label |
| `business_type` | `text` | Business type |
| `city` | `text` | City |
| `accountant_status` | `text` | Accountant relationship |
| `notes` | `text` | Free-form notes (default `''`) |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Default `now()` |

Application type mapping: `whatsapp_e164` maps to `BusinessProfile.phone` for prompts ([`rowToBusinessProfile`](../../src/lib/profiles.ts)).

## Migrations and seeding

1. Create a Supabase project (dashboard), then open **SQL Editor**.
2. Run the migration in [`supabase/migrations/20260202120000_user_profiles.sql`](../../supabase/migrations/20260202120000_user_profiles.sql) (or use [Supabase CLI](https://supabase.com/docs/guides/cli) `supabase db push` / linked project).
3. Insert at least one row for your WhatsApp number. Copy/adapt [`supabase/seed.example.sql`](../../supabase/seed.example.sql) and replace placeholders with your real E.164 and fields.

Until a row exists for a given number, the webhook returns the “not registered” Twilio message.

## Future direction

- **Multi-country profiles:** add `country_code` and/or child tables for country-specific fields before widening the flat schema.
- **Supabase Auth:** link `user_profiles` to `auth.users` and add RLS policies per user when you add a browser UI.
