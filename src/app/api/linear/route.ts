import { NextResponse } from 'next/server'

interface LinearIssue {
  id: string
  identifier: string
  title: string
  status: string
  statusType: string
  priority: number
  assignee: { name: string; avatarUrl: string | null } | null
  labels: string[]
  updatedAt: string
}

interface GroupedIssues {
  [status: string]: LinearIssue[]
}

let cache: { data: GroupedIssues; ts: number } | null = null
const CACHE_TTL = 5 * 60 * 1000

const QUERY = `
query {
  teams(filter: { key: { eq: "WNU" } }) {
    nodes {
      issues(
        first: 100
        orderBy: updatedAt
        filter: {
          state: { type: { nin: ["canceled"] } }
        }
      ) {
        nodes {
          id
          identifier
          title
          priority
          updatedAt
          state { name type }
          assignee { name avatarUrl }
          labels { nodes { name } }
        }
      }
    }
  }
}
`

const STATUS_ORDER = ['In Progress', 'Todo', 'Backlog', 'Triage']

export async function GET() {
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data)
  }

  try {
    const res = await fetch('https://api.linear.app/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.LINEAR_API_KEY || '',
      },
      body: JSON.stringify({ query: QUERY }),
    })

    const json = await res.json()
    const issues = json?.data?.teams?.nodes?.[0]?.issues?.nodes || []

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const filtered = issues
      .filter((i: any) => {
        if (i.state.type === 'completed') {
          return new Date(i.updatedAt) > sevenDaysAgo
        }
        return true
      })
      .map((i: any): LinearIssue => ({
        id: i.id,
        identifier: i.identifier,
        title: i.title,
        status: i.state.name,
        statusType: i.state.type,
        priority: i.priority,
        assignee: i.assignee ? { name: i.assignee.name, avatarUrl: i.assignee.avatarUrl } : null,
        labels: i.labels?.nodes?.map((l: any) => l.name) || [],
        updatedAt: i.updatedAt,
      }))

    const grouped: GroupedIssues = {}
    for (const status of STATUS_ORDER) {
      grouped[status] = []
    }
    grouped['Done'] = []

    for (const issue of filtered) {
      const bucket = issue.statusType === 'completed' ? 'Done'
        : issue.statusType === 'started' ? 'In Progress'
        : issue.statusType === 'unstarted' ? 'Todo'
        : issue.status === 'Triage' || issue.statusType === 'triage' ? 'Triage'
        : 'Backlog'
      if (!grouped[bucket]) grouped[bucket] = []
      grouped[bucket].push(issue)
    }

    // Sort each group by priority (1=urgent first)
    for (const key of Object.keys(grouped)) {
      grouped[key].sort((a, b) => a.priority - b.priority)
    }

    cache = { data: grouped, ts: Date.now() }
    return NextResponse.json(grouped)
  } catch (err) {
    console.error('Linear API error:', err)
    return NextResponse.json({}, { status: 500 })
  }
}
