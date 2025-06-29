import express from 'express';
import {
  createCustomFolder,
  getCustomFolderByUser,
  updateCustomFolder,
  deleteCustomFolder,
} from '../services/customFoldrService.js';
import { verifyToken } from '../middleware/verifyToken.js';

const customFolderRoutes = express.Router();

// **フォルダ作成**
customFolderRoutes.post('/', verifyToken, async (request, response, next) => {
  try {
    await createCustomFolder(request.body);
    response.status(201).json({success: true});
  } catch (error) {
    next(error);
  }
});

// **フォルダ情報取得**
customFolderRoutes.get('/:user_id', verifyToken, async (request, response, next) => {
  try {
    const folders = await getCustomFolderByUser(request.params.user_id);
    response.status(200).json({
      success: true,
      folders: folders
    });
  } catch (error) {
    next(error);
  }
});

// **フォルダ情報更新**
customFolderRoutes.put('/:_id', verifyToken, async (request, response, next) => {
  try {
    await updateCustomFolder(request.params._id, request.body);
    response.status(200).json({success: true});
  } catch (error) {
    next(error);
  }
});

// **フォルダ削除**
customFolderRoutes.delete('/:_id', verifyToken, async (request, response, next) => {
  try {
    await deleteCustomFolder(request.params._id);
    response.status(200).json({success: true});
  } catch (error) {
    next(error);
  }
});

export default customFolderRoutes;
