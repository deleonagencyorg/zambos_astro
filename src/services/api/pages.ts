import { cmsClient } from './client';
import { cmsLocale, withSiteFilter } from './config';
import { mediaUrl, videoPlaybackUrl, type CmsMultimedia } from './multimedia';
import { cached, cmsFailure } from './runtime';

export const CMS_HOME_SLUGS = ['inicio', 'home', 'index'];

export interface BannerSlide {
  id?: string;
  type: 'image' | 'video';
  desktop: string;
  mobile: string;
  alt: string;
  title: string;
  subtitle: string;
  description: string;
  link: string;
}

interface CmsPageBanner {
  id?: string;
  type?: string;
  desktop?: CmsMultimedia | null;
  mobile?: CmsMultimedia | null;
  alt?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  link?: string;
  order?: number;
}

interface CmsMediaRef {
  originalUrl?: string;
  seoUrl?: string;
}

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  status?: string;
  excerpt?: string;
  content?: string;
  languageCode?: string;
  isHomepage?: boolean;
  showPageTitle?: boolean;
  featuredImage?: CmsMediaRef;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: CmsMediaRef;
  banners?: CmsPageBanner[];
}

interface CMSPagesResponse {
  data: CMSPage[];
}

function mapBanner(banner: CmsPageBanner): BannerSlide | null {
  if (banner.type === 'video') {
    const desktopVideo = videoPlaybackUrl(banner.desktop);
    const mobileVideo = videoPlaybackUrl(banner.mobile);
    if (desktopVideo || mobileVideo) {
      return {
        id: banner.id,
        type: 'video',
        desktop: desktopVideo || mobileVideo,
        mobile: mobileVideo || desktopVideo,
        alt: banner.alt || banner.title || '',
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        description: banner.description || '',
        link: banner.link || '',
      };
    }
  }

  const desktop = mediaUrl(banner.desktop);
  const mobile = mediaUrl(banner.mobile);
  if (!desktop && !mobile) return null;

  return {
    id: banner.id,
    type: 'image',
    desktop: desktop || mobile,
    mobile: mobile || desktop,
    alt: banner.alt || banner.title || '',
    title: banner.title || '',
    subtitle: banner.subtitle || '',
    description: banner.description || '',
    link: banner.link || '',
  };
}

export function getAllPages(locale: string = 'es'): Promise<CMSPage[]> {
  const language = cmsLocale(locale);
  return cached(`pages:${language}`, async () => {
    try {
      const response = await cmsClient.get<CMSPagesResponse>(
        'v1/pages',
        withSiteFilter({ page: 1, pageSize: 100, languageCode: language, status: 'published' })
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return cmsFailure('pages', error, []);
    }
  });
}

export function isHomePage(page: CMSPage): boolean {
  return page.isHomepage === true || CMS_HOME_SLUGS.includes((page.slug || '').toLowerCase());
}

export async function getPageBySlug(slug: string, locale: string = 'es'): Promise<CMSPage | null> {
  const pages = await getAllPages(locale);
  return pages.find((page) => page.slug === slug) ?? null;
}

export async function getHomePage(locale: string = 'es'): Promise<CMSPage | null> {
  const pages = await getAllPages(locale);
  return pages.find(isHomePage) ?? null;
}

export function getPageBanners(page: CMSPage | null): BannerSlide[] {
  return (page?.banners ?? [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(mapBanner)
    .filter((banner): banner is BannerSlide => banner !== null);
}

export function pageMediaUrl(media?: CmsMediaRef): string {
  return media?.seoUrl || media?.originalUrl || '';
}
