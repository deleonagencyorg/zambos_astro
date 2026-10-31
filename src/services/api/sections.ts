import { cmsClient } from './client';
import { cmsLocale, withSiteFilter } from './config';
import { mediaUrl, videoPlaybackUrl, type CmsMultimedia } from './multimedia';
import { cached, cmsFailure } from './runtime';

interface SectionResponse<T> {
  data: T[];
}

interface CmsFooterPhone {
  country: string;
  flag: string;
  number: string;
}

interface CmsHomeVideo {
  id: string;
  title: string;
  description: string;
  video?: CmsMultimedia | null;
  image?: CmsMultimedia | null;
}

interface CmsAboutTimelineItem {
  year: string;
  title: string;
  text: string;
  image?: CmsMultimedia | null;
  mobileImage?: CmsMultimedia | null;
}

export interface FooterPhoneView {
  country: string;
  flag: string;
  number: string;
}

export interface HomeVideoView {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  imageUrl: string;
}

export interface AboutTimelineItemView {
  year: string;
  title: string;
  text: string;
  imageUrl: string;
  mobileImageUrl: string;
}

function loadSection<T, R>(endpoint: string, locale: string, map: (item: T) => R): Promise<R[]> {
  const language = cmsLocale(locale);
  return cached(`${endpoint}:${language}`, async () => {
    try {
      const response = await cmsClient.get<SectionResponse<T>>(endpoint, withSiteFilter({ languageCode: language }));
      return (response.data ?? []).map(map);
    } catch (error) {
      return cmsFailure(endpoint, error, [] as R[]);
    }
  });
}

export function getFooterPhones(locale: string = 'es'): Promise<FooterPhoneView[]> {
  return loadSection<CmsFooterPhone, FooterPhoneView>('v1/footer-phones', locale, (item) => ({
    country: item.country || '',
    flag: item.flag || '',
    number: item.number || '',
  }));
}

export function getHomeVideos(locale: string = 'es'): Promise<HomeVideoView[]> {
  return loadSection<CmsHomeVideo, HomeVideoView>('v1/home-videos', locale, (item) => ({
    id: item.id,
    title: item.title || '',
    description: item.description || '',
    videoUrl: videoPlaybackUrl(item.video),
    imageUrl: mediaUrl(item.image),
  }));
}

export function getAboutTimeline(locale: string = 'es'): Promise<AboutTimelineItemView[]> {
  return loadSection<CmsAboutTimelineItem, AboutTimelineItemView>('v1/about-timeline', locale, (item) => ({
    year: item.year || '',
    title: item.title || '',
    text: item.text || '',
    imageUrl: mediaUrl(item.image),
    mobileImageUrl: mediaUrl(item.mobileImage) || mediaUrl(item.image),
  }));
}

interface CmsFooterLink {
  label: string;
  url: string;
}

export interface FooterLinkView {
  text: string;
  href: string;
}

export function getFooterLinks(locale: string = 'es'): Promise<FooterLinkView[]> {
  return loadSection<CmsFooterLink, FooterLinkView>('v1/footer-links', locale, (item) => ({
    text: item.label || '',
    href: item.url || '#',
  }));
}
