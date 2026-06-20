import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { createContactSchema } from "@/lib/contact-schema";

export async function POST(request: Request) {
  // 1. Parse JSON body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    const t = await getTranslations({ locale: routing.defaultLocale, namespace: "contactForm" });
    return Response.json({ error: t("formError.invalidRequest") }, { status: 400 });
  }

  // Resolve the visitor's locale (sent by the client) for localized responses.
  const sentLocale = (body as { locale?: unknown })?.locale;
  const locale = hasLocale(routing.locales, sentLocale) ? sentLocale : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "contactForm" });

  // 2. Validate via shared schema with localized messages
  const result = createContactSchema((key) => t(`errors.${key}`)).safeParse(body);
  if (!result.success) {
    return Response.json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const { name, email, phone, message, website } = result.data;

  // 3. Honeypot check — non-empty website field = bot; pretend success
  if (website && website.trim().length > 0) {
    return Response.json({ ok: true });
  }

  // 4. Read env variables inside the handler (build-safe, no top-level side effects)
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "ahoj@example.cz";
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "web@example.cz";

  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set.");
    return Response.json({ error: t("formError.unavailable") }, { status: 500 });
  }

  // 5. Send via Resend — instantiate inside handler so build works without the key
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  // Owner notification email — kept in English (read by the site owner).
  const html = `
    <p><strong>Name:</strong> ${escHtml(name)}</p>
    <p><strong>Email:</strong> ${escHtml(email)}</p>
    <p><strong>Phone:</strong> ${escHtml(phone ?? "—")}</p>
    <hr />
    <p><strong>Message:</strong></p>
    <p>${escHtml(message).replace(/\n/g, "<br />")}</p>
  `;

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone ?? "—"}`,
    "",
    `Message:\n${message}`,
  ].join("\n");

  try {
    // Resend SDK resolves (not throws) on API-level errors — always check the returned error.
    const { error: sendError } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `New enquiry from the website — ${name}`,
      html,
      text,
    });

    if (sendError) {
      console.error("[contact] Resend returned an error:", sendError.message, sendError.name);
      return Response.json({ error: t("formError.sendFailed") }, { status: 500 });
    }
  } catch (err) {
    // Network-level failures (connection refused, timeout, …)
    console.error(
      "[contact] Network error calling Resend:",
      err instanceof Error ? err.message : "unknown error",
    );
    return Response.json({ error: t("formError.sendFailed") }, { status: 500 });
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
