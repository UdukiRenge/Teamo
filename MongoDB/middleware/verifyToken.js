import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

export const verifyToken = (request, response, next) => {
  const token = request.cookies.access_token;
  
  if (!token) {
    return next(new AppError('アクセストークンがありません。', 401, 'NO_TOKEN'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded;
    next();
  } catch {
    return next(new AppError('アクセストークンが無効です。', 401, 'NO_INCAILD'));
  }
};

export const verifyRefreshToken = (request, response, next) => {
  // Cookieから現在のリフレッシュトークンを取得する。
    const token = request.cookies.refresh_token;

    if (!token) {
      return next(new AppError('リフレッシュトークンが存在しません。', 401, "TOKEN_NOTFOUND"));
    }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH);
    request.user = decoded;
    next();
  } catch {
    return next(new AppError('リフレッシュトークンが無効です。', 401, 'NO_INCAILD'));
  }
}