// src/lib/authMiddleware.ts
import jwt from 'jsonwebtoken'

export function verifyJWT(req: Request) {

  // ✅ same as: req.cookies.token
  const cookieHeader = req.headers.get('cookie') || ''
  const token = cookieHeader
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1]


  // ✅ same as: res.status(401).json({ message: "Unauthorized" })
  if (!token) {
    return { error: 'Unauthorized', status: 401, user: null }
  }

  try {

    // ✅ same as: jwt.verify(token, process.env.JWT_SECRET)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)

    // ✅ same as: req.user = decoded
    return { error: null, status: 200, user: decoded }

  } catch (error: any) {

    // ✅ handle each error type specifically

    if (error.name === 'TokenExpiredError') {
      return { error: 'Token expired', status: 401, user: null }
    }

    if (error.name === 'JsonWebTokenError') {
      return { error: 'Invalid token', status: 401, user: null }
    }

    return { error: 'Authentication failed', status: 401, user: null }

  }
}