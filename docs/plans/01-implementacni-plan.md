# Implementační plán — photo-web

Portfolio + akviziční web pro začínajícího fotografa (Plzeň).
Zaměření: **rodinné focení**, **reality**, **krajinky**.

---

## Cíle projektu

1. **Primární:** získat první platící klienty (rodinné focení + reality).
2. **Sekundární:** vybudovat značku a portfolio, SEO pro „fotograf Plzeň".
3. **Charakter webu:** designově silný, fotky v hlavní roli, plynulé scroll animace.

### Měřítka úspěchu (po launchi)

- Web se načte (LCP) < 2,5 s na mobilu.
- Funkční kontaktní formulář → e-mail dorazí.
- Lighthouse: Performance ≥ 90, SEO ≥ 95, A11y ≥ 95.
- Indexace v Google na „fotograf Plzeň rodinné focení".

---

## Technologický stack (rozhodnuto)

| Vrstva      | Volba                                                          | Důvod                                   |
| ----------- | -------------------------------------------------------------- | --------------------------------------- |
| Framework   | **Next.js 15 (App Router)**                                    | SSR/SSG, skvělé SEO, `next/image`       |
| Jazyk       | **TypeScript**                                                 | Bezpečnost, autocomplete                |
| Styling     | **Tailwind CSS v4**                                            | Rychlost, konzistence, malý bundle      |
| Animace     | **GSAP + ScrollTrigger** (`@gsap/react` → `useGSAP`)           | Nástupce ScrollMagic, stabilní, výkonný |
| Fonty       | `next/font` — serif (Fraunces/Cormorant) + sans (Inter)        | Elegance + čitelnost                    |
| Formulář    | **Resend** (API route) nebo **Formspree** (free)               | Levné/zdarma, spolehlivé                |
| Obrázky     | `next/image` + statický manifest (MVP), později **Sanity CMS** | Nízké náklady na startu                 |
| Hosting     | **Vercel** (free tier)                                         | Zdarma, nativní pro Next.js             |
| Analytika   | **Vercel Analytics** nebo **Plausible**                        | Privacy-friendly                        |
| Lint/format | ESLint + Prettier                                              | Kvalita kódu                            |

> **Princip nákladů:** vše na startu zdarma. Placené služby (CMS, vlastní doména ~300 Kč/rok) až když web přivede klienty.

---

## FÁZE 0 — Setup & základy projektu ✅

### 0.1 Scaffold

- `npx create-next-app@latest` — TypeScript, Tailwind, App Router, ESLint, `src/` dir, alias `@/*`.
- Ověřit, že `npm run dev` běží.

### 0.2 Konfigurace nástrojů

- Prettier + `prettier-plugin-tailwindcss` (řadí třídy).
- `.editorconfig`, `.nvmrc` (Node LTS).
- Git: `.gitignore` (už z Nextu), první commit scaffoldu.

### 0.3 Závislosti

```
npm i gsap @gsap/react
npm i -D prettier prettier-plugin-tailwindcss
```

### 0.4 Struktura složek

```
src/
  app/
    layout.tsx          # root layout, fonty, metadata
    page.tsx            # homepage (skládá sekce)
    galerie/[kategorie]/page.tsx
    api/contact/route.ts
  components/
    sections/           # Hero, About, Gallery, Process, Pricing, Contact
    ui/                 # Button, Container, SectionTitle…
    animations/         # ScrollLine, RevealText, useGSAP wrappery
  lib/
    gallery.ts          # manifest fotek
    metadata.ts         # SEO helpery
  styles/
    globals.css
  content/
    gallery/            # fotky + manifest
public/
```

**Akceptační kritérium F0:** projekt běží, lint/format projde, prázdná homepage se zobrazí.

---

## FÁZE 1 — Design system & layout foundation ✅

### 1.1 Design tokens (Tailwind theme)

- Barvy: tmavé pozadí (`#0E0E0E`–`#141414`), off-white text, 1 akcentová barva (teplá — terakota/okrová).
- Typografie: definovat scale (display, h1–h3, body, caption).
- Spacing scale, `max-width` kontejneru (~1280px), breakpointy.

### 1.2 Fonty

- `next/font/google`: **Fraunces** (nadpisy, serif) + **Inter** (text).
- Nastavit jako CSS proměnné v `layout.tsx`.

### 1.3 Základní UI komponenty

- `Container`, `Stack`, `Section`, `Typography`, `Button` (primary/ghost), `Link`
- Globální styly: smooth scroll, výběr textu, focus-visible.

### 1.4 Layout & navigace

- **Header:** logo (jméno) + nav (Galerie, O mně, Ceník, Kontakt), sticky s blur pozadím, mobilní hamburger menu.
- **Footer:** kontakt, Instagram, copyright, odkaz na sekce.
- Responsivní od 360px výš.

**Akceptační kritérium F1:** existuje vizuální skeleton webu s headerem/footerem, tokeny a fonty fungují, vypadá to konzistentně na mobilu i desktopu.

