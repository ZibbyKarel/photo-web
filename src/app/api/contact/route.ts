import { contactSchema } from "@/lib/contact-schema";

export async function POST(request: Request) {
  // 1. Parse JSON body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Neplatný požadavek." }, { status: 400 });
  }

  // 2. Validate via shared schema
  const result = contactSchema.safeParse(body);
  if (!result.success) {
    return Response.json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const { name, email, phone, type, message, website } = result.data;

  // 3. Honeypot check — non-empty website field = bot; pretend success
  if (website && website.trim().length > 0) {
    return Response.json({ ok: true });
  }

  // 4. Read env variables inside the handler (build-safe, no top-level side effects)
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "ahoj@example.cz";
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "web@example.cz";

  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY není nastaven.");
    return Response.json(
      { error: "Formulář teď nelze odeslat. Napište prosím přímo na e-mail." },
      { status: 500 },
    );
  }

  // 5. Send via Resend — instantiate inside handler so build works without the key
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const typeLabels: Record<string, string> = {
    rodina: "Rodinné focení",
    svatba: "Svatba",
    udalost: "Událost / oslava",
    dron: "Focení z dronu",
    jine: "Jiné",
  };
  const typeLabel = type ? (typeLabels[type] ?? type) : "—";

  const html = `
    <p><strong>Jméno:</strong> ${escHtml(name)}</p>
    <p><strong>E-mail:</strong> ${escHtml(email)}</p>
    <p><strong>Telefon:</strong> ${escHtml(phone ?? "—")}</p>
    <p><strong>Typ focení:</strong> ${escHtml(typeLabel)}</p>
    <hr />
    <p><strong>Zpráva:</strong></p>
    <p>${escHtml(message).replace(/\n/g, "<br />")}</p>
  `;

  const text = [
    `Jméno: ${name}`,
    `E-mail: ${email}`,
    `Telefon: ${phone ?? "—"}`,
    `Typ focení: ${typeLabel}`,
    "",
    `Zpráva:\n${message}`,
  ].join("\n");

  try {
    // Resend SDK resolves (not throws) on API-level errors — always check the returned error.
    const { error: sendError } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `Nová poptávka z webu — ${name}`,
      html,
      text,
    });

    if (sendError) {
      console.error("[contact] Resend vrátil chybu:", sendError.message, sendError.name);
      return Response.json(
        { error: "E-mail se nepodařilo odeslat. Napište prosím přímo na e-mail." },
        { status: 500 },
      );
    }
  } catch (err) {
    // Network-level failures (connection refused, timeout, …)
    console.error(
      "[contact] Síťová chyba při volání Resend:",
      err instanceof Error ? err.message : "neznámá chyba",
    );
    return Response.json(
      { error: "E-mail se nepodařilo odeslat. Napište prosím přímo na e-mail." },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}

/** Escape HTML special chars to prevent injection in the e-mail body. */
function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
