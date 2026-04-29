import twilio from "twilio";

/**
 * Twilio sends application/x-www-form-urlencoded bodies. Parse the raw body
 * into a plain object for signature validation and field access.
 */
export function parseTwilioFormBody(rawBody: string): Record<string, string> {
  const params = new URLSearchParams(rawBody);
  const out: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    out[key] = value;
  }
  return out;
}

/**
 * Public URL Twilio POSTed to, must match what Twilio used for X-Twilio-Signature.
 * Set TWILIO_WEBHOOK_BASE_URL (e.g. https://your-app.vercel.app) if request.url
 * in serverless does not match your Twilio webhook URL.
 */
export function getTwilioWebhookUrl(request: Request): string {
  const base = process.env.TWILIO_WEBHOOK_BASE_URL?.trim();
  if (base) {
    return `${base.replace(/\/$/, "")}/api/webhook`;
  }
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}${url.pathname}`;
}

export function validateTwilioSignatureOrThrow(
  authToken: string,
  signature: string | null,
  url: string,
  params: Record<string, string>
): void {
  if (!signature) {
    throw new Error("Missing X-Twilio-Signature");
  }
  const valid = twilio.validateRequest(authToken, signature, url, params);
  if (!valid) {
    throw new Error("Invalid Twilio signature");
  }
}

/** Escape text for safe use inside a TwiML <Message> body. */
export function escapeXmlForTwiML(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function twimlMessageResponse(message: string): Response {
  const safe = escapeXmlForTwiML(message);
  const xml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${safe}</Message></Response>`;
  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}
