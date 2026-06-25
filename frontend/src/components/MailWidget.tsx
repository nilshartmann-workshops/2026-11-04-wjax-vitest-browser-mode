import { useState } from "react";

const BACKEND_URL = "http://localhost:7400";

export function MailWidget() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || pending) return;
    setPending(true);
    await fetch(`${BACKEND_URL}/api/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setPending(false);
    setSuccess(true);
  }

  return (
    <div className="mail-widget-bar">
      <div className="mail-widget-inner">
        {success ? (
          <span className="mail-widget-success">
            ✓ Angemeldet! Du erhältst bald neue Gesuche per Mail.
          </span>
        ) : (
          <form className="mail-widget-form" onSubmit={handleSubmit}>
            <span className="mail-widget-label">📧 Neue Gesuche per Mail:</span>
            <input
              className="mail-widget-input"
              type="text"
              placeholder="deine@email.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="mail-widget-btn"
              type="submit"
              disabled={!email || pending}
            >
              {pending ? "…" : "Abonnieren"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
