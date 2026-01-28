import { NextResponse } from 'next/server'
import { getActionItems, setActionItems } from '@/lib/store'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const items = getActionItems()
  const idx = items.findIndex(i => i.id === id)
  if (idx === -1) return NextResponse.json({ error: 'not found' }, { status: 404 })
  items[idx] = { ...items[idx], status: 'done', completedAt: new Date().toISOString() }
  setActionItems(items)
  return NextResponse.json(items[idx])
}
