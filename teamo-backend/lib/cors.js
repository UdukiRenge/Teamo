export const cors = (handler) => async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', 'https://teamo-uduki-renges-projects.vercel.app');
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    return response.status(200).end(); // Preflight対応
  }

  try {
    return await handler(request, response);
  } catch (err) {
    // ヘッダーは維持される
    console.error(err);
    throw err;
  }
};