import axios from 'axios';

// ベースURLを環境変数から取得
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 認証不要API用（シンプル、インターセプターなし）
export const axiosPublicClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 認証ありAPI用（インターセプター付き）
export const axiosAuthClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// アクセストークンの自動リフレッシュ処理（認証ありクライアント専用）
axiosAuthClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // リフレッシュトークンで新アクセストークン取得
        await axiosAuthClient.post('/users/refresh');

        // 新トークン発行後に元のリクエストを再送
        return axiosAuthClient(originalRequest);
      } catch (refreshError) {
        // ここではリダイレクトせずエラーを返すだけにする
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);