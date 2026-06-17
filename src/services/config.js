let appConfig = {
  apiUrl: '',
  socketUrl: '',
  loaded: false,
};

function resolveDevDefaults() {
  return {
    apiUrl: 'http://localhost:8080/api',
    socketUrl: 'http://localhost:8080',
  };
}

export async function loadAppConfig() {
  if (appConfig.loaded) return appConfig;

  const viteApi = import.meta.env.VITE_API_URL;
  const viteSocket = import.meta.env.VITE_SOCKET_URL;

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

  let apiUrl = fileConfig.apiUrl || viteApi || '';
  let socketUrl = fileConfig.socketUrl || viteSocket || '';

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
