import axios from "axios";

const api = axios.create({
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  baseURL: "http://localhost:3333",
});

// Rotas que não precisam de token
const routesWithoutToken = ['/refresh-token', '/register', '/authenticate'];

// Interceptor para adicionar o token nas requisições
api.interceptors.request.use((config) => {
  const requiresToken = !routesWithoutToken.some(route => config.url?.includes(route));

  if (requiresToken) {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});


async function refreshToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  const response = await api.patch('/refresh-token', {} , {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    }
  })
  localStorage.setItem('access_token', response.data.access_token);
  localStorage.setItem('refresh_token', response.data.refresh_token);

  return response.data.access_token;
}

// Interceptor para lidar com erro 401
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const accessToken = await refreshToken();
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;