---

## FÁZE 2 — Obsahové sekce (statické, bez animací) ✅

> Animace přijdou ve Fázi 4. Teď postavit obsah a layout.

### 2.1 Hero

- Fullscreen fotka (zatím placeholder), překryv s gradientem.
- Hlavní claim (např. „Zachytím vaše okamžiky — Plzeň a okolí") + podnadpis + CTA tlačítko (→ Kontakt).

### 2.2 O mně

- Portrét + osobní text (začínající fotograf, focení rodiny, vášeň).
- Krátké, autentické. CTA na galerii.

### 2.3 Jak to funguje (Process)

- 3 kroky: **Kontakt → Focení → Hotové fotky**.
- Každý krok: ikona/číslo + nadpis + 1–2 věty.

### 2.4 Ceník

- 3 karty: **Rodinné focení**, **Reality (byt)**, **Reality (dům) / příplatek dron**.
- Ceny dle průzkumu (start pod trhem):

| Balíček                | Cena            | Obsah                                         |
| ---------------------- | --------------- | --------------------------------------------- |
| Rodinné focení         | **od 1 800 Kč** | 1–1,5 h, online galerie, 25+ upravených fotek |
| Reality — byt do 80 m² | **od 1 500 Kč** | 20–30 fotek, dodání do 48 h                   |
| Reality — dům / větší  | **od 2 500 Kč** | + možnost dronu (příplatek)                   |

- Pozn. „Ceny pro první klienty — průběžně se upravují."

### 2.5 Testimonials

- 2–3 reference (na startu i od rodiny/přátel), s fotkou a jménem.
- Připravit jako data v manifestu, aby se snadno přidávaly.

### 2.6 FAQ

- 4–6 otázek (zpracování, exteriér/interiér, storno, oblečení, dárkový poukaz).
- Accordion komponenta (přístupná, `<details>` nebo aria).

### 2.7 Kontakt (UI)

- Formulář: jméno, e-mail, telefon, typ focení (select), zpráva.
- Vedle: přímý kontakt (e-mail, telefon, Instagram).
- Logika odeslání až ve Fázi 5.

**Akceptační kritérium F2:** celá homepage je obsahově hotová a responzivní, jen bez pohybu a bez funkčního odeslání formuláře.

---

## FÁZE 3 — Galerie ✅

### 3.1 Datový model

- `src/lib/gallery.ts` — manifest: kategorie (`rodina | reality | priroda`), pro každou fotku `src, alt, width, height, orientace`.
- Fotky v `src/content/gallery/<kategorie>/` (optimalizované, WebP/AVIF).

### 3.2 Galerie na homepage (přehled)

- Sekce se 3 kategoriemi, každá s náhledem (3–5 fotek) + odkaz na detail kategorie.

### 3.3 Stránka kategorie

- Route `galerie/[kategorie]/page.tsx` (SSG přes `generateStaticParams`).
- **Masonry / mřížka** fotek, `next/image` s `placeholder="blur"`.
- Lazy-loading, responzivní `sizes`.

### 3.4 Lightbox

- Klik na fotku → fullscreen lightbox s navigací (šipky, ESC, swipe na mobilu).
- Lehká vlastní komponenta nebo `yet-another-react-lightbox`.

### 3.5 Optimalizace obrázků (workflow)

- Skript / postup: zdrojové JPG → resize + WebP/AVIF (např. `sharp` script).
- Doporučené max šířky: 2000px (detail), 800px (náhled).

**Akceptační kritérium F3:** funkční galerie se 3 kategoriemi, detail kategorie, lightbox, rychlé načítání.

---

## FÁZE 4 — Animace (GSAP ScrollTrigger)

> Použít `useGSAP` (`@gsap/react`) a `gsap.context` pro cleanup. **Vždy** obalit `gsap.matchMedia()` pro `prefers-reduced-motion` a breakpointy.

### 4.1 Setup

- Registrovat `ScrollTrigger` plugin (client-only).
- Globální wrapper / util pro reduced-motion (animace se vypnou, obsah zůstává viditelný).

### 4.2 Signature scroll-line (hlavní efekt)

- **SVG path**, který se při scrollu „nakreslí" (`strokeDashoffset` ↔ scroll progress) a prochází vertikálně sekcemi jako podpis fotografa.
- Volná organická křivka, jemná akcentová barva.
- Scrub navázaný na scroll pozici.

### 4.3 Reveal animace sekcí

- Nadpisy: postupné odhalení (clip/translate/opacity) při vstupu do viewportu.
- Fade-up pro bloky obsahu (stagger).

### 4.4 Hero animace

- Při loadu: text reveal (mask), jemný parallax/zoom na hero fotce při scrollu.

### 4.5 Horizontální pás galerie (volitelně, efektní)

- Jedna sekce: vertikální scroll posouvá galerii horizontálně (pin + scrub) — „filmový pás".
- Fallback na mobilu: normální vertikální layout.

### 4.6 Mikro-interakce

- Hover na kartách (scale/elevace), tlačítka, plynulé přechody.

**Akceptační kritérium F4:** animace běží 60 fps, neblokují obsah, respektují reduced-motion, nerozbíjí layout na mobilu.

---

## FÁZE 5 — Kontaktní formulář (funkční)

### 5.1 Backend odeslání

- **Varianta A (doporučeno):** API route `api/contact/route.ts` + **Resend** (free 100/den), e-mail fotografovi.
- **Varianta B:** Formspree (bez backendu, free tier).

### 5.2 Validace

- Client + server: `zod` schema (jméno, e-mail formát, povinná zpráva).
- Anti-spam: honeypot pole + případně rate-limit.

### 5.3 UX stavy

- Loading, success (poděkování), error (zkuste znovu / přímý kontakt).
- Po odeslání: jasné potvrzení.

### 5.4 GDPR

- Checkbox souhlasu se zpracováním údajů + krátká věta / odkaz na zásady.

**Akceptační kritérium F5:** odeslaný formulář dorazí na e-mail, validace funguje, spam je odfiltrován, uživatel vidí potvrzení.

---

## FÁZE 6 — Content management (volitelné, po MVP)

> Cíl: aby fotograf přidával fotky a reference bez zásahu do kódu. Až když web žije.

### 6.1 Sanity CMS (free tier)

- Schémata: galerie (kategorie, fotky), reference, ceník, texty sekcí.
- Napojení přes `next-sanity`, ISR revalidace.

### 6.2 Migrace

- Přesun statického manifestu do CMS, zachovat stejný datový tvar.

**Akceptační kritérium F6:** fotograf zvládne přidat fotku/referenci sám přes Sanity Studio.

---

## FÁZE 7 — SEO, přístupnost & výkon

### 7.1 SEO

- `metadata` API: title/description per stránka, OpenGraph + Twitter cards.
- **JSON-LD `LocalBusiness`** (jméno, oblast Plzeň, služby, kontakt) — lokální SEO.
- `sitemap.ts`, `robots.ts`.
- Sémantické nadpisy, popisné `alt` u všech fotek (i kvůli SEO „fotograf Plzeň").
- (Volitelně) jednoduchý **blog** v MDX: 2–3 články → dlouhý ocas klíčových slov.

### 7.2 Přístupnost (A11y)

- Kontrast textu, focus-visible, alt texty, aria u accordionu/lightboxu/menu.
- Funkční klávesnicová navigace, `prefers-reduced-motion`.

### 7.3 Výkon

- `next/image` všude, správné `sizes`, blur placeholdery.
- Bundle audit (GSAP importovat jen co je třeba), font `display: swap`.
- Lighthouse + ověření Core Web Vitals na mobilu.

**Akceptační kritérium F7:** Lighthouse Perf ≥ 90, SEO ≥ 95, A11y ≥ 95; validní structured data.

---

## FÁZE 8 — Nasazení

### 8.1 Vercel

- Propojit GitHub repo, auto-deploy z `main`, preview z PR.
- Env proměnné (Resend API key apod.) v dashboardu.

### 8.2 Doména

- Vlastní doména (~300 Kč/rok) → DNS na Vercel, HTTPS automaticky.

### 8.3 Analytika & monitoring

- Vercel Analytics / Plausible.
- Google Search Console — odeslat sitemap, ověřit indexaci.

**Akceptační kritérium F8:** web běží na vlastní doméně přes HTTPS, deploy je automatický, analytika sbírá data.

---

## FÁZE 9 — Po launchi (průběžně)

- Sběr reálných referencí od prvních klientů → nahradit dočasné.
- 2–3 blog posty (focení v Plzni, tipy na rodinné focení) pro SEO.
- Instagram propojení / feed.
- Postupné zvyšování cen, jak roste portfolio a recenze.
- Dárkové poukazy (rodinné focení jako dárek) — sezónní akvizice.

---

## Pořadí prací (doporučená sekvence MVP)

**MVP na launch:** F0 → F1 → F2 → F3 → F5 → F7 → F8.
**Hned po:** F4 (animace — největší „wow", ale ne blocker pro funkčnost).
**Později dle potřeby:** F6 (CMS), F9 (růst).

> Doporučení: launchnout funkční web s obsahem co nejdřív (i bez plných animací), pak iterovat. Klient nepřijde kvůli SVG čáře, ale kvůli fotkám a snadnému kontaktu.

---

## Otevřené otázky k rozhodnutí před startem

1. **Jméno / branding** webu a doména — jaký název?
2. **Fotky** — kolik máš připravených na start v každé kategorii? (galerie potřebuje min. ~6–8/kategorie)
3. **Kontakt** — preferuješ Resend (vlastní e-mail) nebo Formspree (rychlejší setup)?
4. **Horizontální pás galerie** (4.5) — chceš, nebo držet vše vertikální?
5. **Blog** od začátku, nebo až ve fázi 9?
