import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.env.HOME || '/Users/gmac', 'clawd/command-center-data/activity.json')

function readActivity() {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
  } catch {
    return []
  }
}

export async function GET() {
  return NextResponse.json(readActivity())
}

export async function POST(req: Request) {
  const body = await req.json()
  const activity = readActivity()
  const entry = {
    id: `a${Date.now()}`,
    time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    text: body.text,
    icon: body.icon || '📌',
    createdAt: new Date().toISOString(),
  }
  activity.unshift(entry)
  fs.writeFileSync(DATA_PATH, JSON.stringify(activity, null, 2))
  return NextResponse.json(entry)
}
