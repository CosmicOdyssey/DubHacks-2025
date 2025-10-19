import { Request, Response, NextFunction } from 'express';

export function rawBodySaver(req: Request, _res: Response, buf: Buffer): void {
  (req as any).rawBody = buf;
}

export function requireRawBody(req: Request, _res: Response, next: NextFunction): void {
  if (!(req as any).rawBody) (req as any).rawBody = Buffer.from('');
  next();
}


