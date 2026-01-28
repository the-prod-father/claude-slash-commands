import { NextResponse } from 'next/server'
import { getTasks } from '@/lib/store'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tasks = getTasks()
  const idx = tasks.findIndex((t) => t.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  tasks[idx].status = 'done'
  tasks[idx].completedAt = new Date().toISOString()
  return NextResponse.json(tasks[idx])
}
