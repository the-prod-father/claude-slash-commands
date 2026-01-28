// In-memory data store with seed data
// Mutations persist until cold start; use /api/sync to push fresh data

interface Draft {
  id: string
  to: string
  subject: string
  body: string
  status: string
  createdAt: string
  category: string
  approvedAt?: string
  rejectedAt?: string
  rejectionNote?: string
}

interface Task {
  id: string
  title: string
  owner: string
  status: string
  priority: string
  category: string
  completedAt?: string
}

interface ActivityEntry {
  id: string
  time: string
  text: string
  icon: string
  createdAt: string
}

interface InboxStatus {
  lastReviewed: string | null
  pendingCount: number
  urgentCount: number
}

// --- Seed Data ---

const SEED_DRAFTS: Draft[] = [
  {
    "id": "draft-001",
    "to": "careers@cockroachlabs.com",
    "subject": "Re: PM Interview — Rescheduled to Friday 1/31",
    "body": "Hi team,\n\nThank you for the flexibility in rescheduling. I'm confirmed for Friday, January 31st at 10:00 AM ET.\n\nLooking forward to the conversation.\n\nBest,\nGavin McNamara",
    "status": "pending",
    "createdAt": "2026-01-28T14:30:00Z",
    "category": "job-search"
  },
  {
    "id": "draft-002",
    "to": "simone.vigano@principledintelligence.com",
    "subject": "Re: Connecting on AI Strategy",
    "body": "Hi Simone,\n\nThanks for reaching out — I'd love to connect. Your work at Principled Intelligence aligns closely with what we're building at Why Not Us Labs.\n\nWould you be open to a 15-minute call this week? Happy to share what we're working on.\n\nBest,\nGavin",
    "status": "pending",
    "createdAt": "2026-01-28T15:00:00Z",
    "category": "networking"
  },
  {
    "id": "draft-003",
    "to": "guidepoint@surveys.com",
    "subject": "Re: Expert Consultation Invitations",
    "body": "Hi,\n\nI'd be happy to participate in both the AI Software and Communications Recording consultations. Please send over the scheduling details.\n\nBest,\nGavin McNamara",
    "status": "pending",
    "createdAt": "2026-01-28T13:45:00Z",
    "category": "consulting"
  }
]

const SEED_TASKS: Task[] = [
  { "id": "f1", "title": "Slack integration — Socket Mode live", "owner": "finn", "status": "done", "priority": "high", "category": "Integration" },
  { "id": "f2", "title": "CockroachDB interview prep + voice notes", "owner": "finn", "status": "done", "priority": "high", "category": "Job Search" },
  { "id": "f3", "title": "Finn avatar generated (Arcane-style)", "owner": "finn", "status": "done", "priority": "medium", "category": "Identity" },
  { "id": "f4", "title": "#wnu-dev channel summary delivered", "owner": "finn", "status": "done", "priority": "medium", "category": "Comms" },
  { "id": "f5", "title": "Email sweeps (7am + 1pm)", "owner": "finn", "status": "done", "priority": "high", "category": "Recurring" },
  { "id": "f6", "title": "iMessage integration setup", "owner": "finn", "status": "in-progress", "priority": "medium", "category": "Integration" },
  { "id": "f7", "title": "Deep CockroachDB prep for Fri interview", "owner": "finn", "status": "pending", "priority": "high", "category": "Job Search" },
  { "id": "f8", "title": "Oyster Bay demo site build", "owner": "finn", "status": "pending", "priority": "medium", "category": "Project" },
  { "id": "f9", "title": "BLD auto-email on new posts", "owner": "finn", "status": "pending", "priority": "medium", "category": "Project" },
  { "id": "g1", "title": "Gemini API key fixed (removed restrictions)", "owner": "gavin", "status": "done", "priority": "medium", "category": "Dev" },
  { "id": "g2", "title": "CockroachDB interview → Fri 1/31 @ 10am", "owner": "gavin", "status": "done", "priority": "high", "category": "Job Search" },
  { "id": "g3", "title": "Check Real Worth App Store status", "owner": "gavin", "status": "pending", "priority": "high", "category": "Product" },
  { "id": "g4", "title": "LinkedIn DMs — respond to all", "owner": "gavin", "status": "pending", "priority": "medium", "category": "Comms" },
  { "id": "g5", "title": "Sprout age ranges from Nicolette", "owner": "gavin", "status": "pending", "priority": "medium", "category": "Product" }
]

