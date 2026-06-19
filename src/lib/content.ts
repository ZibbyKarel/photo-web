/**
 * Statický obsah webu — ceník, kroky procesu, FAQ, reference.
 * Edituj zde; komponenty odtud čtou data.
 */

/* ---------------------------------------------------------------------------
   Process — Jak to funguje
--------------------------------------------------------------------------- */
export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Napište mi",
    description:
      "Domluvíme se na termínu, místě a vašich představách. Rád zodpovím všechny otázky — stačí napsat nebo zavolat.",
  },
  {
    number: "02",
    title: "Focení",
    description:
      "Přijdu s lehkým vybavením a vy se soustředíte jen na sebe. Vedu focení přirozeně — žádné nucené pózy.",
  },
  {
    number: "03",
    title: "Hotové fotky",
    description:
      "Fotky zpracuji a doručím přes online galerii. Ke stažení ve vysokém rozlišení, kdykoli a odkudkoli.",
  },
] as const;

/* ---------------------------------------------------------------------------
   Pricing — Ceník
--------------------------------------------------------------------------- */
export type PricingPackage = {
  id: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
};

export const pricingPackages: PricingPackage[] = [
  {
    id: "rodina",
    title: "Rodinné focení",
    price: "od 1 800 Kč",
    description: "Uvolněné focení rodiny doma nebo v přírodě.",
    features: ["1–1,5 hodiny focení", "Online galerie", "25+ upravených fotek", "Dodání do 10 dnů"],
    highlight: true,
  },
  {
    id: "svatba",
    title: "Svatba",
    price: "od 8 900 Kč",
    description: "Reportáž z vašeho svatebního dne.",
    features: [
      "6–8 hodin focení",
      "300+ upravených fotek",
      "Online galerie ke stažení",
      "Konzultace předem",
    ],
  },
  {
    id: "udalost",
    title: "Události",
    price: "od 1 500 Kč / hod",
    description: "Oslavy, křtiny, firemní i společenské akce.",
    features: ["Reportážní focení", "Online galerie", "Dodání do 10 dnů", "Flexibilní délka"],
  },
  {
    id: "dron",
    title: "Z dronu",
    price: "od 1 500 Kč",
    description: "Letecké snímky samostatně nebo jako příplatek k focení.",
    features: [
      "Letecké foto z dronu",
      "Samostatně či jako doplněk",
      "Dle počasí a lokality",
      "Úprava v ceně",
    ],
  },
] as const;

export const pricingNote =
  "Orientační ceny — každá zakázka je jiná. Nestandardní požadavky nebo kombinace služeb rád probereme individuálně.";

/* ---------------------------------------------------------------------------
   Testimonials — Reference
--------------------------------------------------------------------------- */
export type Testimonial = {
  id: string;
  name: string;
  role: string;
  text: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Martina K.",
    role: "Rodinné focení",
    text: "Focení probíhalo úplně přirozeně a kluci si to dokonce užívali — to by nikdo nečekal. Fotky jsou krásné, plné emocí. Moc děkujeme!",
  },
  {
    id: "t2",
    name: "Tomáš a Lucie",
    role: "Rodinné focení",
    text: "Hledali jsme někoho, kdo nepůsobí jako mašina na focení. Tady jsme to našli. Fotky dorazily rychle a jsou přesně to, co jsme si přáli.",
  },
  {
    id: "t3",
    name: "Petra a Martin",
    role: "Svatba — Plzeň",
    text: "Karel zachytil náš den přesně tak, jak jsme si přáli — přirozeně, bez zbytečného organizování. Fotky jsou plné emocí a vracíme se k nim stále znovu. Děkujeme!",
  },
] as const;

/**
 * Vrací reference.
 *
 * Fallback: pokud je nastaveno `NEXT_PUBLIC_SANITY_PROJECT_ID`, čte ze Sanity;
 * jinak vrací statická data `testimonials` jako dosud.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  const { isSanityConfigured } = await import("@/sanity/env");
  if (isSanityConfigured) {
    const { fetchTestimonials } = await import("@/sanity/data");
    const fromSanity = await fetchTestimonials();
    if (fromSanity.length > 0) return fromSanity;
  }
  return testimonials as Testimonial[];
}

/* ---------------------------------------------------------------------------
   FAQ — Nejčastější otázky
--------------------------------------------------------------------------- */
export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    id: "faq-1",
    question: "Jak dlouho trvá zpracování fotek?",
    answer:
      "U rodinného focení a akcí do 10 pracovních dnů. U svatební reportáže počítejte se 4–6 týdny — každou fotku pečlivě zpracuji. Pokud potřebujete část fotek dříve, domluvíme se předem.",
  },
  {
    id: "faq-2",
    question: "Fotíte venku i uvnitř?",
    answer:
      "Fotím obojí. Rodinné focení preferuji venku pro přirozené světlo, ale doma je to také možné. Svatební den fotím dle programu — ať je to kostel, obřadní síň nebo zahrada. Přizpůsobím se vám.",
  },
  {
    id: "faq-3",
    question: "Co si vzít na rodinné focení?",
    answer:
      "Oblečení v tlumených barvách, které vám sluší a cítíte se v něm pohodlně. Vyhněte se křiklavým vzorům a logům. Sladěné — ale ne uniformní — barvy fungují nejlépe. Zbytek nechte na mě.",
  },
  {
    id: "faq-4",
    question: "Jak funguje storno?",
    answer:
      "Focení lze přesunout bez poplatku nejpozději 48 hodin předem. V případě nepříznivého počasí termín vždy domluvíme nový. Storno do 24 hodin předem nebo nedostavení se může být zpoplatněno.",
  },
  {
    id: "faq-5",
    question: "Nabízíte dárkové poukazy?",
    answer:
      "Ano! Focení jako dárek je skvělý nápad — ať už k narozeninám, Vánocům nebo jen tak. Napište mi a připravím poukaz přesně na míru.",
  },
  {
    id: "faq-6",
    question: "Jak probíhá předání fotek?",
    answer:
      "Fotky dostanete přes soukromou online galerii — odkaz přijde e-mailem. Fotky si stáhnete ve vysokém rozlišení, galerie bude aktivní minimálně 3 měsíce.",
  },
] as const;
