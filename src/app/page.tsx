export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui", padding: "2rem", maxWidth: 640 }}>
      <h1>Maverick</h1>
      <p>WhatsApp bookkeeping assistant API.</p>
      <ul>
        <li>
          <code>GET /api/health</code> — liveness
        </li>
        <li>
          <code>POST /api/webhook</code> — Twilio WhatsApp inbound (TwiML reply)
        </li>
      </ul>
      <p>Configure Twilio and environment variables per the README.</p>
    </main>
  );
}
