export const errorHandler = (error, request, response, next) => {
  console.error(`[${error.code || 'UNKNOWN'}]`, error.message);

  response.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server error',
    code: error.code || 'INTERNAL_ERRROR'
  });
};