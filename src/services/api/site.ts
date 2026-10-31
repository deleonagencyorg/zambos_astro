import { cmsClient } from './client';
import { cmsConfig } from './config';
import { cached, cmsFailure } from './runtime';

export interface SiteInfo {
  name: string;
  logoUrl: string;
  faviconUrl: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
}

const emptySite: SiteInfo = { name: '', logoUrl: '', faviconUrl: '', defaultMetaTitle: '', defaultMetaDescription: '' };

export function getSiteInfo(): Promise<SiteInfo> {
  return cached('site', async () => {
    try {
      if (!cmsConfig.siteId) throw new Error('PUBLIC_CMS_SITE_ID is required');
      const site = await cmsClient.get<Partial<SiteInfo>>(`v1/sites/${cmsConfig.siteId}`);
      return {
        name: site.name || '',
        logoUrl: site.logoUrl || '',
        faviconUrl: site.faviconUrl || '',
        defaultMetaTitle: site.defaultMetaTitle || '',
        defaultMetaDescription: site.defaultMetaDescription || '',
      };
    } catch (error) {
      return cmsFailure('site', error, emptySite);
    }
  });
}
