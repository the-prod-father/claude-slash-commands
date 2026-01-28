import { NextResponse } from 'next/server'
import { getDrafts } from '@/lib/store'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const drafts = getDrafts()
  const idx = drafts.findIndex((d) => d.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  drafts[idx].status = 'rejected'
  drafts[idx].rejectedAt = new Date().toISOString()
  if (body.note) drafts[idx].rejectionNote = body.note
  return NextResponse.json(drafts[idx])
}
