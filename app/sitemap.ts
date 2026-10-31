import { MetadataRoute } from "next";
import { SERVICIOS, SITE } from "./servicios/data";
import { GUIAS } from "./guias/data";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...SERVICIOS.map((s) => ({
      url: `${SITE}/servicios/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${SITE}/guias`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...GUIAS.map((g) => ({
      url: `${SITE}/guias/${g.slug}`,
      lastModified: new Date(g.fecha),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
