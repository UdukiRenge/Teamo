import { createGuest } from '@/services/guestService';
import { verifyToken } from '@/middleware/verifyToken';
import { cors } from '@/lib/cors';
import { errorHandler } from '@/middleware/errorHandler';

async function handler(request, response) {

  if (request.method === 'POST') {
    try {
      verifyToken(request);
      await createGuest(request.body);
      return response.status(201).json({ success: true });
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  response.setHeader('Allow', ['POST']);
  response.status(405).end(`Method ${request.method} Not Allowed`);
}

export default cors(handler);