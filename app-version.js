const APP_VERSION = "1.0.5";

function getVersionedAssetUrl(url) {
  if (!url || url.startsWith("http") || url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("#")) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${APP_VERSION}`;
}

window.APP_VERSION = APP_VERSION;
window.getVersionedAssetUrl = getVersionedAssetUrl;
