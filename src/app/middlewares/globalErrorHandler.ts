/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';
  let errorDetails = err;

  // Handle zod validation errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errorDetails = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  }

  // Handle specific application errors
  if (err.message === 'User not found') {
    statusCode = 404;
    message = 'User not found';
    errorDetails = {
      code: 404,
      description: 'User not found!',
    };
  }

  return res.status(statusCode).json({
    success: false,
    message,
    error: errorDetails,
  });
};

export default globalErrorHandler;
