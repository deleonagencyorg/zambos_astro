import { cmsClient } from './client';
import { cmsLocale, withSiteFilter } from './config';
import { cached, cmsFailure } from './runtime';

export interface FooterLabels {
  mainText: string;
  description: string;
  choose: string;
  followUs: string;
  contactUs: string;
  instagramText: string;
  facebookText: string;
  email: string;
  copyright: string;
  privacyPolicyText: string;
  privacyPolicyUrl: string;
  newsletter: string;
  newsletterDescription: string;
  emailPlaceholder: string;
  contactTitle: string;
}

interface FooterListResponse {
  data: Array<Partial<FooterLabels>>;
}

const emptyFooter: FooterLabels = {
  mainText: '',
  description: '',
  choose: '',
  followUs: '',
  contactUs: '',
  instagramText: '',
  facebookText: '',
  email: '',
  copyright: '',
  privacyPolicyText: '',
  privacyPolicyUrl: '',
  newsletter: '',
  newsletterDescription: '',
  emailPlaceholder: '',
  contactTitle: '',
};

export function getFooterLabels(locale: string = 'es'): Promise<FooterLabels> {
  const language = cmsLocale(locale);
  return cached(`footer:${language}`, async () => {
    try {
      const response = await cmsClient.get<FooterListResponse>(
        'v1/footer',
        withSiteFilter({ page: 1, pageSize: 1, languageCode: language })
      );
      const config = response.data?.[0];
      if (!config) return emptyFooter;
      const labels = { ...emptyFooter };
      for (const key of Object.keys(emptyFooter) as Array<keyof FooterLabels>) {
        labels[key] = (config[key] || '').trim();
      }
      return labels;
    } catch (error) {
      return cmsFailure('footer', error, emptyFooter);
    }
  });
}
