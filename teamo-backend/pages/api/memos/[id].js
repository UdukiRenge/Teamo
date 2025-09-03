import { cors } from '@/lib/cors';
import { updateMemo, deleteMemo } from '@/services/memoService';
import { verifyToken } from '@/middleware/verifyToken';
import { errorHandler } from '@/middleware/errorHandler';

async function handler(request, response) {
  try {
    if (request.method === 'PUT') {
      await verifyToken(request);
      await updateMemo(request.query.id, request.body);
      return response.status(200).json({ success: true });
    }

    if (request.method === 'DELETE') {
      await verifyToken(request);
      await deleteMemo(request.query.id);
      return response.status(200).json({ success: true });
    }

    response.setHeader('Allow', ['PUT', 'DELETE']);
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  } catch (error) {
    return errorHandler(response, error);
  }
}

export default cors(handler);