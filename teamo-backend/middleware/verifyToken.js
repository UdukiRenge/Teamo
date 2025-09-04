import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

/**
 * アクセストークン検証
 * @param {string} token
 * @returns {object} decoded payload
 * @throws {AppError} トークンがない/無効な場合
 */
export const verifyToken = (request) => {
  const token = request.cookies.access_token;
  if (!token) {
    throw new AppError('アクセストークンがありません。', 401, 'NO_TOKEN');
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError('アクセストークンが無効です。', 401, 'INVALID_TOKEN');
  }
};

/**
 * リフレッシュトークン検証
 * @param {string} token
 * @returns {object} decoded payload
 * @throws {AppError} トークンがない/無効な場合
 */
export const verifyRefreshToken = (request) => {
  const token = request.cookies.refresh_token;
  if (!token) {
    throw new AppError('リフレッシュトークンが存在しません。', 401, 'TOKEN_NOTFOUND');
  }

  try {
    return jwt.verify(token, process.env.JWT_REFRESH);
  } catch {
    throw new AppError('リフレッシュトークンが無効です。', 401, 'INVALID_TOKEN');
  }
};