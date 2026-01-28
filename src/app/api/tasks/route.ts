import { NextResponse } from 'next/server'
import { getTasks } from '@/lib/store'

export async function GET() {
  return NextResponse.json(getTasks())
}
