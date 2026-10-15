import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const handleLogout =() => {
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
}

const subscribeTokenRefresh = (cb: () => void) => {
  refreshSubscribers.push(cb);
}

const onRefreshSuccess = () => {
    refreshSubscribers.forEach((cb) => cb());
    refreshSubscribers = [];
}

axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// handle expired token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // prevent infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        return new Promise((resolve) => {
            subscribeTokenRefresh(() => resolve(axiosInstance(originalRequest)));
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/refresh-token`,
          {},
          { withCredentials: true }
        );
        isRefreshing = false;
        onRefreshSuccess();
        return axiosInstance(originalRequest);
      }catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        handleLogout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;



