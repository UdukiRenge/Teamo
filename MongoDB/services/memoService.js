import { Memo } from '../models/models.js';
import { AppError } from '../utils/AppError.js';

// 新しいメモを作成
export const createMemo = async (MemoData) => {
  try {
    const newMemo = new Memo(MemoData);
    await newMemo.save();
  } catch (error) {
    throw new AppError('システムエラーが発生しました。', 500, 'INTERNAL_ERROR');
  }
};

// ユーザーIDに紐づくメモを取得
export const getMemoByUser = async (user_id) => {
  try {
    const memos = await Memo.find({ user_id });
    return memos;
  } catch (error) {
    throw new AppError('システムエラーが発生しました。', 500, 'INTERNAL_ERROR');
  }
};

// フォルダIDに紐づくメモを取得
export const getMemoByFolder = async (folder_id) => {
  try {
    const memos = await Memo.find({ folder_id });
    return memos;
  } catch (error) {
    throw new AppError('システムエラーが発生しました。', 500, 'INTERNAL_ERROR');
  }
};

// メモを更新
export const updateMemo = async (_id, updateData) => {
  try {
    await Memo.findOneAndUpdate({ _id }, { $set: updateData });
  } catch (error) {
    throw new AppError('システムエラーが発生しました。', 500, 'INTERNAL_ERROR');
  }
};

// メモを削除
export const deleteMemo = async (_id) => {
  try {
    await Memo.findOneAndDelete({ _id });
  } catch (error) {
    throw new AppError('システムエラーが発生しました。', 500, 'INTERNAL_ERROR');
  }
};
