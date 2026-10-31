import { cmsClient } from './client';
import { cmsLocale, withSiteFilter } from './config';
import { mediaUrl, type CmsMultimedia } from './multimedia';
import { cached, cmsFailure } from './runtime';

interface CmsProductCategory {
  key: string;
  label: string;
  slug: string;
  backgroundColor: string;
  order: number;
  icon?: CmsMultimedia | null;
}

interface ProductCategoryListResponse {
  data: CmsProductCategory[];
}

export interface ProductCategory {
  key: string;
  label: string;
  slug: string;
  backgroundColor: string;
  iconUrl: string;
}

export function getProductCategories(locale: string = 'es'): Promise<ProductCategory[]> {
  const language = cmsLocale(locale);
  return cached(`product-categories:${language}`, async () => {
    try {
      const response = await cmsClient.get<ProductCategoryListResponse>(
        'v1/product-categories',
        withSiteFilter({ page: 1, pageSize: 100, languageCode: language })
      );
      return (response.data ?? [])
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((item) => ({
          key: item.key,
          label: item.label || item.key,
          slug: item.slug || item.key,
          backgroundColor: item.backgroundColor || '',
          iconUrl: mediaUrl(item.icon),
        }));
    } catch (error) {
      return cmsFailure('product-categories', error, []);
    }
  });
}
