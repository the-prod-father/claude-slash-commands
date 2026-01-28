import { NextResponse } from 'next/server'
import { getActionItems } from '@/lib/store'

export async function GET() {
  return NextResponse.json(getActionItems())
}
