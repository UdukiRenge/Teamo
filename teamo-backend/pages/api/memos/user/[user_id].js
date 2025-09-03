import { cors } from '@/lib/cors';
import { getMemoByUser } from '@/services/memoService';
import { verifyToken } from '@/middleware/verifyToken';
import { errorHandler } from '@/middleware/errorHandler';

async function handler(request, response) {
  if (request.method === 'GET') {
    try {
      await verifyToken(request);
      const memos = await getMemoByUser(request.query.user_id);
      return response.status(200).json({ success: true, memos });
    } catch (error) {
      console.error(error);
      return errorHandler(response, error);
    }
  }

  response.setHeader('Allow', ['GET']);
  response.status(405).end(`Method ${request.method} Not Allowed`);
}

export default cors(handler);