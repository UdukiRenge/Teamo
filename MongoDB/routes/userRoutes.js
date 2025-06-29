import express from 'express';
import jwt from 'jsonwebtoken';
import { createAccessToken, createRefreshToken } from '../utils/jwt.js';
import {
  createUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
} from '../services/userService.js';
import { verifyToken, verifyRefreshToken } from '../middleware/verifyToken.js';
import { AppError } from '../utils/AppError.js';

const userRoutes = express.Router();

// **ユーザー作成**
userRoutes.post('/', async (request, response, next) => {
  try {
    await createUser(request.body);
    response.status(201).json({success: true});
  } catch (error) {
    next(error);
  }
});

// **ユーザーログイン**
userRoutes.post('/login', async (request, response, next) => {
  try {
    const loginResult = await loginUser(request.body);

    // JWTトークン生成
    const accessToken = createAccessToken(request.body._id);
    const refreshToken = createRefreshToken(request.body._id);
    
    // アクセストークンを Cookie に設定
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false, // 本番では true
      sameSite: 'Lax',
      maxAge: 15 * 60 * 1000, // 15分
    });

    // リフレッシュトークンを Cookie に設定
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false, // 本番では true
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7日
    });

    response.status(200).json({
      success: true,
      userName: loginResult.userName
    });
  } catch (error) {
    next(error);
  }
});

// **トークン再発行**
userRoutes.post('/refresh', verifyRefreshToken, async (request, response, next) => {
  try {
    const user = await getUser(request.user._id);

    if (!user) {
      throw new AppError('存在しないユーザーです。', 404, "USER_NOTFOUND");
    }

    // 新しいアクセストークンを発行
    const accessToken = createAccessToken(user._id);

    // クッキーにセット
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false, // 本番は true に
      sameSite: 'Lax',
      maxAge: 15 * 60 * 1000,
    });

    response.status(200).json({
      success: true,
      user: user
    });
  } catch (error) {
    next(error);
  }
});

// **ユーザーログアウト**
userRoutes.post('/logout', verifyToken, async (request, response, next) => {
  try {
    // アクセストークン破棄
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: false, // 本番は true
      sameSite: 'Lax',
    });

    // リフレッシュトークン破棄
    response.clearCookie('refresh_token', {
      httpOnly: true,
      secure: false, // 本番は true
      sameSite: 'Lax',
    });

    response.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});

// **ユーザー情報取得**
userRoutes.get('/:_id', verifyToken, async (request, response, next) => {
  try {
    const user = await getUser(request.params._id);

    if (!user) {
      throw new AppError('存在しないユーザーです。', 404, "USER_NOTFOUND");
    }

    response.status(200).json({
      success: true,
      user: user
    });
  } catch (error) {
    next(error);
  }
});

// **ユーザー情報更新**
userRoutes.put('/:_id', verifyToken, async (request, response, next) => {
  try {
    await updateUser(request.params._id, request.body);
    response.status(200).json({success: true});
  } catch (error) {
    next(error);
  }
});

// **ユーザー削除**
userRoutes.delete('/:_id', verifyToken, async (request, response, next) => {
  try {
    await deleteUser(request.params._id);
    response.status(200).json({success: true});
  } catch (error) {
    next(error);
  }
});

export default userRoutes;
