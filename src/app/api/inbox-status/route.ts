import { NextResponse } from 'next/server'
import { getInboxStatus } from '@/lib/store'

export async function GET() {
  return NextResponse.json(getInboxStatus())
}

export async function POST(req: Request) {
  const body = await req.json()
  const status = getInboxStatus()
  if (body.lastReviewed !== undefined) status.lastReviewed = body.lastReviewed
  if (body.pendingCount !== undefined) status.pendingCount = body.pendingCount
  if (body.urgentCount !== undefined) status.urgentCount = body.urgentCount
  return NextResponse.json(status)
}
