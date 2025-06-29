import axios from 'axios';
import {axiosPublicClient} from './axiosClient';

// 問い合わせ内容を登録する。
export const createInquirie = async (inquirie: string) => {
  try {
    const Data = {inquirie};
    const response = await axiosPublicClient.post('/inquiries', Data);
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
