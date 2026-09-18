export const cmsConfig = {
  url: import.meta.env.PUBLIC_CMS_URL as string | undefined,
  token: import.meta.env.PUBLIC_CMS_TOKEN as string | undefined,
  siteId: import.meta.env.PUBLIC_CMS_SITE_ID as string | undefined,
};

export type CmsQueryParams = Record<string, string | number | boolean | undefined>;

export function withSiteFilter<T extends CmsQueryParams>(params: T = {} as T) {
  return cmsConfig.siteId ? { ...params, siteId: cmsConfig.siteId } : params;
}
