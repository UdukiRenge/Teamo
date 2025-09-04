import { deleteGuest } from '@/services/guestService';
import { verifyToken } from '@/middleware/verifyToken';
import { cors } from '@/lib/cors';
import { errorHandler } from '@/middleware/errorHandler';

async function handler(request, response) {
  const { id } = request.query;

  if (request.method === 'DELETE') {
    try {
      verifyToken(request);
      await deleteGuest(id);
      return response.status(200).json({ success: true });
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  response.setHeader('Allow', ['DELETE']);
  response.status(405).end(`Method ${request.method} Not Allowed`);
}

export default cors(handler);