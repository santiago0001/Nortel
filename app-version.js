export const APP_VERSION = "1.0.0";

export function getVersionedAssetUrl(url) {
  if (!url || url.startsWith("http") || url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("#")) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${APP_VERSION}`;
}
