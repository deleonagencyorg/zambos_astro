// src/services/api/types.ts

export interface ProductSize {
  value: string;
  image?: string;
}

export interface Product {
  cmsId?: string;
  available?: string;
  background_image?: string;
  header_background?: string;
  new?: boolean;
  id: string;
  slug?: string;
  name: string;
  title?: string;
  category?: string;
  image: string;
  imageMobile?: string;
  description?: string;
  short_description?: string;
  background_color?: string;
  backgroundColor?: string;
  background_product?: string;
  header_color?: string;
  header_text_color?: string;
  headerTextColor?: string;
  text_color?: string;
  textColor?: string;
  color_button?: string;
  colorButton?: string;
  weight?: string[];
  sizes?: ProductSize[];
  nutrition?: {
    title?: string;
    serving?: string;
    rows?: { label: string; value: string }[];
    disclaimer?: string;
    [key: string]: any;
  };
  brandId?: string;
  brandSlug?: string;
  brandName?: string;
  isnew?: boolean;
  isNew?: boolean;

  // SEO desde CMS
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string | { url: string };
}

export interface CMSProductRaw {
  available?: string;
  backgroundImage?: string;
  id: string;
  slug?: string;
  name: string;
  category?: string;
  image?: string | { url: string };
  imageMobile?: string;
  description?: string;
  shortDescription?: string;
  short_description?: string;
  backgroundColor?: string;
  background_color?: string;
  background_product?: string;
  headerTextColor?: string;
  header_text_color?: string;
  header_color?: string;
  textColor?: string;
  text_color?: string;
  colorButton?: string;
  color_button?: string;
  weight?: string[];
  sizes?: ProductSize[];
  nutrition?: any;
  brandId?: string;
  isNew?: boolean;
  isnew?: boolean;
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string | { url: string };
}

export interface CMSProductsResponse {
  data: CMSProductRaw[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
  background?: string;
  link?: string;
  caption?: string;
}

export interface CMSBrandLanguageRaw {
  name: string;
  link?: string;
  logoUrl?: string;
  caption?: string;
  code?: string;
}

export interface CMSBrandRaw {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
  logo_url?: string;
  background?: string;
  brandLanguages?: CMSBrandLanguageRaw[];
}

export interface CMSBrandsResponse {
  data: CMSBrandRaw[];
}

export interface Recipe {
  cmsId?: string;
  'preview-image'?: string;
  type?: string;
  video?: string;
  date?: string;
  products?: string[];
  new?: boolean;
  isNew?: boolean;
  id: string;
  slug?: string;
  title: string;
  image?: string | { url: string };
  preparation_time?: number;
  people?: string | number;
  difficulty?: string;
  ingredients?: string[];
  instructions?: string[];
  category?: string;
  gallery?: string[];
  brand?: string[];
  description?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string | { url: string };
}

export interface CMSRecipeRaw {
  preparationTime?: number;
  type?: string;
  gallery?: string[];
  video?: string;
  date?: string;
  isNew?: boolean;
  brands?: Array<{ id: string; slug: string; name: string }>;
  products?: Array<{ id: string; slug: string; name: string }>;
  id: string;
  slug?: string;
  title: string;
  image?: string | { url: string };
  preparation_time?: number;
  category?: string;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
  people?: string | number;
  difficulty?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string | { url: string };
}

export interface CMSRecipesResponse {
  data: CMSRecipeRaw[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface SEO {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: { url: string } | string | null;
  canonical?: string;
}

export interface CMSPageRaw {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  featuredImage?: { url: string };
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: { url: string } | null;
  seo?: SEO;
}

export interface TopMessage {
  id: string;
  text: string;
  link?: string;
  isActive: boolean;
  backgroundColor?: string;
  textColor?: string;
}

export interface CMSTopMessageRaw {
  id: string;
  text: string;
  link?: string;
  is_active?: boolean;
  background_color?: string;
  text_color?: string;
}

export interface CMSTopMessagesResponse {
  data: CMSTopMessageRaw[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
}
