import type { MenuItem } from "@/lib/types";

/** SEO: Restaurant + Menu structured data (schema.org JSON-LD). */
export function StructuredData({ items }: { items: MenuItem[] }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Zingwangwa Street Foods",
    slogan: "Good Food. Great Vibes.",
    servesCuisine: ["Street Food", "Grill", "Fast Food"],
    url: siteUrl,
    telephone: "+265891392925",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Zingwangwa Market, next to 99 Club",
      addressLocality: "Blantyre",
      addressCountry: "MW",
    },
    openingHours: "Mo-Sa 09:00-20:00",
    priceRange: "K250 – K8,000",
    hasMenu: {
      "@type": "Menu",
      hasMenuSection: items.map((i) => ({
        "@type": "MenuItem",
        name: i.name,
        description: i.description,
        offers: { "@type": "Offer", price: i.price_zmw, priceCurrency: "ZMW" },
      })),
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}
