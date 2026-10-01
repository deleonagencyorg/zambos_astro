// src/services/api/zambos-truck.ts
import { cmsClient } from './client';
import { withSiteFilter } from './config';
import { mediaUrl, videoPlaybackUrl, type CmsMultimedia } from './multimedia';

interface CmsZambosTruckPackageImage {
  id: string;
  image?: CmsMultimedia | null;
  order: number;
}

interface CmsZambosTruckStep {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
}

interface CmsZambosTruckModel {
  id: string;
  name: string;
  image?: CmsMultimedia | null;
  order: number;
}

interface CmsZambosTruckRecipe {
  id: string;
  title: string;
  description: string;
  image?: CmsMultimedia | null;
  price: string;
  order: number;
}

interface CmsZambosTruckGalleryImage {
  id: string;
  image?: CmsMultimedia | null;
  category: string;
  order: number;
}

interface CmsZambosTruckFormField {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  options: string[];
  order: number;
}

interface CmsZambosTruckConfig {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaLabel: string;
  heroCtaUrl: string;
  heroVideo?: CmsMultimedia | null;
  heroBanner?: CmsMultimedia | null;
  packagesTitle: string;
  packagesSubtitle: string;
  packageImages: CmsZambosTruckPackageImage[];
  howToTitle: string;
  howToSubtitle: string;
  howToSteps: CmsZambosTruckStep[];
  modelsTitle: string;
  models: CmsZambosTruckModel[];
  recipesTitle: string;
  recipesSubtitle: string;
  recipes: CmsZambosTruckRecipe[];
  galleryTitle: string;
  galleryImages: CmsZambosTruckGalleryImage[];
  formTitle: string;
  formDescription: string;
  formSubmitLabel: string;
  formFields: CmsZambosTruckFormField[];
  ctaJoinTitle: string;
  ctaJoinButtonLabel: string;
  ctaJoinButtonUrl: string;
  whatsappPhone: string;
  whatsappMessage: string;
}

interface ZambosTruckListResponse {
  data: CmsZambosTruckConfig[];
}

export interface ZambosTruckView {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    ctaUrl: string;
    videoUrl: string;
    bannerImage: string;
  };
  packages: {
    title: string;
    subtitle: string;
    items: string[];
  };
  howTo: {
    title: string;
    subtitle: string;
    steps: { icon: string; title: string; desc: string }[];
  };
  models: {
    title: string;
    items: { name: string; image: string }[];
  };
  recipes: {
    title: string;
    subtitle: string;
    items: { title: string; desc: string; image: string; price: string }[];
  };
  gallery: {
    title: string;
    images: { url: string; category: string }[];
  };
  form: {
    title: string;
    description: string;
    submit: string;
    fields: { name: string; label: string; type: string; required: boolean; options?: string[] }[];
  };
  ctaJoin: {
    title: string;
    button: string;
    buttonUrl: string;
  };
  whatsapp: {
    phone: string;
    message: string;
  };
}

function sortByOrder<T extends { order: number }>(items: T[] = []): T[] {
  return items.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function mapZambosTruck(config: CmsZambosTruckConfig): ZambosTruckView {
  return {
    hero: {
      title: config.heroTitle || '',
      subtitle: config.heroSubtitle || '',
      cta: config.heroCtaLabel || '',
      ctaUrl: config.heroCtaUrl || '',
      videoUrl: videoPlaybackUrl(config.heroVideo),
      bannerImage: mediaUrl(config.heroBanner),
    },
    packages: {
      title: config.packagesTitle || '',
      subtitle: config.packagesSubtitle || '',
      items: sortByOrder(config.packageImages).map((item) => mediaUrl(item.image)).filter(Boolean),
    },
    howTo: {
      title: config.howToTitle || '',
      subtitle: config.howToSubtitle || '',
      steps: sortByOrder(config.howToSteps).map((step) => ({
        icon: step.icon || '',
        title: step.title || '',
        desc: step.description || '',
      })),
    },
    models: {
      title: config.modelsTitle || '',
      items: sortByOrder(config.models).map((model) => ({
        name: model.name || '',
        image: mediaUrl(model.image),
      })),
    },
    recipes: {
      title: config.recipesTitle || '',
      subtitle: config.recipesSubtitle || '',
      items: sortByOrder(config.recipes).map((recipe) => ({
        title: recipe.title || '',
        desc: recipe.description || '',
        image: mediaUrl(recipe.image),
        price: recipe.price || '',
      })),
    },
    gallery: {
      title: config.galleryTitle || '',
      images: sortByOrder(config.galleryImages)
        .map((item) => ({ url: mediaUrl(item.image), category: item.category || '' }))
        .filter((item) => item.url),
    },
    form: {
      title: config.formTitle || '',
      description: config.formDescription || '',
      submit: config.formSubmitLabel || '',
      fields: sortByOrder(config.formFields).map((field) => ({
        name: field.name,
        label: field.label,
        type: field.type,
        required: field.required,
        options: field.options,
      })),
    },
    ctaJoin: {
      title: config.ctaJoinTitle || '',
      button: config.ctaJoinButtonLabel || '',
      buttonUrl: config.ctaJoinButtonUrl || '',
    },
    whatsapp: {
      phone: config.whatsappPhone || '',
      message: config.whatsappMessage || '',
    },
  };
}

export const emptyZambosTruck: ZambosTruckView = {
  hero: { title: '', subtitle: '', cta: '', ctaUrl: '', videoUrl: '', bannerImage: '' },
  packages: { title: '', subtitle: '', items: [] },
  howTo: { title: '', subtitle: '', steps: [] },
  models: { title: '', items: [] },
  recipes: { title: '', subtitle: '', items: [] },
  gallery: { title: '', images: [] },
  form: { title: '', description: '', submit: '', fields: [] },
  ctaJoin: { title: '', button: '', buttonUrl: '' },
  whatsapp: { phone: '', message: '' },
};

export async function getZambosTruck(locale: string = 'es'): Promise<ZambosTruckView | null> {
  try {
    // The public site uses "us" for its English route, while the CMS stores
    // the English language code as "en".
    const cmsLocale = locale === 'us' ? 'en' : locale;
    const response = await cmsClient.get<ZambosTruckListResponse>(
      'v1/zambos-truck',
      withSiteFilter({ page: 1, pageSize: 1, languageCode: cmsLocale })
    );

    const config = response.data?.[0];
    if (!config) {
      console.log(`[CMS] Sin configuracion de Zambos Truck para ${locale} (${cmsLocale})`);
      return null;
    }

    return mapZambosTruck(config);
  } catch (error) {
    console.error('[CMS] Error al obtener Zambos Truck:', error);
    return null;
  }
}
