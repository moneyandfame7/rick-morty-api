export const getIdFromUrl = (url: string): number | undefined =>
  url.length ? parseInt(url.split('/')[url.split('/').length - 1]) : undefined
