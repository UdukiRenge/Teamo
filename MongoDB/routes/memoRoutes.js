import express from 'express';
import {
  createMemo,
  getMemoByUser,
  getMemoByFolder,
  updateMemo,
  deleteMemo,
} from '../services/memoService.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { AppError } from '../utils/AppError.js';

const memoRoutes = express.Router();

// **メモ作成**
memoRoutes.post('/', verifyToken, async (request, response, next) => {
  try {
    await createMemo(request.body);
    response.status(201).json({success: true});
  } catch (error) {
    next(error);
  }
});

// **メモ情報取得(ユーザーID)**
memoRoutes.get('/user/:user_id', verifyToken, async (request, response, next) => {
  try {
    const memos = await getMemoByUser(request.params.user_id);
    response.status(200).json({
      success: true,
      memos: memos
    });
  } catch (error) {
    next(error);
  }
});

// **メモ情報取得(フォルダID)**
memoRoutes.get('/folder/:folder_id', verifyToken, async (request, response, next) => {
  try {
    const memos = await getMemoByFolder(request.params.folder_id);
    response.status(200).json({
      success: true,
      memos: memos
    });
  } catch (error) {
    next(error);
  }
});

// **メモ情報更新**
memoRoutes.put('/:_id', verifyToken, async (request, response, next) => {
  try {
    await updateMemo(request.params._id, request.body);
    response.status(200).json({success: true});
  } catch (error) {
    next(error);
  }
});

// **メモ削除**
memoRoutes.delete('/:_id', verifyToken, async (request, response) => {
  try {
    await deleteMemo(request.params._id);
    response.status(200).json({success: true});
  } catch (error) {
    next(error);
  }
});

export default memoRoutes;
