export function errorHandler(response, error) {
  console.error(`[${error.code || 'UNKNOWN'}]`, error.message);

  response.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    code: error.code || 'INTERNAL_ERROR',
  });
}