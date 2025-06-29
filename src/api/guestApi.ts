import axios from 'axios';
import {axiosAuthClient} from './axiosClient';

// 新しいゲストを作成する。
export const createGuest = async (memoData: {
  user_id: string;
  memo_id: string;
}) => {
  try {
    const response = await axiosAuthClient.post('/guests', memoData);
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

// ゲストを取得
export const getGuest = async (params: {
  user_id: string;
  memo_id: string;
}) => {
  try {
    const response = await axiosAuthClient.get('/guests', { params });
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

// メモを削除する。
export const deleteGuest = async (_id: string) => {
  try {
    const response = await axiosAuthClient.delete(`/guests/${_id}`);
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
