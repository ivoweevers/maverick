-- WhatsApp E.164–keyed business profiles. Server access via service role only (RLS on, no anon policies).

create table public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  whatsapp_e164 text not null unique,
  name text not null,
  country text not null,
  tax_regime text not null,
  business_type text not null,
  city text not null,
  accountant_status text not null,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.user_profiles is 'Maverick user business context; keyed by normalized WhatsApp E.164 (+...)';

alter table public.user_profiles enable row level security;

-- Explicit grants. Required for portability after the May 30, 2026 Supabase
-- default-grant change (https://github.com/orgs/supabase/discussions/45329).
-- Maverick accesses this table only via the server-side service role; anon
-- and authenticated must not see it.
revoke all on table public.user_profiles from anon, authenticated;
grant select, insert, update, delete on table public.user_profiles to service_role;
