import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.env.HOME || '/Users/gmac', 'clawd/command-center-data/drafts.json')

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const drafts = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
  const idx = drafts.findIndex((d: { id: string }) => d.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  drafts[idx].status = 'approved'
  drafts[idx].approvedAt = new Date().toISOString()
  fs.writeFileSync(DATA_PATH, JSON.stringify(drafts, null, 2))
  return NextResponse.json(drafts[idx])
}
