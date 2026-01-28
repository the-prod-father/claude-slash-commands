import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.env.HOME || '/Users/gmac', 'clawd/command-center-data/tasks.json')

function readTasks() {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
  } catch {
    return []
  }
}

export async function GET() {
  return NextResponse.json(readTasks())
}
