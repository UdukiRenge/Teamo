import { cors } from '@/lib/cors';
import { createUser } from '@/services/userService';
import { errorHandler } from '@/middleware/errorHandler';

async function handler(request, response) {
  if (request.method === 'POST') {
    try {
      await createUser(request.body);
      return response.status(201).json({ success: true });
    } catch (error) {
      errorHandler(response, error);
    }
  }

  response.setHeader('Allow', ['POST']);
  response.status(405).end(`Method ${request.method} Not Allowed`);
}

export default cors(handler);