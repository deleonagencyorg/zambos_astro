import { setLocale, getLocale, type Locale } from '../i18n/i18n';

// Listas compartidas de países
export const ENGLISH_SPEAKING_COUNTRIES = [
  'US', 'GB', 'CA', 'AU', 'NZ', 'IE', 'ZA', 'JM', 'BZ', 'BS', 
  'BB', 'AG', 'DM', 'GD', 'KN', 'LC', 'VC', 'TT', 'GY'
] as const;

export const SPANISH_SPEAKING_COUNTRIES = [
  'HN', 'ES', 'MX', 'AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 
  'EC', 'SV', 'GT', 'NI', 'PA', 'PY', 'PE', 'PR', 'UY', 'VE'
] as const;

/**
 * Determina el idioma predeterminado basado en código de país
 */
export function getDefaultLocaleByCountry(countryCode: string | null): Locale {
  if (!countryCode) return 'es';
  const code = countryCode.toUpperCase();
  if ((ENGLISH_SPEAKING_COUNTRIES as readonly string[]).includes(code)) return 'us';
  return 'es';
}

/**
 * Extrae la IP real del cliente desde los headers de la request
 */
function extractIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    '127.0.0.1'
  );
}

/**
 * Intenta detectar el país desde los headers que inyectan los CDN/proxies:
 * - Netlify: nf-geo-country (o x-country en algunos edge functions)
 * - Cloudflare: cf-ipcountry
 * - AWS CloudFront: cloudfront-viewer-country
 * - Vercel: x-vercel-ip-country
 * - Otros: x-country-code, x-geo-country
 */
function countryFromHeaders(request: Request): string | null {
  const candidates = [
    'cf-ipcountry',
    'nf-geo-country',
    'x-vercel-ip-country',
    'cloudfront-viewer-country',
    'x-country-code',
    'x-geo-country',
    'x-country',
  ];
  for (const header of candidates) {
    const val = request.headers.get(header);
    if (val && val.length === 2 && val !== 'XX') {
      return val.toUpperCase();
    }
  }
  return null;
}

/**
 * Detecta el país usando geoip-lite como fallback (solo funciona en entornos
 * con acceso al sistema de archivos, no en Netlify edge/serverless puro).
 */
function countryFromGeoip(ip: string): string | null {
  try {
    // Importación dinámica para que no rompa si el módulo no está disponible
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const geoip = require('geoip-lite');
    const geo = geoip.lookup(ip);
    return geo?.country || null;
  } catch {
    return null;
  }
}

/**
 * Maneja toda la lógica de detección de locale:
 * 1. Headers de CDN (Netlify / Cloudflare / Vercel / CloudFront)
 * 2. geoip-lite con la IP del cliente (fallback local)
 * 3. Fallback a 'es'
 */
export function detectLocale(request: Request): { locale: Locale; ip: string; country: string | null } {
  const ip = extractIp(request);

  // 1. Headers del CDN — más fiable en producción
  const countryFromCDN = countryFromHeaders(request);
  if (countryFromCDN) {
    console.log(`[geo] country from CDN header: ${countryFromCDN}`);
    return { locale: getDefaultLocaleByCountry(countryFromCDN), ip, country: countryFromCDN };
  }

  // 2. geoip-lite — fallback para desarrollo local
  const countryFromLocal = countryFromGeoip(ip);
  if (countryFromLocal) {
    console.log(`[geo] country from geoip-lite: ${countryFromLocal} (ip: ${ip})`);
    return { locale: getDefaultLocaleByCountry(countryFromLocal), ip, country: countryFromLocal };
  }

  console.log(`[geo] country unknown for ip: ${ip}, defaulting to 'es'`);
  return { locale: 'es', ip, country: null };
}

/**
 * Establece el idioma predeterminado basado en la IP del usuario
 */
export function setLocaleByIp(ip: string): Locale {
  const currentLocale = getLocale();
  if (currentLocale) return currentLocale;
  const { locale } = detectLocale({ headers: { get: () => ip } } as unknown as Request);
  setLocale(locale);
  return locale;
}
