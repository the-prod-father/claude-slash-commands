import { NextResponse } from 'next/server'
import { getActionItems, setActionItems } from '@/lib/store'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const items = getActionItems()
  const idx = items.findIndex(i => i.id === id)
  if (idx === -1) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (body.priority) items[idx].priority = body.priority
  if (body.status) items[idx].status = body.status
  if (body.dueDate) items[idx].dueDate = body.dueDate
  setActionItems(items)
  return NextResponse.json(items[idx])
}
