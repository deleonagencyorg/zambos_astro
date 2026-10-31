import { cmsClient } from './client';
import { cmsLocale, withSiteFilter } from './config';
import { cached, cmsFailure } from './runtime';

interface CmsSiteText {
  key: string;
  value: string;
}

interface SiteTextsResponse {
  data: CmsSiteText[];
}

export type SiteTextMap = Record<string, string>;

export function getSiteTextMap(locale: string = 'es'): Promise<SiteTextMap> {
  const language = cmsLocale(locale);
  return cached(`site-texts:${language}`, async () => {
    try {
      const response = await cmsClient.get<SiteTextsResponse>(
        'v1/site-texts',
        withSiteFilter({ page: 1, pageSize: 500, languageCode: language })
      );
      const result: SiteTextMap = {};
      for (const item of response.data ?? []) {
        if (item.key) result[item.key] = item.value ?? '';
      }
      return result;
    } catch (error) {
      return cmsFailure('site-texts', error, {});
    }
  });
}

export function text(map: SiteTextMap, key: string, fallback: string = ''): string {
  const value = map[key];
  return value === undefined || value === null || value === '' ? fallback : value;
}
