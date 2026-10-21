// Global Error Handler Middleware
// Transforms Mongoose raw errors into clean, structured JSON responses

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let response = {
    success: false,
    error: err.name || 'ServerError',
    message: err.message || 'An unexpected error occurred'
  };

  // Mongoose Validation Error (e.g. required field missing, enum violation)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const formattedFields = {};
    const messages = [];

    for (const field in err.errors) {
      const fieldError = err.errors[field];
      formattedFields[field] = fieldError.message;
      messages.push(fieldError.message);
    }

    response = {
      success: false,
      error: 'ValidationError',
      message: messages.join(', '),
      fields: formattedFields
    };
  }

  // Mongoose CastError (e.g. invalid MongoDB ObjectId format in URL param)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    response = {
      success: false,
      error: 'InvalidIdError',
      message: `Invalid ObjectId format for parameter '${err.path}': '${err.value}'`
    };
  }

  // JSON Body Parse Syntax Error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    response = {
      success: false,
      error: 'JsonSyntaxError',
      message: 'Malformed JSON payload in request body'
    };
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
