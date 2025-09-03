import { CustomFolder } from '@/models/models.js';
import { AppError } from '@/utils/AppError.js';
import { dbConnect } from '@/lib/dbConnect.js';

// 新しいフォルダを作成
export const createCustomFolder = async (CustomFolderData) => {
  try {
    await dbConnect();
    const newCustomFolder = new CustomFolder(CustomFolderData);
    await newCustomFolder.save();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('システムエラーが発生しました。', 500, 'INTERNAL_ERROR');
  }
};

// ユーザーIDに紐づくフォルダを取得
export const getCustomFolderByUser = async (user_id) => {
  try {
    await dbConnect();
    const folders = await CustomFolder.find({ user_id });
    return folders;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('システムエラーが発生しました。', 500, 'INTERNAL_ERROR');
  }
};

// フォルダを更新
export const updateCustomFolder = async (_id, updateData) => {
  try {
    await dbConnect();
    await CustomFolder.findOneAndUpdate({ _id }, { $set: updateData });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('システムエラーが発生しました。', 500, 'INTERNAL_ERROR');
  }
};

// フォルダを削除
export const deleteCustomFolder = async (_id) => {
  try {
    await dbConnect();
    await CustomFolder.findOneAndDelete({ _id });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('システムエラーが発生しました。', 500, 'INTERNAL_ERROR');
  }
};
