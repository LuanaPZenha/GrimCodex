let appConfig = {
  apiUrl: '',
  socketUrl: '',
  loaded: false,
};

function isLocalUrl(url) {
  if (!url) return false;
  try {
    const { hostname } = new URL(url);
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
  } catch {
    return false;
  }
}

function sanitizeUrl(url) {
  if (!url) return '';
  if (import.meta.env.PROD && isLocalUrl(url)) return '';
  return url;
}

function resolveDevDefaults() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8082/api';
  const socketUrl = import.meta.env.VITE_SOCKET_URL || apiUrl.replace(/\/api\/?$/, '');
  return { apiUrl, socketUrl };
}

export async function loadAppConfig() {
  if (appConfig.loaded) return appConfig;

  const viteApi = sanitizeUrl(import.meta.env.VITE_API_URL || '');
  const viteSocket = sanitizeUrl(import.meta.env.VITE_SOCKET_URL || '');

  let fileConfig = {};
  try {
    const res = await fetch('/config.json', { cache: 'no-store' });
    if (res.ok) {
      const text = await res.text();
      if (text.trim().startsWith('{')) {
        fileConfig = JSON.parse(text);
      }
    }
  } catch {
    /* config.json opcional */
  }

  let apiUrl = sanitizeUrl(fileConfig.apiUrl || viteApi || '');
  let socketUrl = sanitizeUrl(fileConfig.socketUrl || viteSocket || '');

  if (!apiUrl && import.meta.env.DEV) {
    ({ apiUrl, socketUrl } = resolveDevDefaults());
  }

  if (apiUrl && !socketUrl) {
    socketUrl = apiUrl.replace(/\/api\/?$/, '');
  }

  appConfig = { apiUrl, socketUrl, loaded: true };
  return appConfig;
}

export function getAppConfig() {
  return appConfig;
}

export function isApiConfigured() {
  return Boolean(appConfig.apiUrl);
}
