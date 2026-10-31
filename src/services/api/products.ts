import { cmsClient } from "./client";
import { cmsLocale, withSiteFilter } from "./config";
import { cached, cmsFailure } from "./runtime";
import type { Product, CMSProductsResponse, CMSProductRaw } from "./types";

const DEFAULT_PRODUCT_COLOR = "#E30613";

function normalizeNutrition(nutrition: CMSProductRaw["nutrition"]) {
  if (!nutrition || typeof nutrition !== "object") return undefined;
  const rows = Array.isArray(nutrition.rows) ? nutrition.rows.filter((row: any) => row?.label || row?.value) : [];
  const hasContent = rows.length > 0 || Boolean(nutrition.title || nutrition.serving || nutrition.disclaimer);
  return hasContent ? { ...nutrition, rows } : undefined;
}

function mapProduct(item: CMSProductRaw): Product {
  const image = typeof item.image === "string" ? item.image : item.image?.url || "";
  const backgroundColor = item.backgroundColor || DEFAULT_PRODUCT_COLOR;
  const headerTextColor = item.headerTextColor || "#FFFFFF";
  const textColor = item.textColor || backgroundColor;
  const colorButton = item.colorButton || backgroundColor;
  const slug = item.slug || item.id;
  const isNew = item.isNew === true;

  return {
    id: slug,
    cmsId: item.id,
    slug,
    name: item.name,
    category: item.category || "",
    image,
    imageMobile: item.imageMobile || image,
    description: item.description || "",
    short_description: item.description || "",
    available: item.available || "",
    background_image: item.backgroundImage || "",
    background_color: backgroundColor,
    backgroundColor,
    background_product: backgroundColor,
    header_background: backgroundColor,
    header_color: headerTextColor,
    header_text_color: headerTextColor,
    headerTextColor,
    text_color: textColor,
    textColor,
    color_button: colorButton,
    colorButton,
    weight: Array.isArray(item.weight) ? item.weight : [],
    sizes: Array.isArray(item.sizes) ? item.sizes : [],
    nutrition: normalizeNutrition(item.nutrition),
    brandId: item.brandId,
    new: isNew,
    isNew,
    isnew: isNew,
  };
}

export function getAllProducts(locale: string = "es"): Promise<Product[]> {
  const language = cmsLocale(locale);
  return cached(`products:${language}`, async () => {
    try {
      const response = await cmsClient.get<CMSProductsResponse>(
        "v1/products",
        withSiteFilter({ page: 1, pageSize: 100, languageCode: language })
      );
      return (response.data ?? []).map(mapProduct);
    } catch (error) {
      return cmsFailure("products", error, []);
    }
  });
}

export async function getProductBySlug(slug: string, locale: string = "es"): Promise<Product | null> {
  const products = await getAllProducts(locale);
  return products.find((product) => product.slug === slug || product.id === slug || product.cmsId === slug) || null;
}
