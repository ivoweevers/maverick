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
 * Replace the sample entry with your real WhatsApp number (same format as Twilio `From` after stripping `whatsapp:`).
 */
const PROFILES: Record<string, BusinessProfile> = {
  "+447535065178": {
    phone: "+447535065178",
    name: "Ivo",
    country: "Italy",
    tax_regime: "Forfettario",
    business_type: "Sole proprietor",
    city: "Cagliari",
    accountant_status: "External accountant yearly",
    notes: "VAT registered",
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
