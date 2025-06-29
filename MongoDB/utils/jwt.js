import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// アクセストークン生成
export const createAccessToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// リフレッシュトークン生成
export const createRefreshToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_REFRESH, { expiresIn: '7d' });
};