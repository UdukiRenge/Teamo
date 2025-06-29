import axios from 'axios';
import {axiosAuthClient, axiosPublicClient} from './axiosClient';

// 新規ユーザーを登録する。
export const createUser = async (userData: {
  _id: string;
  password: string;
  user_name: string;
  login?: boolean;
}) => {
  try {
    const response = await axiosPublicClient.post('/users', userData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // サーバーからのエラー応答がある場合はそれをそのまま返す
      return error.response.data;
    }
    // それ以外の未知のエラーは再throwして catch 側で扱う
    throw new Error('システムエラーが発生しました。');
  }
};

// ログインする
export const loginUser = async (userData: {
  _id: string;
  password: string;
}) => {
  try {
    const response = await axiosPublicClient.post('/users/login', userData);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // サーバーからのエラー応答がある場合はそれをそのまま返す
      return error.response.data;
    }
    // それ以外の未知のエラーは再throwして catch 側で扱う
    throw new Error('システムエラーが発生しました。');
  }
};

// アクセストークンを再取得する。
export const refreshToken = async () => {
  try {
    const response = await axiosPublicClient.post('/users/refresh');

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // サーバーからのエラー応答がある場合はそれをそのまま返す
      return error.response.data;
    }
    // それ以外の未知のエラーは再throwして catch 側で扱う
    throw new Error('システムエラーが発生しました。');
  }
} 

// ログアウトする
export const logoutUser = async () => {
  try {
    const response = await axiosPublicClient.post('/users/logout');

    return response.data ;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // サーバーからのエラー応答がある場合はそれをそのまま返す
      return error.response.data;
    }
    // それ以外の未知のエラーは再throwして catch 側で扱う
    throw new Error('システムエラーが発生しました。');
  }
};

// ユーザーIDと一致するデータを取得する。
export const getUser = async (params: { _id: string }) => {
  try {
    const response = await axiosAuthClient.get(`/users/${params._id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // サーバーからのエラー応答がある場合はそれをそのまま返す
      return error.response.data;
    }
    // それ以外の未知のエラーは再throwして catch 側で扱う
    throw new Error('システムエラーが発生しました。');
  }
};

// ユーザーを更新する。
export const updateUser = async (
  _id: string,
  updateData: { nowPassword?: string; password?: string; user_name?: string }
) => {
  try {
    const response = await axiosAuthClient.put(`/users/${_id}`, updateData);
    return response.data;
 } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // サーバーからのエラー応答がある場合はそれをそのまま返す
      return error.response.data;
    }
    // それ以外の未知のエラーは再throwして catch 側で扱う
    throw new Error('システムエラーが発生しました。');
  }
};

// ユーザーを削除する。
export const deleteUser = async (_id: string) => {
  try {
    const response = await axiosAuthClient.delete(`/users/${_id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // サーバーからのエラー応答がある場合はそれをそのまま返す
      return error.response.data;
    }
    // それ以外の未知のエラーは再throwして catch 側で扱う
    throw new Error('システムエラーが発生しました。');
  }
};
