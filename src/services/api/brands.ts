// src/services/api/brands.ts
import { cmsClient } from "./client";
import type { Brand, CMSBrandsResponse, CMSBrandRaw } from "./types";

function mapBrand(item: CMSBrandRaw, locale: string): Brand {
  const language = item.brandLanguages?.find((entry) => entry.code === (locale === 'us' ? 'en' : locale));
  return {
    id: item.id,
    slug: item.slug,
    name: language?.name || item.name,
    logoUrl: language?.logoUrl || item.logoUrl || item.logo_url || "",
    background: item.background,
    link: language?.link,
    caption: language?.caption,
  };
}

export async function getAllBrands(locale: string = "es"): Promise<Brand[]> {
  try {
    const cmsLocale = locale === "us" ? "en" : locale;
    const response = await cmsClient.get<CMSBrandsResponse>("v1/brands", {
      page: 1,
      pageSize: 100,
      languageCode: cmsLocale,
    });
    if (!response?.data || !Array.isArray(response.data)) {
      return [];
    }
    return response.data.map((brand) => mapBrand(brand, locale));
  } catch (error) {
    console.error("[CMS Brands] Error al obtener marcas:", error);
    return [];
  }
}
