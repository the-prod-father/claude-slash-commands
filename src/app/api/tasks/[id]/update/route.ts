import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.env.HOME || '/Users/gmac', 'clawd/command-center-data/tasks.json')

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const tasks = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
  const idx = tasks.findIndex((t: { id: string }) => t.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (body.status) tasks[idx].status = body.status
  if (body.priority) tasks[idx].priority = body.priority
  if (body.title) tasks[idx].title = body.title
  fs.writeFileSync(DATA_PATH, JSON.stringify(tasks, null, 2))
  return NextResponse.json(tasks[idx])
}
