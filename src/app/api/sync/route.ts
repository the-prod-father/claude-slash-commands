import { NextResponse } from 'next/server'
import { syncAll } from '@/lib/store'

export async function POST(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  const secret = process.env.SYNC_SECRET
  if (!secret || token !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const data = await req.json()
  syncAll(data)
  return NextResponse.json({ ok: true, synced: Object.keys(data) })
}
