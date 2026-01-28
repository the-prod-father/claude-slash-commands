import { NextResponse } from 'next/server'
import { getDrafts } from '@/lib/store'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const drafts = getDrafts()
  const idx = drafts.findIndex((d) => d.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  drafts[idx].status = 'approved'
  drafts[idx].approvedAt = new Date().toISOString()
  return NextResponse.json(drafts[idx])
}
