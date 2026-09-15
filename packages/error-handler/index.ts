export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    details?: any,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    (Error as typeof Error & {
      captureStackTrace?: (targetObject: object, constructorOpt?: Function) => void;
    }).captureStackTrace?.(this, AppError);
  }
}

// Not found error class
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details?: any) {
    super(message, 404, true, details);
  }
}

// Validation error class
export class ValidationError extends AppError {
  constructor(message = 'Invalid input', details?: any) {
    super(message, 400, true, details);
  }
}

// Authentication error class
export class AuthenticationError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

// Forbidden error class
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

// Database error class
export class DatabaseError extends AppError {
  constructor(message = 'Database error', details?: any) {
    super(message, 500, true, details);
  }
}

// Rate limit error class
export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429);
    }
}