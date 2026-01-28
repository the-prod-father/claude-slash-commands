import { NextResponse } from 'next/server'
import { getDrafts } from '@/lib/store'

export async function GET() {
  return NextResponse.json(getDrafts())
}
