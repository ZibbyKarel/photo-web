# photo-web

Statický portfolio web pro fotografa (Plzeň a okolí). Next.js 16 (App Router) ve statickém
exportu (`output: "export"` → složka `out/`), nasazený na **GitHub Pages** přes workflow
`.github/workflows/nextjs.yml` (build běží automaticky po pushi do `main`).

## Skripty

```bash
npm install          # první instalace závislostí

npm run dev          # vývojový server – http://localhost:3000
npm run build        # produkční statický build do out/
npm run gallery      # zpracuje fotky galerie + vygeneruje manifest (viz níže)

npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run format       # Prettier (zápis)
```

Před nasazením má projít „zeleně": `npm run lint && npm run typecheck && npm run build`.

### Fotky do galerie

Vlož `.jpg/.jpeg/.png` do `gallery-source/<kategorie>/` (kategorie: `family`,
`weddings-events`, `drone`, `other`) a spusť `npm run gallery`. Skript fotky zmenší, uloží do
`public/gallery/<kategorie>/`, vytvoří blur placeholdery a přepíše `src/lib/gallery.generated.ts`.

### Kontaktní formulář

Formulář odesílá přímo z prohlížeče přes [Web3Forms](https://web3forms.com) (statický web nemá
server). Klíč `NEXT_PUBLIC_WEB3FORMS_KEY` je lokálně v `.env`, pro CI je nastavený přímo
ve workflow. Je veřejný (inlinuje se do bundlu), takže to není tajemství.

## Změna domény / adresy, kde web běží

Web teď běží na `https://kzphoto.cz/`. URL adresa se skládá ze dvou částí,
které je při změně potřeba upravit **obě**:

| Co změnit | Kde | Hodnota |
| --- | --- | --- |
| Plná adresa webu (canonical, sitemap, OG) | `src/lib/site.ts` → `url` | celá URL bez koncového lomítka |
| Pod-cesta, pod kterou Pages servíruje | `.github/workflows/nextjs.yml` → `NEXT_PUBLIC_BASE_PATH` | viz scénáře níže |

**Scénář A — jiný název repozitáře (zůstává na github.io):**

```
src/lib/site.ts        url: "https://zibbykarel.github.io/<novy-repo>"
nextjs.yml             NEXT_PUBLIC_BASE_PATH: /<novy-repo>
```

**Scénář B — vlastní doména v kořeni (např. `https://fotograf.cz`):**

```
src/lib/site.ts        url: "https://fotograf.cz"
nextjs.yml             NEXT_PUBLIC_BASE_PATH: ""        # bez pod-cesty
```

Navíc u vlastní domény nastav doménu v **Settings → Pages → Custom domain** (vytvoří `CNAME`)
nebo přidej soubor `public/CNAME` s obsahem `fotograf.cz`.

> `NEXT_PUBLIC_BASE_PATH` se používá na dvou místech: jako `basePath` v `next.config.ts`
> (prefix všech cest a assetů) a v kořenovém přesměrování `src/app/(root)/page.tsx`. Stačí
> ho měnit jen ve workflow — obě místa si ho čtou ze stejné proměnné. Po úpravě commitni a
> pushni do `main`; deploy proběhne sám.
