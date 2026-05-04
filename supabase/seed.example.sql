-- Run in Supabase SQL Editor after applying migrations (or `supabase db push`).
-- Replace placeholders with your real WhatsApp number (E.164, leading +) and profile fields.

insert into public.user_profiles (
  whatsapp_e164,
  name,
  country,
  tax_regime,
  business_type,
  city,
  accountant_status,
  notes
) values (
  '+15551234567',
  'Your name',
  'Your country',
  'Your tax regime',
  'Your business type',
  'Your city',
  'Your accountant status',
  'Your notes'
);
