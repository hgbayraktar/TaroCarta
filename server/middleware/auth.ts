import type { Request, Response, NextFunction } from 'express';

const API_SECRET = process.env['API_SECRET'];

export function requireApiSecret(req: Request, res: Response, next: NextFunction): void {
  if (!API_SECRET) {
    next();
    return;
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token || token !== API_SECRET) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
}
