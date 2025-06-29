import axios from 'axios';
import {axiosAuthClient} from './axiosClient';

import { MemoInterface } from '../constants/stateInterface';

import { getMemoByFolder, updateMemo } from './memoApi';

// 新規フォルダを作成する。
export const createCustomFolder = async (CustomFolderData: {
  user_id: string;
  folder_name: string;
}) => {
  try {
    const response = await axiosAuthClient.post('/customFolders', CustomFolderData);
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

// ユーザーIDを基にフォルダの一覧を取得する。
export const getCustomFolderByUser = async (user_id: string) => {
  try {
    const response = await axiosAuthClient.get(`/customFolders/${user_id}`);
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

// フォルダを更新する。
export const updateCustomFolder = async (
  _id: string,
  updateData: { folder_name: string }
) => {
  try {
    const response = await axiosAuthClient.put(`/customFolders/${_id}`, updateData);
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

// フォルダを削除する。
export const deleteCustomFolder = async (_id: string) => {
  try {
    // 削除するフォルダに格納しているメモが無いか取得
    const matchMemos = await getMemoByFolder(_id);

    console.log(matchMemos);

    // 削除するフォルダに格納しているメモのフォルダIDをnullで更新
    if (matchMemos.memos.length > 0) {
      await Promise.all(
        matchMemos.map((matchMemo: MemoInterface) =>
          updateMemo(matchMemo._id, { folder_id: null })
        )
      );
    }

    // フォルダの削除
    const response = await axiosAuthClient.delete(`/customFolders/${_id}`);
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
