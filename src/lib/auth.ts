import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'elavenza-jwt-secret-change-in-production-2024';

export interface AdminSession {
  userId: number;
  email: string;
  role: 'admin' | 'customer';
}

/**
 * Verifies JWT token string and validates admin permissions.
 */
export function verifyAdminToken(token: string): AdminSession {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  try {
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = jwt.verify(cleanToken, JWT_SECRET) as any;

    if (!decoded || !decoded.user_id) {
      throw new Error('Invalid token structure');
    }

    if (decoded.role !== 'admin') {
      throw new Error('Access denied: Admin role required');
    }

    return {
      userId: decoded.user_id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (err: any) {
    throw new Error(`Unauthorized: ${err.message}`);
  }
}

/**
 * Extracts and verifies admin authorization from NextRequest headers or cookies.
 */
export function verifyAdminRequest(request: NextRequest): AdminSession {
  const authHeader = request.headers.get('authorization');
  const cookieToken = request.cookies.get('elavenza_admin_token')?.value;
  const token = authHeader || cookieToken;

  if (!token) {
    throw new Error('Unauthorized: Missing admin authorization header or cookie');
  }

  return verifyAdminToken(token);
}
