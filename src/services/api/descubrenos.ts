import { cmsClient } from './client';
import { cmsLocale, withSiteFilter } from './config';
import { cached, cmsFailure } from './runtime';

export type DescubrenosPage = 'home' | 'products' | 'health';

export interface InstagramPost {
  id: string;
  postUrl: string;
  embedUrl: string;
  imageUrl: string;
  fallbackImage: string;
  alt: string;
  position: number;
}

interface CmsDescubrenos {
  title: string;
  showOnHome?: boolean;
  showOnProducts?: boolean;
  showOnHealth?: boolean;
  posts: Array<Partial<InstagramPost>>;
}

interface DescubrenosListResponse {
  data: CmsDescubrenos[];
}

export interface DiscoverSection {
  title: string;
  posts: InstagramPost[];
}

export function toInstagramEmbedUrl(url: string): string {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('instagram.com')) return url;
    parsed.search = '';
    parsed.hash = '';
    const path = parsed.pathname.replace(/\/+$/, '');
    if (path.endsWith('/embed')) return `${parsed.origin}${path}/`;
    return `${parsed.origin}${path}/embed/`;
  } catch {
    return url;
  }
}

function matchesPage(item: CmsDescubrenos, page: DescubrenosPage): boolean {
  if (page === 'home') return item.showOnHome !== false;
  if (page === 'products') return item.showOnProducts === true;
  return item.showOnHealth === true;
}

const emptySection: DiscoverSection = { title: '', posts: [] };

export function getDiscoverSection(locale: string = 'es', page: DescubrenosPage = 'home'): Promise<DiscoverSection> {
  const language = cmsLocale(locale);
  return cached(`descubrenos:${page}:${language}`, async () => {
    try {
      const response = await cmsClient.get<DescubrenosListResponse>(
        'v1/descubrenos',
        withSiteFilter({ page: 1, pageSize: 20, languageCode: language })
      );
      const item = (response.data ?? []).find((entry) => matchesPage(entry, page));
      if (!item) return emptySection;
      const posts = (item.posts ?? [])
        .slice()
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        .map((post, index) => ({
          id: post.id || `post-${index}`,
          postUrl: post.postUrl || '',
          embedUrl: toInstagramEmbedUrl(post.embedUrl || post.postUrl || ''),
          imageUrl: post.imageUrl || '',
          fallbackImage: post.fallbackImage || '',
          alt: post.alt || '',
          position: post.position ?? index,
        }))
        .filter((post) => post.embedUrl);
      return { title: item.title || '', posts };
    } catch (error) {
      return cmsFailure('descubrenos', error, emptySection);
    }
  });
}
