import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

type ValidationTargets = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};

export function validate(schemas: ValidationTargets) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as Request['query'];
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as Request['params'];
      }

      next();
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as { issues: { path: (string | number)[]; message: string }[] };
        return res.status(400).json({
          message: 'Validation failed',
          errors: zodError.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }
      return res.status(400).json({ message: 'Validation failed' });
    }
  };
}
