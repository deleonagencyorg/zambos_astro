export const cmsConfig = {
  url: import.meta.env.PUBLIC_CMS_URL as string | undefined,
  token: import.meta.env.PUBLIC_CMS_TOKEN as string | undefined,
  siteId: import.meta.env.PUBLIC_CMS_SITE_ID as string | undefined,
  brandSlug: (import.meta.env.PUBLIC_CMS_BRAND_SLUG as string | undefined) || 'zambos',
};

export type CmsQueryParams = Record<string, string | number | boolean | undefined>;

export function withSiteFilter<T extends CmsQueryParams>(params: T = {} as T) {
  if (!cmsConfig.siteId) {
    throw new Error('PUBLIC_CMS_SITE_ID is required for site-scoped CMS requests');
  }

  return { ...params, siteId: cmsConfig.siteId };
}

export function cmsLocale(locale: string): string {
  return locale === 'us' ? 'en' : locale;
}
