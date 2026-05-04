import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export type BusinessProfile = {
  phone: string;
  name: string;
  country: string;
  tax_regime: string;
  business_type: string;
  city: string;
  accountant_status: string;
  notes: string;
};

/** Row shape for `public.user_profiles` (Supabase). */
export type UserProfileRow = {
  id: string;
  whatsapp_e164: string;
  name: string;
  country: string;
  tax_regime: string;
  business_type: string;
  city: string;
  accountant_status: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export function rowToBusinessProfile(row: UserProfileRow): BusinessProfile {
  return {
    phone: row.whatsapp_e164,
    name: row.name,
    country: row.country,
    tax_regime: row.tax_regime,
    business_type: row.business_type,
    city: row.city,
    accountant_status: row.accountant_status,
    notes: row.notes,
  };
}

/**
 * Twilio WhatsApp From looks like whatsapp:+31612345678
 */
export function normalizePhoneFromTwilio(from: string | undefined): string | null {
  if (!from || typeof from !== "string") return null;
  let s = from.trim();
  const lower = s.toLowerCase();
  if (lower.startsWith("whatsapp:")) {
    s = s.slice("whatsapp:".length).trim();
  }
  if (!s.startsWith("+")) {
    s = `+${s}`;
  }
  return s;
}

/**
 * Load business profile for a normalized E.164 WhatsApp number from Supabase.
 */
export async function getProfileByNormalizedPhoneFromDb(
  normalized: string | null
): Promise<BusinessProfile | null> {
  if (!normalized) return null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("user_profiles")
    .select(
      "id, whatsapp_e164, name, country, tax_regime, business_type, city, accountant_status, notes, created_at, updated_at"
    )
    .eq("whatsapp_e164", normalized)
    .maybeSingle();

  if (error) {
    console.error("[maverick] user_profiles lookup failed", error.message);
    throw new Error("Database error loading profile");
  }
  if (!data) return null;
  return rowToBusinessProfile(data as UserProfileRow);
}

export function formatProfileForPrompt(profile: BusinessProfile): string {
  return [
    `Name: ${profile.name}`,
    `Phone: ${profile.phone}`,
    `Country: ${profile.country}`,
    `City: ${profile.city}`,
    `Tax regime: ${profile.tax_regime}`,
    `Business type: ${profile.business_type}`,
    `Accountant status: ${profile.accountant_status}`,
    `Notes: ${profile.notes}`,
  ].join("\n");
}
