import { cors } from '@/lib/cors';
import { getUser, updateUser, deleteUser } from '@/services/userService';
import { AppError } from '@/utils/AppError';
import { errorHandler } from '@/middleware/errorHandler';

async function handler(request, response) {
  const { id } = request.query;

  if (request.method === 'GET') {
    try {
      const user = await getUser(id);
      if (!user) {
        throw new AppError('ユーザーが見つかりません。', 404, 'USER_NOTFOUND');
      }
      return response.status(200).json({ success: true, user });
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  if (request.method === 'PUT') {
    try {
      const updatedUser = await updateUser(id, request.body);
      return response.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  if (request.method === 'DELETE') {
    try {
      await deleteUser(id);

      // クッキーの削除
      response.setHeader('Set-Cookie', [
        'access_token=; HttpOnly; Path=/; Max-Age=0',
        'refresh_token=; HttpOnly; Path=/; Max-Age=0',
      ]);

      return response.status(200).json({ success: true, message: 'ユーザーを削除しました。' });
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  response.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  response.status(405).end(`Method ${request.method} Not Allowed`);
}

export default cors(handler);