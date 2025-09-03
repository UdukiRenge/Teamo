import { cors } from '@/lib/cors';
import { getUser } from '@/services/userService';
import { createAccessToken } from '@/utils/jwt';
import { verifyRefreshToken } from '@/middleware/verifyToken';
import { AppError } from '@/utils/AppError';
import { errorHandler } from '@/middleware/errorHandler';

async function handler(request, response) {
  if (request.method === 'POST') {
    try {
      const decoded = verifyRefreshToken(request);

      const user = await getUser(decoded._id);
      if (!user) {
        throw new AppError('存在しないユーザーです。', 404, 'USER_NOTFOUND');
      }

      const accessToken = createAccessToken(user._id);

      response.setHeader(
        'Set-Cookie',
        `access_token=${accessToken}; HttpOnly; Path=/; Secure; SameSite=Lax; Max-Age=${15 * 60}`
      );

      return response.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  response.setHeader('Allow', ['POST']);
  response.status(405).end(`Method ${request.method} Not Allowed`);
}

export default cors(handler);