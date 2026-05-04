# Funny scenarios (tax & product)

Use this file to capture **real observations and short scenarios** about tax, bookkeeping, and how people (or LLMs) behave around them. The bar is not “jokes” — it is **something interesting**: a moment that is worth **remembering later** when designing the product, writing prompts, or **explaining publicly** why a particular solution, clarification, or guardrail is needed.

Add new scenarios as dated or titled subsections so they stay easy to scan.

---

## Scenario: “Next tax date” vs filing deadline (LLM ambiguity)

**What happened:** I asked an LLM the same question in slightly different ways. In the first I asked when I have to pay taxes. In the second I asked what my next tax date is. It interpreted the second as **tax filing** (November). What I meant was the **next key tax date** in a broader sense — including filing, payment, or whatever applies — which for me was **June** for payment related to the previous year. Taken literally, the answer might have been defensible. In practice it **confused me** — it really did.

**Why it matters:** Calendar language (“next tax date”) is overloaded. Without jurisdiction and intent (payment vs filing vs instalment), models (and products) can pick a plausible interpretation that is **technically arguable** but **wrong for the user’s mental model**. Maverick-style UX may need explicit disambiguation, follow-up questions, or structured “next obligations” rather than a single date line.
