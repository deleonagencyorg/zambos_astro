import { cmsClient } from './client';
import { cmsLocale, withSiteFilter } from './config';
import { mediaUrl, type CmsMultimedia } from './multimedia';
import { cached, cmsFailure } from './runtime';

interface CmsSocialMediaLink {
  platform: string;
  name: string;
  url: string;
  alt: string;
  order: number;
  icon?: CmsMultimedia | null;
}

interface SocialMediaListResponse {
  data: CmsSocialMediaLink[];
}

export interface SocialMediaLink {
  platform: string;
  name: string;
  url: string;
  alt: string;
  iconUrl: string;
}

export function getSocialMediaLinks(locale: string = 'es'): Promise<SocialMediaLink[]> {
  const language = cmsLocale(locale);
  return cached(`social-media:${language}`, async () => {
    try {
      const response = await cmsClient.get<SocialMediaListResponse>(
        'v1/social-media',
        withSiteFilter({ page: 1, pageSize: 50, languageCode: language })
      );
      return (response.data ?? [])
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((item) => ({
          platform: (item.platform || '').toLowerCase(),
          name: item.name || item.platform,
          url: item.url || '',
          alt: item.alt || item.name || item.platform,
          iconUrl: mediaUrl(item.icon),
        }));
    } catch (error) {
      return cmsFailure('social-media', error, []);
    }
  });
}

export function socialUrl(links: SocialMediaLink[], platform: string): string {
  return links.find((link) => link.platform === platform)?.url || '';
}
