import { verifyToken } from '@/middleware/verifyToken';
import { errorHandler } from '@/middleware/errorHandler';
import { getCustomFolderByUser } from '@/services/customFolderService';
import { cors } from '@/lib/cors';

async function handler(request, response) {
  if (request.method === 'GET') {
    try {
      verifyToken(request);
      const { user_id } = request.query;
      const folders = await getCustomFolderByUser(user_id);
      return response.status(200).json({ success: true, folders });
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  response.setHeader('Allow', ['GET']);
  response.status(405).end(`Method ${request.method} Not Allowed`);
}

export default cors(handler);