# CMS — Sanity

Fotky galerie a reference (testimonials) lze spravovat přes **Sanity Studio** bez zásahu do kódu.

## Jak to funguje (fallback)

Integrace je **additivní s fallbackem**:

- **Bez** nastavené proměnné `NEXT_PUBLIC_SANITY_PROJECT_ID` → web čte **statický obsah**
  (`src/lib/gallery.ts` + `src/lib/gallery.generated.ts` pro fotky, `src/lib/content.ts`
  pro reference). Chová se přesně jako dřív. Build i render beze změny.
- **S** nastaveným `NEXT_PUBLIC_SANITY_PROJECT_ID` → web čte **fotky a reference ze Sanity**.

Přepínač je centrální: `isSanityConfigured` v `src/sanity/env.ts`. Datová vrstva
(`getPhotosByCategory`, `getPreviewPhotos` v `src/lib/gallery.ts` a `getTestimonials`
v `src/lib/content.ts`) podle něj vybírá zdroj. Pokud je Sanity nakonfigurováno, ale
dataset je prázdný, vrací se opět statický obsah (bezpečnostní fallback).

> **Záměrně statické:** ceník a texty zůstávají v kódu (`src/lib/content.ts`). Schémata
> `pricingPackage` a `siteSettings` jsou v Sanity namodelována, ale do webu **nejsou propojena**.

## Aktivace — co musí fotograf udělat

### 1. Založit Sanity projekt (zdarma)

1. Registrace na <https://www.sanity.io> (free plán stačí).
2. Vytvořit nový projekt → poznamenat si **Project ID** a **Dataset** (obvykle `production`).
3. V nastavení projektu (API → CORS Origins) přidat:
   - `http://localhost:3000` (lokální vývoj)
   - produkční doménu webu

### 2. Nastavit proměnné prostředí

Do `.env.local` (viz `.env.example`):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=tvuj_project_id
NEXT_PUBLIC_SANITY_DATASET=production
# SANITY_API_READ_TOKEN nech prázdné — veřejné publikované čtení ho nepotřebuje.
```

`SANITY_API_READ_TOKEN` je potřeba jen pro draft/preview čtení (zde se nepoužívá).

### 3. Spustit Studio a přidat obsah

Studio běží **embedded** na route **`/studio`**:

```bash
npm run dev
# otevři http://localhost:3000/studio
```

Alternativně samostatné Studio (na `http://localhost:3333`):

```bash
npx sanity dev
```

V Studiu:

- **Fotka galerie** — nahraj obrázek, vyplň alt text, vyber kategorii
  (Rodina / Svatby / Události / Z dronu), volitelně pořadí.
- **Reference** — jméno, role/typ focení, citace, volitelně fotka a pořadí.

Po publikování se obsah projeví na webu (galerie i homepage preview čtou ze Sanity).

## Technické poznámky

- Sanity client: `src/sanity/client.ts` (`useCdn: true`, perspective `published`).
  Vytváří se jen když je nastaveno `projectId`, jinak je `null`.
- Obrázky: `src/sanity/image.ts` (`urlFor` helper). Host `cdn.sanity.io` je povolen
  v `next.config.ts` (`images.remotePatterns`).
- GROQ dotazy: `src/sanity/queries.ts`. Pro fotky se tahá `metadata.lqip` (→ blur placeholder)
  a `metadata.dimensions` (→ width/height), aby Next/Image `placeholder="blur"` fungoval.
- Schémata: `src/sanity/schemas/`.
- Konfigurace Studia: `sanity.config.ts` + `sanity.cli.ts`.
