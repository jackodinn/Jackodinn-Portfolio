/** Resolve a /public path (or pass through a full URL) for any deploy base. */
export function assetUrl(path: string) {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('mailto:')) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
