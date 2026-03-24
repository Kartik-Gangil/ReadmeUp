// src/lib/rateLimit.ts
import { NextRequest } from 'next/server'

const requests = new Map<string, { count: number; timestamp: number }>()

const WINDOW_MS = 60 * 1000  // 1 minute
const MAX_REQUESTS = 10       // max 10 requests per minute

export async function rateLimit(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const record = requests.get(ip)

  // reset if window expired
  if (!record || now - record.timestamp > WINDOW_MS) {
    requests.set(ip, { count: 1, timestamp: now })
    return { success: true }
  }

  // too many requests
  if (record.count >= MAX_REQUESTS) {
    return { success: false }
  }

  // increment count
  record.count++
  return { success: true }
}