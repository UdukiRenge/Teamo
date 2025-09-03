import { cors } from '@/lib/cors';
import { createMemo } from '@/services/memoService';
import { verifyToken } from '@/middleware/verifyToken';
import { errorHandler } from '@/middleware/errorHandler';

async function handler(request, response) {
  if (request.method === 'POST') {
    try {
      await verifyToken(request);
      await createMemo(request.body);
      return response.status(201).json({ success: true });
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  response.setHeader('Allow', ['POST']);
  response.status(405).end(`Method ${request.method} Not Allowed`);
}

export default cors(handler);