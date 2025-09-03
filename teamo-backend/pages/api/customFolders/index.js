import { createCustomFolder } from '@/services/customFolderService';
import { verifyToken } from '@/middleware/verifyToken';
import { cors } from '@/lib/cors';
import { errorHandler } from '@/middleware/errorHandler';
import { AppError } from '@/utils/AppError';

async function handler(request, response) {
  if (request.method === 'POST') {
    try {
      verifyToken(request);
      await createCustomFolder(request.body);
      return response.status(201).json({ success: true });
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  response.setHeader('Allow', ['POST', 'GET']);
  response.status(405).end(`Method ${request.method} Not Allowed`);
}

export default cors(handler);
