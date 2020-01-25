import { Request, Response, NextFunction } from 'express';
import { UNAUTHORIZED } from 'http-status-codes';

/**
 * Checks if the current request is coming from a particular service, returns `401 UNAUTHORIZED` if the services don't match
 *
 * @param source the expected source service
 */
export const sourceService = (...source: string[]) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (source.includes(req.get('x-origin-service'))) return next();
  else res.jSend.error(null, 'Missing required header', UNAUTHORIZED);
};
