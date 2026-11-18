import type { NextFunction, Request, Response } from 'express';
import { StockInsuficienteError, ValidacionError } from '../errors';

export function manejarErrores(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ValidacionError || err instanceof RangeError) {
    res.status(400).json({ error: err.message });
    return;
  }
  if (err instanceof StockInsuficienteError) {
    res.status(409).json({ error: err.message });
    return;
  }
  res.status(500).json({ error: 'Error interno del servidor' });
}
