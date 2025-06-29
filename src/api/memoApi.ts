import axios from 'axios';
import {axiosAuthClient} from './axiosClient';

// 新規メモ一覧を取作成する。
export const createMemo = async (memoData: {
  user_id: string;
  folder_id?: string;
  title: string;
  text?: string;
}) => {
  try {
    const response = await axiosAuthClient.post('/memos', memoData);
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

// ユーザーIDを基にメモ一覧を取得する。
export const getMemoByUser = async (user_id: string) => {
  console.log('Sending request to:', `/memos/user/${user_id}`);
  try {
    const response = await axiosAuthClient.get(`/memos/user/${user_id}`);
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

// フォルダIDを基にメモ一覧を取得する。
export const getMemoByFolder = async (folder_id: string) => {
  console.log('Sending request to:', `/memos/folder/${folder_id}`);
  try {
    const response = await axiosAuthClient.get(`/memos/folder/${folder_id}`);
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

// メモを更新する。
export const updateMemo = async (
  _id: string,
  updateData: { folder_id?: string | null; title?: string; text?: string }
) => {
  try {
    const response = await axiosAuthClient.put(`/memos/${_id}`, updateData);
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
export const deleteMemo = async (_id: string) => {
  try {
    const response = await axiosAuthClient.delete(`/memos/${_id}`);
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
