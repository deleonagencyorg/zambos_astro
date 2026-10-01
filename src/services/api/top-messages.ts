import { cmsClient } from './client';
import { cmsConfig, cmsLocale } from './config';
import { cached, cmsFailure } from './runtime';

export interface TopMessage {
  id: string;
  title: string;
  link: string;
  order: number;
}

interface TopMessageListResponse {
  data: Array<Partial<TopMessage>>;
}

interface BrandListResponse {
  data: Array<{ id: string; slug: string }>;
}

export function getTopMessages(locale: string = 'es'): Promise<TopMessage[]> {
  const language = cmsLocale(locale);
  return cached(`top-messages:${language}`, async () => {
    try {
      const brands = await cmsClient.get<BrandListResponse>('v1/brands', { page: 1, pageSize: 100 });
      const brand = (brands.data ?? []).find((item) => item.slug === cmsConfig.brandSlug);
      if (!brand) return [];
      const response = await cmsClient.get<TopMessageListResponse>('v1/top-messages', {
        languageCode: language,
        brandId: brand.id,
      });
      return (response.data ?? [])
        .filter((item) => item.title?.trim())
        .map((item, index) => ({
          id: item.id || `message-${index}`,
          title: (item.title || '').trim(),
          link: item.link?.trim() || '',
          order: item.order ?? index,
        }))
        .sort((a, b) => a.order - b.order);
    } catch (error) {
      return cmsFailure('top-messages', error, []);
    }
  });
}
