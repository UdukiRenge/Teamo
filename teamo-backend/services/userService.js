import bcrypt from 'bcrypt';

import { User, CustomFolder, Memo } from '@/models/models.js';
import { dbConnect } from '@/lib/dbConnect.js';
import { AppError } from '@/utils/AppError.js';

// 新しいユーザーを作成
export const createUser = async (userData) => {
  try {
    // 現在のDBに重複するデータがないか確認
    await dbConnect();

    const resGetUser = await getUser(userData._id);

    if (resGetUser) {
      throw new AppError('既に存在するユーザーです。', 409, 'USER_DUPLICATION');
    }

    // パスワードをハッシュ化
    userData.password = await bcrypt.hash(userData.password, 10)

    const newUser = new User(userData);
    await newUser.save();
    
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('システムエラーが発生しました。', 500, 'INTERNAL_ERROR');
  }
};

// ユーザーログインを実施し、トークンを返却する。
export const loginUser = async (userData) => {
  const {_id, password} = userData;
  try {
    await dbConnect();
    // ユーザーを取得
    const user = await getUser(_id);

    if (!user) {
      throw new AppError('ユーザーIDまたはパスワードが違います。', 401, "USER_NOTFOUND");
    }

    // パスワードの突合
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError('ユーザーIDまたはパスワードが違います。', 401, "PASSWORD_ERROR");
    }

    return {userName: user.user_name};
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('システムエラーが発生しました。', 500, 'INTERNAL_ERROR');
  }
}

// ユーザー情報を取得
export const getUser = async (_id) => {
  try {
    await dbConnect();
    const user = await User.findOne({ _id });
    return user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('システムエラーが発生しました。', 500, 'INTERNAL_ERROR');
  }
};

// ユーザー情報を更新
export const updateUser = async (_id, updateData) => {
  try {
    await dbConnect();
    // ユーザーを取得
    const user = await getUser(_id);

    if (!user) {
      throw new AppError('存在しないユーザーです。', 404, "USER_NOTFOUND");
    }

    // パスワードを変更する場合
    if (
      updateData.nowPassword &&
      updateData.password
    ) {

      // パスワードの突合
      const isMatch = await bcrypt.compare(updateData.nowPassword, user.password);

      if (!isMatch) {
        throw new AppError('現在のパスワードが誤りです。', 401, "PASSWORD_ERROR");
      }

      // パスワードをハッシュ化
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // 空文字・undefined・null を除外
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
    );

    await User.findOneAndUpdate({ _id }, { $set: filteredUpdateData });
  } catch (error) {
    throw new AppError('システムエラーが発生しました。', 500, 'INTERNAL_ERROR');
  }
};

// ユーザー情報を削除
export const deleteUser = async (_id) => {
  try {
    await dbConnect();

    // ユーザーに紐づくカスタムフォルダを削除
    await CustomFolder.deleteMany({ user_id: _id });

    // ユーザーに紐づくメモを削除
    await Memo.deleteMany({ user_id: _id });

    // ユーザーを削除
    await User.findOneAndDelete({ _id });
  } catch (error) {
    throw new AppError('システムエラーが発生しました。', 500, 'INTERNAL_ERROR');
  }
};