const SEED_ACTIVITY: ActivityEntry[] = [
  { "id": "a0", "time": "4:10 PM", "text": "Email sweep — no urgent replies needed. 2 job alerts flagged (Fusemachines AI PM, BNY VP POM)", "icon": "📧", "createdAt": "2026-01-28T21:10:00Z" },
  { "id": "a1", "time": "3:45 PM", "text": "Command Center Phase 1 live — interactive drafts, live tasks, NBA widget", "icon": "🚀", "createdAt": "2026-01-28T20:45:00Z" },
  { "id": "a2", "time": "2:45 PM", "text": "Command Center redesigned — Jony Ive edition deployed", "icon": "🎨", "createdAt": "2026-01-28T19:45:00Z" },
  { "id": "a3", "time": "1:15 PM", "text": "Inbox reviewed — 3 drafts ready for review", "icon": "📧", "createdAt": "2026-01-28T18:15:00Z" },
  { "id": "a4", "time": "1:00 PM", "text": "Email sweep complete — 12 processed, 0 urgent", "icon": "✉️", "createdAt": "2026-01-28T18:00:00Z" },
  { "id": "a5", "time": "12:30 PM", "text": "#wnu-dev summary delivered to Slack", "icon": "💬", "createdAt": "2026-01-28T17:30:00Z" },
  { "id": "a6", "time": "11:00 AM", "text": "CockroachDB research doc finalized — 4,200 words", "icon": "📋", "createdAt": "2026-01-28T16:00:00Z" },
  { "id": "a7", "time": "10:15 AM", "text": "Calendar checked — no conflicts today", "icon": "📅", "createdAt": "2026-01-28T15:15:00Z" },
  { "id": "a8", "time": "9:30 AM", "text": "LinkedIn DMs scanned — 2 need your response", "icon": "🔗", "createdAt": "2026-01-28T14:30:00Z" },
  { "id": "a9", "time": "7:00 AM", "text": "Morning email sweep — inbox clear", "icon": "🌅", "createdAt": "2026-01-28T12:00:00Z" }
]

const SEED_INBOX_STATUS: InboxStatus = {
  "lastReviewed": "2026-01-28T18:15:00Z",
  "pendingCount": 3,
  "urgentCount": 0
}

// --- Store ---

let drafts: Draft[] = [...SEED_DRAFTS]
let tasks: Task[] = [...SEED_TASKS]
let activity: ActivityEntry[] = [...SEED_ACTIVITY]
let inboxStatus: InboxStatus = { ...SEED_INBOX_STATUS }

export function getDrafts() { return drafts }
export function setDrafts(d: Draft[]) { drafts = d }

export function getTasks() { return tasks }
export function setTasks(t: Task[]) { tasks = t }

export function getActivity() { return activity }
export function setActivity(a: ActivityEntry[]) { activity = a }

export function getInboxStatus() { return inboxStatus }
export function setInboxStatus(s: InboxStatus) { inboxStatus = s }

export function syncAll(data: { drafts?: Draft[]; tasks?: Task[]; activity?: ActivityEntry[]; inboxStatus?: InboxStatus }) {
  if (data.drafts) drafts = data.drafts
  if (data.tasks) tasks = data.tasks
  if (data.activity) activity = data.activity
  if (data.inboxStatus) inboxStatus = data.inboxStatus
}
