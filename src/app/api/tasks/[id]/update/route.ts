import { NextResponse } from 'next/server'
import { getTasks } from '@/lib/store'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const tasks = getTasks()
  const idx = tasks.findIndex((t) => t.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (body.status) tasks[idx].status = body.status
  if (body.priority) tasks[idx].priority = body.priority
  if (body.title) tasks[idx].title = body.title
  return NextResponse.json(tasks[idx])
}
