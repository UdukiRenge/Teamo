import { Inquirie } from '../models/models.js';
import { AppError } from '../utils/AppError.js';

// 問い合わせ内容を登録
export const createInquirie = async (inquirie) => {
  try {
    const newInquirie = new Inquirie(inquirie);
    await newInquirie.save();

  } catch (error) {
    console.error(error);
    throw new AppError('システムエラーが発生しました。', 500, 'INTERNAL_ERROR');
  }
};
