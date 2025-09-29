import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthContext {
  userId: string
  role: 'admin' | 'manager' | 'sales_rep'
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthContext
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev') as any
    // map backend enum roles to frontend strings if needed
    const roleMap: Record<string, AuthContext['role']> = {
      ADMIN: 'admin',
      MANAGER: 'manager',
      SALES_REP: 'sales_rep',
      admin: 'admin',
      manager: 'manager',
      sales_rep: 'sales_rep',
    }
    req.auth = { userId: payload.sub, role: roleMap[payload.role] || 'sales_rep' }
    next()
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

export function requireRoles(roles: AuthContext['role'][]): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    if (!req.auth) return res.status(401).json({ error: 'Unauthorized' })
    if (!roles.includes(req.auth.role)) return res.status(403).json({ error: 'Forbidden' })
    next()
  }
}


