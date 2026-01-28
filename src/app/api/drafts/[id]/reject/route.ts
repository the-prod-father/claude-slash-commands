import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.env.HOME || '/Users/gmac', 'clawd/command-center-data/drafts.json')

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const drafts = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
  const idx = drafts.findIndex((d: { id: string }) => d.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  drafts[idx].status = 'rejected'
  drafts[idx].rejectedAt = new Date().toISOString()
  if (body.note) drafts[idx].rejectionNote = body.note
  fs.writeFileSync(DATA_PATH, JSON.stringify(drafts, null, 2))
  return NextResponse.json(drafts[idx])
}
