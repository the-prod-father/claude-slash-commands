import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.env.HOME || '/Users/gmac', 'clawd/command-center-data/tasks.json')

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tasks = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
  const idx = tasks.findIndex((t: { id: string }) => t.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  tasks[idx].status = 'done'
  tasks[idx].completedAt = new Date().toISOString()
  fs.writeFileSync(DATA_PATH, JSON.stringify(tasks, null, 2))
  return NextResponse.json(tasks[idx])
}
