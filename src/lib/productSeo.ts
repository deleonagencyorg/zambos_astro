export interface ProductSeoInput {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

const SITE = 'https://www.zambos.com';

export function productPageTitle(name: string): string {
  return `${name} | Zambos`;
}

export function productMetaDescription(product: ProductSeoInput, lang: 'es' | 'us'): string {
  const short = (product.description || '').trim();
  if (lang === 'es' && product.id === 'zambos-platano-originales') {
    return 'Zambos Plátano Originales: hojuelas de plátano frito con el sabor original. Conoce presentaciones, información nutricional y recetas.';
  }
  if (lang === 'es') {
    return `${product.name}: ${short} Conoce presentaciones y recetas con Zambos.`.replace(/\s+/g, ' ').trim();
  }
  return `${product.name}: ${short} See sizes and recipes with Zambos.`.replace(/\s+/g, ' ').trim();
}

export function productJsonLd(product: ProductSeoInput, urlPath: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || '',
    brand: { '@type': 'Brand', name: 'Zambos' },
    manufacturer: {
      '@type': 'Organization',
      name: 'Snacks Yummies',
      url: 'https://www.snacksyummies.com/',
    },
    image: product.image ? [product.image] : [],
    url: new URL(urlPath, SITE).href,
  };
}
