import { site } from "@/lib/site";

/**
 * JSON-LD structured data for LocalBusiness / ProfessionalService.
 * ProfessionalService is a sub-type of LocalBusiness and the appropriate
 * schema.org type for a photographer offering paid services.
 * Rendered as a <script> in <body> (inside root layout).
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    description: site.description,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    image: `${site.url}/opengraph-image`,
    priceRange: "$$",
    areaServed: [
      {
        "@type": "City",
        name: "Plzeň",
      },
      {
        "@type": "AdministrativeArea",
        name: "Plzeňský kraj",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Plzeň",
      addressCountry: "CZ",
    },
    sameAs: [site.instagram],
    knowsAbout: [
      "Rodinné focení",
      "Svatební fotografie",
      "Focení událostí",
      "Letecká fotografie z dronu",
    ],
    makesOffer: [
      {
        "@type": "Offer",
        name: "Rodinné focení",
        description:
          "Uvolněné focení rodiny doma nebo venku. Přirozené světlo, spontánní okamžiky. Dodání online galerie do 10 dnů.",
        priceCurrency: "CZK",
        price: "1800",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "CZK",
          minPrice: "1800",
        },
        areaServed: {
          "@type": "City",
          name: "Plzeň",
        },
      },
      {
        "@type": "Offer",
        name: "Svatba",
        description:
          "Reportáž z celého svatebního dne. 6–8 hodin focení, 300+ upravených fotek, online galerie ke stažení.",
        priceCurrency: "CZK",
        price: "8900",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "CZK",
          minPrice: "8900",
        },
        areaServed: {
          "@type": "City",
          name: "Plzeň",
        },
      },
      {
        "@type": "Offer",
        name: "Události",
        description:
          "Focení oslav, křtin, firemních i společenských akcí. Reportážní styl, dodání do 10 dnů.",
        priceCurrency: "CZK",
        price: "1500",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "CZK",
          minPrice: "1500",
        },
        areaServed: {
          "@type": "City",
          name: "Plzeň",
        },
      },
      {
        "@type": "Offer",
        name: "Z dronu",
        description:
          "Letecké snímky z dronu — samostatně nebo jako doplněk k focení. Dle počasí a lokality.",
        priceCurrency: "CZK",
        price: "1500",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "CZK",
          minPrice: "1500",
        },
        areaServed: {
          "@type": "City",
          name: "Plzeň",
        },
      },
    ],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
