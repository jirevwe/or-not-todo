import { Request, Response, NextFunction } from 'express';
import { UNAUTHORIZED } from 'http-status-codes';

export const validateBuildNumber = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!/Android/i.test(req.headers['user-agent'])) return next();

  if (req.get('x-build-number')) {
    if (parseInt(req.get('x-build-number'), 10) >= 0) {
      next();
    } else
      res.jSend.error(null, 'Invalid value format for header', UNAUTHORIZED);
  } else res.jSend.error(null, 'Missing required header', UNAUTHORIZED);
};
