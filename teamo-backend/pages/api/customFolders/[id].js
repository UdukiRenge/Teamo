import { updateCustomFolder, deleteCustomFolder } from '@/services/customFolderService';
import { verifyToken } from '@/middleware/verifyToken';
import { cors } from '@/lib/cors';
import { errorHandler } from '@/middleware/errorHandler';

async function handler(request, response) {
  const { id } = request.query;

  if (request.method === 'PUT') {
    try {
      verifyToken(request);
      await updateCustomFolder(id, request.body);
      return response.status(200).json({ success: true });
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  if (request.method === 'DELETE') {
    try {
      verifyToken(request);
      await deleteCustomFolder(id);
      return response.status(200).json({ success: true });
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  response.setHeader('Allow', ['PUT', 'DELETE']);
  response.status(405).end(`Method ${request.method} Not Allowed`);
}

export default cors(handler);