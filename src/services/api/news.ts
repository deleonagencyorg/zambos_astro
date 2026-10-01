import { cmsClient } from './client';
import { cmsLocale, withSiteFilter } from './config';
import { cached, cmsFailure } from './runtime';

export interface CmsNewsItem {
  id: string;
  title: string;
  slug?: string;
  subtitle?: string;
  image?: string;
  imageMobile?: string;
  gallery?: string[];
  content?: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  author?: string;
  publishedAt?: string | null;
  isPublished?: boolean;
  isFeatured?: boolean;
  languageCode?: string;
}

interface NewsResponse {
  data: CmsNewsItem[];
}

export function getAllNews(locale: string = 'es'): Promise<CmsNewsItem[]> {
  const language = cmsLocale(locale);
  return cached(`news:${language}`, async () => {
    try {
      const response = await cmsClient.get<NewsResponse>(
        'v1/news',
        withSiteFilter({ page: 1, pageSize: 100, languageCode: language, isPublished: true })
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return cmsFailure('news', error, []);
    }
  });
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  summary?: string;
  content?: string;
  image?: string;
  image_banner?: string;
  imageMobile?: string;
  gallery?: string[];
  category?: string;
  tags?: string[];
  author?: string;
  published_date: string;
}

export function toBlogPost(item: CmsNewsItem): BlogPost {
  const slug = item.slug || item.id;
  return {
    id: slug,
    slug,
    title: item.title,
    subtitle: item.subtitle,
    summary: item.excerpt,
    content: item.content,
    image: item.image,
    image_banner: item.image,
    imageMobile: item.imageMobile,
    gallery: item.gallery,
    category: item.category,
    tags: item.tags,
    author: item.author,
    published_date: item.publishedAt ? item.publishedAt.slice(0, 10) : '',
  };
}

export async function getBlogPosts(locale: string): Promise<BlogPost[]> {
  return (await getAllNews(locale)).map(toBlogPost);
}
