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

/**
 * Keys must be E.164 with leading + (e.g. +31612345678).
 * Replace the sample entry with your real WhatsApp number (same format Twilio sends after stripping whatsapp:).
 */
const PROFILES: Record<string, BusinessProfile> = {
  "+31600000000": {
    phone: "+31600000000",
    name: "Replace With Your Name",
    country: "Netherlands",
    tax_regime: "ZZP / income tax",
    business_type: "Sole proprietor / consulting",
    city: "Amsterdam",
    accountant_status: "External accountant yearly",
    notes: "VAT registered; fiscal year = calendar year.",
  },
};

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

export function getProfileByNormalizedPhone(
  normalized: string | null
): BusinessProfile | null {
  if (!normalized) return null;
  if (PROFILES[normalized]) return PROFILES[normalized];
  return null;
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
