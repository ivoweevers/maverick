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
