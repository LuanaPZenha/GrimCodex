import axios from 'axios';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

export function configureApi(baseURL) {
  api.defaults.baseURL = baseURL;
}

export function getApiBaseUrl() {
  return api.defaults.baseURL || '';
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/auth');
      if (!isLoginRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

function formatApiErrors(errors) {
  if (!Array.isArray(errors) || errors.length === 0) return null;
  return errors
    .map((entry) => {
      if (typeof entry === 'string') return entry;
      return entry.message || entry.msg || null;
    })
    .filter(Boolean)
    .join(' ');
}

export function getErrorMessage(error) {
  const base = getApiBaseUrl();

  if (!error.response) {
    if (!base) {
      return 'API não configurada. No Render (Environment), defina VITE_API_URL com a URL pública do backend (ex.: https://sua-api.onrender.com/api) — não use localhost. Depois faça redeploy do frontend e confirme que o backend está no ar.';
    }
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      if (base.includes('grimcodex-api.onrender.com')) {
        return `A API (${base}) nao esta no ar. No Render, crie o servico Web Docker "grimcodex-api" (pasta backend/) com Postgres vinculado. Teste: https://grimcodex-api.onrender.com/health`;
      }
      return `Não foi possível conectar à API (${base}). Confirme se o backend está publicado no Render e se CORS_ORIGIN no backend inclui a URL deste site.`;
    }
    return error.message || 'Erro de conexão com a API.';
  }

  const data = error.response?.data;
  if (!data) return error.message || 'Erro de conexão com a API.';
  if (typeof data === 'string') return data;

  const details = formatApiErrors(data.errors);

  if (data.message && details) {
    const generic = ['Dados invalidos', 'Dados inválidos', 'Erro de validacao', 'Erro de validação'];
    if (generic.includes(data.message)) return details;
    return `${data.message} ${details}`.trim();
  }

  if (data.message) return data.message;
  if (details) return details;
  if (data.error) return data.error;
  if (typeof data === 'object') {
    return Object.values(data).flat().join(', ');
  }
  return 'Ocorreu um erro inesperado.';
}

export default api;
