import { VercelRequest, VercelResponse } from '@vercel/node';
import effects from '../effects';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    success: true,
    total: effects.length,
    effects
  });
}
