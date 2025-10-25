import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, error: 'Access token required' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
  
  jwt.verify(token, jwtSecret, (err: any, user: any) => {
    if (err) {
      res.status(403).json({ success: false, error: 'Invalid or expired token' });
      return;
    }

    req.user = user;
    next();
  });
};

export const generateToken = (userId: string, email: string): string => {
  const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
  return jwt.sign(
    { id: userId, email },
    jwtSecret,
    { expiresIn: '24h' }
  );
};
