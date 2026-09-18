export interface CmsMultimedia {
  id?: string;
  originalUrl?: string;
  optimizedUrl?: string;
  thumbnailUrl?: string;
  seoUrl?: string;
  externalUrl?: string;
  provider?: string;
  videoId?: string;
  embedCode?: string;
  mimeType?: string;
  fileType?: string;
  altText?: string;
}

export function mediaUrl(media?: CmsMultimedia | null): string {
  if (!media) return '';

  return (
    media.optimizedUrl ||
    media.originalUrl ||
    media.seoUrl ||
    media.thumbnailUrl ||
    media.externalUrl ||
    ''
  );
}

export function videoPlaybackUrl(media?: CmsMultimedia | null): string {
  if (!media) return '';

  if (media.provider === 'youtube' && media.videoId) {
    return `https://www.youtube.com/embed/${media.videoId}`;
  }

  if (media.provider === 'vimeo' && media.videoId) {
    return `https://player.vimeo.com/video/${media.videoId}`;
  }

  const isImage =
    media.fileType === 'image' || (media.mimeType || '').startsWith('image/');
  if (isImage) return '';

  return media.externalUrl || media.originalUrl || media.embedCode || '';
}
