const WIDGET_URL_PROTOCOL = "collab-love:";

const parseUrl = (url: string): URL | null => {
  try {
    return new URL(url);
  } catch {
    return null;
  }
};

export const widgetDeepLinkPath = (url: string): string | null => {
  const parsed = parseUrl(url);
  if (!parsed || parsed.protocol !== WIDGET_URL_PROTOCOL || !parsed.host) {
    return null;
  }
  return `/${parsed.host}${parsed.pathname}`;
};
