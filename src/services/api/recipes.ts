import { cmsClient } from "./client";
import { cmsLocale, withSiteFilter } from "./config";
import { cached, cmsFailure } from "./runtime";
import type { Recipe, CMSRecipesResponse, CMSRecipeRaw } from "./types";

function mapRecipe(item: CMSRecipeRaw): Recipe {
  const image = typeof item.image === "string" ? item.image : item.image?.url || "";
  const slug = item.slug || item.id;
  const isNew = item.isNew === true;

  return {
    id: slug,
    cmsId: item.id,
    slug,
    title: item.title,
    image,
    "preview-image": image,
    preparation_time: item.preparationTime ?? 0,
    people: item.people || "",
    difficulty: item.difficulty || "",
    ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
    instructions: Array.isArray(item.instructions) ? item.instructions : [],
    category: item.category || "",
    type: item.type || "image",
    gallery: Array.isArray(item.gallery) ? item.gallery : [],
    video: item.video || "",
    date: item.date ? item.date.slice(0, 10) : "",
    brand: (item.brands ?? []).map((brand) => brand.slug),
    products: (item.products ?? []).map((product) => product.slug),
    new: isNew,
    isNew,
  };
}

export function getAllRecipes(locale: string = "es"): Promise<Recipe[]> {
  const language = cmsLocale(locale);
  return cached(`recipes:${language}`, async () => {
    try {
      const response = await cmsClient.get<CMSRecipesResponse>(
        "v1/recipes",
        withSiteFilter({ page: 1, pageSize: 100, languageCode: language })
      );
      return (response.data ?? []).map(mapRecipe);
    } catch (error) {
      return cmsFailure("recipes", error, []);
    }
  });
}

export async function getRecipeBySlug(slug: string, locale: string = "es"): Promise<Recipe | null> {
  const recipes = await getAllRecipes(locale);
  return recipes.find((recipe) => recipe.slug === slug || recipe.id === slug || recipe.cmsId === slug) || null;
}
