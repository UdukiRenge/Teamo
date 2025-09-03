import { Guest } from '@/models/models.js';
import { AppError } from '@/utils/AppError.js';
import { dbConnect } from '@/lib/dbConnect.js';

// 新しいゲストを作成
export const createGuest = async (GuestData) => {
  try {
    await dbConnect();
    const newGuest = new Guest(GuestData);
    await newGuest.save();

  } catch (error) {
    throw new AppError('システムエラーが発生しました。', 500, 'INTERNAL_ERROR');
  }
};

// ゲストを取得
export const getGuest = async (user_id, memo_id) => {
  try {
    await dbConnect();
    const guest = await Guest.findOne({
      user_id,
      memo_id: new mongoose.Types.ObjectId(memo_id),
    });
    return guest;
  } catch (error) {
    throw new AppError('システムエラーが発生しました。', 500, 'INTERNAL_ERROR');
  }
};

// ゲストを削除
export const deleteGuest = async (_id) => {
  try {
    await dbConnect();
    await User.findOneAndDelete({ _id });
  } catch (error) {
    throw new AppError('システムエラーが発生しました。', 500, 'INTERNAL_ERROR');
  }
};
