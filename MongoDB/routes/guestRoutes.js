import express from 'express';
import {
  createGuest,
  getGuest,
  deleteGuest,
} from '../services/guestService.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { AppError } from '../utils/AppError.js';

const guestRoutes = express.Router();

// **ゲスト作成**
guestRoutes.post('/', verifyToken, async (request, response, next) => {
  try {
    await createGuest(request.body);
    response.status(201).json({success: true});
  } catch (error) {
    next(error);
  }
});

// **ゲスト情報取得**
guestRoutes.get('/:user_id/:memo_id', async (request, response, next) => {
  try {
    const guest = await getGuest(request.params.user_id, request.params.memo_id);
    if (!guest) {
      throw new AppError("該当のメモにゲストは存在しません", 404, "GUEST_NOTFOUND");
    }
    response.status(200).json({
      success: true,
      guest: guest
    });
  } catch (error) {
    next(error);
  }
});

// **ゲスト削除**
guestRoutes.delete('/:_id', verifyToken, async (request, response, next) => {
  try {
    await deleteGuest(request.params._id);
    response.status(200).json({success: true});
  } catch (error) {
    next(error);
  }
});

export default guestRoutes;
