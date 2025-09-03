import { cors } from '@/lib/cors';
import { errorHandler } from '@/middleware/errorHandler';

async function handler(request, response) {
  if (request.method === 'POST') {
    try {
      // Cookieをクリア
      response.setHeader('Set-Cookie', [
        'access_token=; HttpOnly; Path=/; Secure; Max-Age=0',
        'refresh_token=; HttpOnly; Path=/; Secure; Max-Age=0',
      ]);

      return response.status(200).json({
        success: true,
        message: 'ログアウトしました。',
      });
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  response.setHeader('Allow', ['POST']);
  response.status(405).end(`Method ${request.method} Not Allowed`);
}

export default cors(handler);