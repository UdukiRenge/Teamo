import { cors } from '@/lib/cors';
import { loginUser } from '@/services/userService';
import { createAccessToken, createRefreshToken } from '@/utils/jwt';
import { errorHandler } from '@/middleware/errorHandler';

async function handler(request, response) {
  if (request.method === 'POST') {
    try {

      const loginResult = await loginUser(request.body);

      const accessToken = createAccessToken(loginResult._id);
      const refreshToken = createRefreshToken(loginResult._id);

      response.setHeader('Set-Cookie', [
        `access_token=${accessToken}; HttpOnly; Path=/; Max-Age=900; Secure; SameSite=Lax`,
        `refresh_token=${refreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; Secure; SameSite=Lax`,
      ]);

      return response.status(200).json({
        success: true,
        userName: loginResult.userName,
      });
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  response.setHeader('Allow', ['POST']);
  response.status(405).end(`Method ${request.method} Not Allowed`);
}

export default cors(handler);