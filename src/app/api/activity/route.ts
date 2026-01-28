import { NextResponse } from 'next/server'
import { getActivity } from '@/lib/store'

export async function GET() {
  return NextResponse.json(getActivity())
}

export async function POST(req: Request) {
  const body = await req.json()
  const activity = getActivity()
  const entry = {
    id: `a${Date.now()}`,
    time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    text: body.text,
    icon: body.icon || '📌',
    createdAt: new Date().toISOString(),
  }
  activity.unshift(entry)
  return NextResponse.json(entry)
}
