import { buildSystemPrompt, buildUserMessage } from "@/lib/prompts";
import { answerBookkeepingQuestion } from "@/lib/openai";
import {
  type BusinessProfile,
  getProfileByNormalizedPhoneFromDb,
  normalizePhoneFromTwilio,
} from "@/lib/profiles";
import {
  getTwilioWebhookUrl,
  parseTwilioFormBody,
  twimlMessageResponse,
  validateTwilioSignatureOrThrow,
} from "@/lib/twilio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GENERIC_ERROR_REPLY =
  "Sorry — something went wrong processing your message. Please try again in a moment.";

const UNREGISTERED_REPLY =
  "This number is not registered for Maverick. Contact the owner to add your WhatsApp number to the allowed profiles.";
const PROFILE_URL = "http://www.ivoweevers.com";

function withProfileFooter(message: string, profileName: string): string {
  const footer = `Your profile: ${profileName} (${PROFILE_URL})`;
  return `${message.trim()}\n\n${footer}`;
}

export async function POST(request: Request): Promise<Response> {
  const authToken = process.env.TWILIO_AUTH_TOKEN ?? "";
  const skipSignature = process.env.SKIP_TWILIO_SIGNATURE === "1";

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return twimlMessageResponse(GENERIC_ERROR_REPLY);
  }

  const params = parseTwilioFormBody(rawBody);
  const signature = request.headers.get("x-twilio-signature");

  if (authToken && !skipSignature) {
    try {
      const url = getTwilioWebhookUrl(request);
      validateTwilioSignatureOrThrow(authToken, signature, url, params);
    } catch {
      return new Response("Forbidden", { status: 403 });
    }
  } else if (!skipSignature && !authToken) {
    console.warn(
      "[maverick] TWILIO_AUTH_TOKEN not set; accepting webhook without signature check (dev only — set token before production)"
    );
  }

  const fromRaw = params.From;
  const body = params.Body ?? "";
  const normalized = normalizePhoneFromTwilio(fromRaw);

  if (process.env.NODE_ENV !== "production") {
    console.info("[maverick] webhook", {
      from: fromRaw,
      normalized,
      bodyPreview: body.slice(0, 120),
    });
  }

  let profile: BusinessProfile | null;
  try {
    profile = await getProfileByNormalizedPhoneFromDb(normalized);
  } catch (err) {
    console.error("[maverick] profile database error", err);
    return twimlMessageResponse(GENERIC_ERROR_REPLY);
  }
  if (!profile) {
    return twimlMessageResponse(UNREGISTERED_REPLY);
  }

  const systemPrompt = buildSystemPrompt(profile);
  const userMessage = buildUserMessage(body);

  try {
    const answer = await answerBookkeepingQuestion(systemPrompt, userMessage);
    return twimlMessageResponse(withProfileFooter(answer, profile.name));
  } catch (err) {
    console.error("[maverick] OpenAI error", err);
    return twimlMessageResponse(GENERIC_ERROR_REPLY);
  }
}

export function GET(): Response {
  return new Response("Maverick webhook: POST Twilio WhatsApp callbacks to this URL.", {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
