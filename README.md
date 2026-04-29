# Maverick

Minimal **WhatsApp → LLM → WhatsApp** bookkeeping assistant MVP: Twilio inbound webhook, hardcoded business profile, OpenAI reply via TwiML.

## Quick start (local)

1. Copy environment template and fill secrets:

   ```bash
   cp .env.local.example .env.local
   ```

2. Edit [src/lib/profiles.ts](src/lib/profiles.ts): replace the sample `+31600000000` key and profile fields with **your** WhatsApp number in E.164 (same format as Twilio `From` after removing the `whatsapp:` prefix).

3. Install and run:

   ```bash
   npm install
   npm run dev
   ```

4. Health check: `GET http://localhost:3000/api/health`

5. Expose `/api/webhook` with **ngrok** (or similar) and set Twilio WhatsApp sandbox “When a message comes in” to `https://YOUR_NGROKOK_HOST/api/webhook` (POST).

6. For quick local tests without signature validation, set `SKIP_TWILIO_SIGNATURE=1` in `.env.local`. **Do not use this in production.**

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `TWILIO_AUTH_TOKEN` | Yes (prod) | Validates `X-Twilio-Signature` on inbound webhooks |
| `TWILIO_WEBHOOK_BASE_URL` | No | e.g. `https://your-app.vercel.app` if signature validation fails because `request.url` does not match Twilio’s callback URL |
| `SKIP_TWILIO_SIGNATURE` | No | Set to `1` **only** for local debugging — disables signature check |
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `OPENAI_MODEL` | No | Defaults to `gpt-4o-mini` |

Never commit `.env.local` or real secrets.

## Deploy (Vercel + GitHub)

1. Push this repo to GitHub (replace `YOUR_USER`):

   ```bash
   git remote add origin git@github.com:YOUR_USER/maverick.git
   git push -u origin main
   ```

2. In Vercel: **Add New Project** → import the repo → deploy.

3. **Settings → Environment Variables**: add `TWILIO_AUTH_TOKEN`, `OPENAI_API_KEY`, optional `TWILIO_WEBHOOK_BASE_URL` (= `https://<your-production-host>` with no trailing slash) and `OPENAI_MODEL` if desired.

4. Redeploy after saving env vars.

5. In Twilio Console (WhatsApp Sandbox or approved sender): set webhook to:

   `https://<your-production-domain>/api/webhook`

## Twilio webhook setup

- Method: **HTTP POST**
- URL: `https://YOUR_DOMAIN/api/webhook`
- Twilio sends `application/x-www-form-urlencoded` bodies; the handler reads the raw body for signature validation, then parses `From` and `Body`.

## Debugging checklist

| Symptom | What to check |
|--------|----------------|
| **403 Forbidden** | Wrong `TWILIO_AUTH_TOKEN`; signature URL mismatch — set `TWILIO_WEBHOOK_BASE_URL` to your exact public base; no trailing slash on base env (code appends `/api/webhook`). |
| **200 but no WhatsApp reply** | Response must be TwiML XML with `Content-Type: text/xml`. Check Twilio Debugger for parse errors. |
| **Empty `Body`** | Confirm you parse urlencoded body, not JSON. |
| **Always “not registered”** | Phone key in `profiles.ts` must match normalized E.164 (see logs in dev). Twilio sends `whatsapp:+31...`. |
| **Generic error reply** | Vercel logs for `[maverick] OpenAI error`; verify `OPENAI_API_KEY` and model name on Vercel. |

## Project layout

- `src/app/api/webhook/route.ts` — Twilio POST, profile match, OpenAI, TwiML reply
- `src/app/api/health/route.ts` — liveness JSON
- `src/lib/twilio.ts` — body parse, signature check, TwiML helpers
- `src/lib/profiles.ts` — hardcoded profile map (replace with Supabase later)
- `src/lib/prompts.ts` — system prompt builder
- `src/lib/openai.ts` — OpenAI chat call

## Next improvements (after the loop is stable)

- **Supabase**: `profiles` by `phone_e164`, optional `message_logs` and conversation memory.
- **Feedback**: detect 👍 / 👎 follow-ups in webhook handler.
- **Grounding**: retrieve snippets from your own knowledge base before the LLM call.
- **Claude**: add a thin provider interface next to OpenAI.

## Learn more

- [Twilio TwiML for WhatsApp](https://www.twilio.com/docs/messaging/twiml)
- [Twilio request validation](https://www.twilio.com/docs/usage/webhooks/webhooks-security)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
