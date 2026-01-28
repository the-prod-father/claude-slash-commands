import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.env.HOME || '/Users/gmac', 'clawd/command-center-data/inbox-status.json')

function readStatus() {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
  } catch {
    return { lastReviewed: null, pendingCount: 0, urgentCount: 0 }
  }
}

export async function GET() {
  return NextResponse.json(readStatus())
}

export async function POST(req: Request) {
  const body = await req.json()
  const status = readStatus()
  if (body.lastReviewed !== undefined) status.lastReviewed = body.lastReviewed
  if (body.pendingCount !== undefined) status.pendingCount = body.pendingCount
  if (body.urgentCount !== undefined) status.urgentCount = body.urgentCount
  fs.writeFileSync(DATA_PATH, JSON.stringify(status, null, 2))
  return NextResponse.json(status)
}
