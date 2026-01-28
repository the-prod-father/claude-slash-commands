'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'

// ─── Data Types ──────────────────────────────────────────────
interface Task {
  id: string
  title: string
  owner: 'finn' | 'gavin'
  status: 'done' | 'in-progress' | 'pending'
  priority: 'high' | 'medium' | 'low'
  category: string
}

interface Draft {
  id: string
  to: string
  subject: string
  body: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  category: string
}

interface ActivityItem {
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

interface Project {
  name: string
  type: string
  revenue: string
  status: string
  nextAction: string
  color: string
}

interface ReviewItem {
  id: string
  title: string
  priority: 'high' | 'medium'
  type: string
}

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

interface LinearData {
  [status: string]: LinearIssue[]
}

interface ActionItem {
  id: string
  title: string
  source: 'granola' | 'linear' | 'email' | 'slack' | 'imessage'
  sourceDetail: string
  project: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  dueDate: string
  status: 'pending' | 'done'
  assignee: string
  notes: string
  completedAt?: string
}

// ─── Static Data ─────────────────────────────────────────────
const WEATHER = { temp: 34, high: 38, low: 28, condition: 'Partly Cloudy', icon: '⛅' }

interface NBAData {
  record: string
  standing: string
  streak: string
  todayGame: {
    status: 'scheduled' | 'live' | 'final'
    opponent: string
    opponentTricode: string
    home: boolean
    time?: string
    knicksScore?: number
    opponentScore?: number
    period?: number
    clock?: string
    gameStatusText?: string
    won?: boolean
  } | null
  nextGame: { text: string } | null
  isLive: boolean
  error?: boolean
}

const PROJECTS: Project[] = [
  { name: 'Sprout Gifts', type: 'Product', revenue: '$4K project', status: 'Affiliate links LIVE', nextAction: 'Age ranges from Nicolette', color: 'text-pink-400' },
  { name: 'Real Worth', type: 'Product', revenue: '$30/mo MRR', status: 'App Store Pending', nextAction: 'Check review status', color: 'text-purple-400' },
  { name: 'Bucket List Doctor', type: 'Client', revenue: '$1,000/mo', status: 'Active', nextAction: 'Auto-email on new posts', color: 'text-cyan-400' },
  { name: 'Oyster Bay Sites', type: 'Pipeline', revenue: 'TBD', status: 'Pre-demo', nextAction: 'Build demo site', color: 'text-green-400' },
  { name: 'Job Search', type: 'Priority', revenue: 'Bridge income', status: 'Active', nextAction: 'CockroachDB Fri 1/31 @ 10am', color: 'text-orange-400' },
]

const REVIEW_QUEUE: ReviewItem[] = [
  { id: 'r1', title: 'Guidepoint: AI Software invitation', priority: 'high', type: 'Decision' },
  { id: 'r2', title: 'Guidepoint: Comms Recording invitation', priority: 'high', type: 'Decision' },
  { id: 'r3', title: 'LinkedIn DM: Simone Viganò (Principled Intelligence)', priority: 'medium', type: 'Lead' },
  { id: 'r4', title: 'LinkedIn: Global Head CPG @ TCS', priority: 'medium', type: 'Lead' },
]

const RECENT_WINS = [
  { icon: '💬', title: 'Slack Integration LIVE', desc: 'Socket Mode • DMs • Channel monitoring', date: 'Jan 28' },
  { icon: '🪳', title: 'CockroachDB Interview Prepped', desc: 'Full research + voice notes + guide', date: 'Jan 28' },
  { icon: '🐟', title: 'Finn Has a Face', desc: 'Arcane-style avatar • Identity complete', date: 'Jan 28' },
  { icon: '🚀', title: 'Sprout Affiliate Links LIVE', desc: '11 products • Babylist-style UI', date: 'Jan 27' },
]

// ─── Constants ───────────────────────────────────────────────
const SOURCE_FILTERS = [
  { key: 'all', label: 'All', icon: '' },
  { key: 'email', label: 'Email', icon: '📧' },
  { key: 'linear', label: 'Linear', icon: '📋' },
  { key: 'granola', label: 'Granola', icon: '🎙' },
  { key: 'slack', label: 'Slack', icon: '💬' },
  { key: 'imessage', label: 'iMessage', icon: '📱' },
]

const PROJECT_FILTERS = [
  'All', 'Real Worth', 'Sprout Gifts', 'Spirited Hive', 'Job Search',
  'Why Not Us Labs', 'Networking', 'Consulting', 'Oyster Bay',
]

const PROJECT_COLORS: Record<string, string> = {
  'Real Worth': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  'Sprout Gifts': 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  'Spirited Hive': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  'Job Search': 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  'Why Not Us Labs': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  'Networking': 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  'Consulting': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  'Oyster Bay': 'bg-green-500/15 text-green-400 border-green-500/20',
}

const PRIORITY_ORDER: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 }
const PRIORITY_EMOJI: Record<string, string> = { urgent: '🔴', high: '🟠', medium: '🟡', low: '⚪' }
const SOURCE_EMOJI: Record<string, string> = { granola: '🎙', linear: '📋', email: '📧', slack: '💬', imessage: '📱' }

const DONUT_COLORS = {
  done: '#22c55e',
  pending: '#52525b',
  overdue: '#ef4444',
  urgent: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#71717a',
}

// ─── Helpers ─────────────────────────────────────────────────
function formatDueDate(dateStr: string): { label: string; isOverdue: boolean; color: string } {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dateStr + 'T00:00:00')
  const diff = Math.floor((due.getTime() - today.getTime()) / 86400000)
  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, isOverdue: true, color: 'text-red-400' }
  if (diff === 0) return { label: 'Today', isOverdue: false, color: 'text-amber-400' }
  if (diff === 1) return { label: 'Tomorrow', isOverdue: false, color: 'text-yellow-400' }
  if (diff <= 7) return { label: `${diff}d`, isOverdue: false, color: 'text-zinc-400' }
  return { label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), isOverdue: false, color: 'text-zinc-500' }
}

// ─── Components ──────────────────────────────────────────────

function SectionHeader({ children, icon, badge }: { children: React.ReactNode; icon: string; badge?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="text-lg">{icon}</span>
      <h2 className="text-[15px] font-semibold tracking-tight text-white/90">{children}</h2>
      {badge && <div className="ml-auto">{badge}</div>}
    </div>
  )
}

function PriorityDot({ priority }: { priority: string }) {
  const color = priority === 'high' ? 'bg-red-400' : priority === 'medium' ? 'bg-amber-400' : 'bg-zinc-500'
  return <span className={`w-1.5 h-1.5 rounded-full ${color} flex-shrink-0`} />
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'done': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'in-progress': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    'pending': 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  }
  const labels: Record<string, string> = {
    'done': '✓ Done',
    'in-progress': '◉ Active',
    'pending': '○ Pending',
  }
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${styles[status] || styles.pending}`}>
      {labels[status] || status}
    </span>
  )
}

function CategoryBadge({ category }: { category: string }) {
  const styles: Record<string, string> = {
    'job-search': 'text-orange-400 bg-orange-500/10 border-orange-500/15',
    'networking': 'text-purple-400 bg-purple-500/10 border-purple-500/15',
    'consulting': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/15',
  }
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${styles[category] || 'text-zinc-400 bg-zinc-500/10 border-zinc-500/15'}`}>
      {category}
    </span>
  )
}

function InboxDraftCard({ draft, onSend, onSave, onDelete }: {
  draft: Draft
  onSend: (id: string, body: string) => void
  onSave: (id: string) => void
  onDelete: (id: string) => void
}) {
  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const [editBody, setEditBody] = useState(draft.body)
  const [status, setStatus] = useState<'idle' | 'sent' | 'saved' | 'deleted'>('idle')

  if (status === 'sent') {
    return (
      <div className="glass p-5 border-emerald-500/20 bg-emerald-950/10 transition-all duration-500 animate-fade-slide-out">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-400">Sent ✓</p>
            <p className="text-xs text-zinc-500">{draft.subject}</p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'saved') {
    return (
      <div className="glass p-5 border-cyan-500/20 bg-cyan-950/10 transition-all duration-500">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <span className="text-cyan-400 text-sm">💾</span>
          </div>
          <div>
            <p className="text-sm font-medium text-cyan-400">Saved for later</p>
            <p className="text-xs text-zinc-500">{draft.subject}</p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'deleted') {
    return (
      <div className="glass p-5 border-red-500/20 bg-red-950/10 transition-all duration-500 animate-fade-slide-out">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-red-400 text-sm">🗑</span>
          </div>
          <div>
            <p className="text-sm font-medium text-red-400">Deleted</p>
            <p className="text-xs text-zinc-500">{draft.subject}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass p-5 hover:border-white/[0.08] transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <CategoryBadge category={draft.category} />
            <span className="text-[10px] text-zinc-600 font-mono">
              {new Date(draft.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
            </span>
          </div>
          <p className="text-sm font-medium text-white/90 mb-0.5 truncate">{draft.subject}</p>
          <p className="text-xs text-zinc-500">To: {draft.to}</p>
        </div>
      </div>
      {mode === 'edit' ? (
        <textarea
          value={editBody}
          onChange={(e) => setEditBody(e.target.value)}
          className="w-full bg-white/[0.03] rounded-lg p-3 mb-4 border border-amber-500/20 text-xs text-zinc-300 leading-relaxed focus:outline-none focus:border-amber-500/40 resize-y min-h-[100px] placeholder-zinc-600"
          rows={6}
          autoFocus
        />
      ) : (
        <div className="bg-white/[0.02] rounded-lg p-3 mb-4 border border-white/[0.03]">
          <p className="text-xs text-zinc-400 whitespace-pre-line leading-relaxed">{draft.body}</p>
        </div>
      )}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => { setStatus('sent'); onSend(draft.id, mode === 'edit' ? editBody : draft.body) }} className="px-4 py-2 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] active:scale-[0.97] transition-all duration-200">✅ Send</button>
        <button onClick={() => { setStatus('saved'); onSave(draft.id) }} className="px-4 py-2 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] active:scale-[0.97] transition-all duration-200">💾 Save</button>
        {mode === 'view' ? (
          <button onClick={() => setMode('edit')} className="px-4 py-2 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] active:scale-[0.97] transition-all duration-200">✏️ Edit</button>
        ) : (
          <button onClick={() => { setMode('view'); setEditBody(draft.body) }} className="px-4 py-2 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 hover:bg-zinc-500/20 active:scale-[0.97] transition-all duration-200">Cancel</button>
        )}
        <button onClick={() => { setStatus('deleted'); onDelete(draft.id) }} className="px-4 py-2 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)] active:scale-[0.97] transition-all duration-200 ml-auto">🗑 Delete</button>
      </div>
    </div>
  )
}

// ─── Action Item Row ─────────────────────────────────────────
function ActionItemRow({ item, onComplete }: { item: ActionItem; onComplete: (id: string) => void }) {
  const [completing, setCompleting] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const isDone = item.status === 'done' || justCompleted
  const due = formatDueDate(item.dueDate)

  const handleComplete = () => {
    if (isDone || completing) return
    setCompleting(true)
    setJustCompleted(true)
    onComplete(item.id)
    setTimeout(() => setCompleting(false), 500)
  }

  const projectStyle = PROJECT_COLORS[item.project] || 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20'

  return (
    <div className={`flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-500 group ${
      isDone ? 'opacity-40' : due.isOverdue ? 'bg-red-500/[0.04] hover:bg-red-500/[0.07]' : 'hover:bg-white/[0.03]'
    }`}>
      <button
        onClick={handleComplete}
        disabled={isDone}
        className={`w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
          isDone
            ? 'border-emerald-500/40 bg-emerald-500/20'
            : 'border-zinc-600 hover:border-emerald-400 hover:bg-emerald-500/10 cursor-pointer'
        }`}
      >
        {isDone && (
          <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <span className="text-sm flex-shrink-0">{PRIORITY_EMOJI[item.priority]}</span>
      <span className="text-xs flex-shrink-0 opacity-60" title={item.source}>{SOURCE_EMOJI[item.source]}</span>
      <span className={`text-sm flex-1 min-w-0 truncate transition-all duration-500 ${isDone ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>
        {item.title}
      </span>
      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium hidden sm:inline-block ${projectStyle}`}>
        {item.project}
      </span>
      <span className={`text-[11px] font-mono flex-shrink-0 ${due.color}`}>
        {isDone ? '✓' : due.label}
      </span>
    </div>
  )
}

// ─── Donut Chart ─────────────────────────────────────────────
function DonutChart({ segments, size = 120, strokeWidth = 14, centerLabel, centerSub }: {
  segments: { value: number; color: string; label: string }[]
  size?: number
  strokeWidth?: number
  centerLabel?: string
  centerSub?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  if (total === 0) return null

  let offset = 0
  const paths = segments.filter(s => s.value > 0).map((seg, i) => {
    const pct = seg.value / total
    const dashLen = pct * circumference
    const dashOffset = -offset * circumference
    offset += pct
    return (
      <circle
        key={i}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={seg.color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dashLen} ${circumference - dashLen}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
        style={{ filter: `drop-shadow(0 0 6px ${seg.color}40)` }}
      />
    )
  })

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeWidth} />
      {paths}
      {(centerLabel || centerSub) && (
        <g className="transform rotate-90" style={{ transformOrigin: 'center' }}>
          {centerLabel && <text x="50%" y={centerSub ? '46%' : '52%'} textAnchor="middle" dominantBaseline="middle" className="fill-white text-xl font-bold" style={{ fontSize: size > 100 ? '22px' : '14px' }}>{centerLabel}</text>}
          {centerSub && <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle" className="fill-zinc-500 text-[10px]">{centerSub}</text>}
        </g>
      )}
    </svg>
  )
}

// ─── Horizontal Bar Chart ────────────────────────────────────
function HBarChart({ data, colorMap }: { data: { label: string; value: number; icon?: string }[]; colorMap?: Record<string, string> }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="space-y-2">
      {data.map(d => (
        <div key={d.label} className="flex items-center gap-2">
          {d.icon && <span className="text-xs w-4 flex-shrink-0">{d.icon}</span>}
          <span className="text-[11px] text-zinc-400 w-20 truncate flex-shrink-0">{d.label}</span>
          <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: colorMap?.[d.label] || 'rgba(34, 211, 238, 0.6)',
              }}
            />
          </div>
          <span className="text-[11px] text-zinc-500 font-mono w-5 text-right flex-shrink-0">{d.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Action Items Dashboard (Right Side) ─────────────────────
function ActionItemsDashboard({ items }: { items: ActionItem[] }) {
  const total = items.length
  const done = items.filter(i => i.status === 'done').length
  const overdue = items.filter(i => {
    if (i.status === 'done') return false
    const today = new Date(); today.setHours(0,0,0,0)
    return new Date(i.dueDate + 'T00:00:00') < today
  }).length
  const pending = total - done - overdue
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  // Priority breakdown
  const byPriority = ['urgent', 'high', 'medium', 'low'].map(p => ({
    label: p.charAt(0).toUpperCase() + p.slice(1),
    value: items.filter(i => i.priority === p && i.status !== 'done').length,
  }))

  // By source
  const sourceData = ['granola', 'linear', 'email', 'slack', 'imessage']
    .map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: items.filter(i => i.source === s).length, icon: SOURCE_EMOJI[s] }))
    .filter(d => d.value > 0)

  // By project
  const projectCounts: Record<string, number> = {}
  items.forEach(i => { projectCounts[i.project] = (projectCounts[i.project] || 0) + 1 })
  const projectData = Object.entries(projectCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }))

  const sourceColors: Record<string, string> = {
    Granola: '#f59e0b', Linear: '#6366f1', Email: '#3b82f6', Slack: '#22c55e', Imessage: '#8b5cf6',
  }
  const projectBarColors: Record<string, string> = {
    'Real Worth': '#a855f7', 'Sprout Gifts': '#ec4899', 'Spirited Hive': '#f59e0b',
    'Job Search': '#f97316', 'Why Not Us Labs': '#22d3ee', 'Networking': '#6366f1',
    'Consulting': '#10b981', 'Oyster Bay': '#22c55e',
  }

  return (
    <div className="space-y-5">
      {/* Main donut */}
      <div className="glass p-5 flex flex-col items-center">
        <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 mb-3">Completion</p>
        <DonutChart
          size={130}
          strokeWidth={16}
          centerLabel={`${pct}%`}
          centerSub={`${done}/${total}`}
          segments={[
            { value: done, color: DONUT_COLORS.done, label: 'Done' },
            { value: pending, color: DONUT_COLORS.pending, label: 'Pending' },
            { value: overdue, color: DONUT_COLORS.overdue, label: 'Overdue' },
          ]}
        />
        <div className="flex gap-4 mt-3">
          {[{ c: DONUT_COLORS.done, l: 'Done', v: done }, { c: DONUT_COLORS.pending, l: 'Pending', v: pending }, { c: DONUT_COLORS.overdue, l: 'Overdue', v: overdue }].map(x => (
            <div key={x.l} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: x.c }} />
              <span className="text-[10px] text-zinc-500">{x.l} ({x.v})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Priority donut */}
      <div className="glass p-5">
        <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 mb-3">Priority Breakdown</p>
        <div className="flex items-center gap-4">
          <DonutChart
            size={80}
            strokeWidth={10}
            segments={byPriority.map(p => ({
              value: p.value,
              color: DONUT_COLORS[p.label.toLowerCase() as keyof typeof DONUT_COLORS] || DONUT_COLORS.low,
              label: p.label,
            }))}
          />
          <div className="flex-1 space-y-1.5">
            {byPriority.map(p => (
              <div key={p.label} className="flex items-center gap-2">
                <span className="text-xs">{PRIORITY_EMOJI[p.label.toLowerCase()]}</span>
                <span className="text-[11px] text-zinc-400 flex-1">{p.label}</span>
                <span className="text-[11px] text-zinc-500 font-mono">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* By Source */}
      <div className="glass p-5">
        <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 mb-3">By Source</p>
        <HBarChart data={sourceData} colorMap={sourceColors} />
      </div>

      {/* By Project */}
      <div className="glass p-5">
        <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 mb-3">By Project</p>
        <HBarChart data={projectData} colorMap={projectBarColors} />
      </div>
    </div>
  )
}

// ─── Linear Board ────────────────────────────────────────────
const PRIORITY_ICONS: Record<number, string> = { 1: '🔴', 2: '🟠', 3: '🟡', 4: '⚪', 0: '⚪' }
const STATUS_COLORS: Record<string, string> = {
  'In Progress': 'bg-blue-400', 'Todo': 'bg-yellow-400', 'Backlog': 'bg-zinc-500', 'Triage': 'bg-purple-400', 'Done': 'bg-emerald-400',
}

function LinearBoard({ data }: { data: LinearData }) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({ Backlog: true, Triage: true, Done: true })
  const statusOrder = ['In Progress', 'Todo', 'Backlog', 'Triage', 'Done']
  const totalCount = Object.values(data).reduce((s, arr) => s + arr.length, 0)
  const toggle = (s: string) => setCollapsed(prev => ({ ...prev, [s]: !prev[s] }))

  return (
    <section className="fade-up glass p-5 sm:p-6 mb-8">
      <SectionHeader icon="📋" badge={
        <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/15 font-medium">
          WNU · {totalCount} issues
        </span>
      }>
        Linear Board
      </SectionHeader>
      <div className="space-y-3">
        {statusOrder.map(status => {
          const issues = data[status] || []
          if (issues.length === 0) return null
          const isCollapsed = collapsed[status]
          return (
            <div key={status}>
              <button onClick={() => toggle(status)} className="flex items-center gap-2 w-full text-left py-1.5 px-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[status] || 'bg-zinc-500'}`} />
                <span className="text-xs font-medium text-zinc-300">{status}</span>
                <span className="text-[10px] text-zinc-600 bg-white/[0.04] px-1.5 py-0.5 rounded-full">{issues.length}</span>
                <svg className={`w-3 h-3 text-zinc-600 ml-auto transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {!isCollapsed && (
                <div className="mt-1 space-y-0">
                  {issues.map(issue => (
                    <a key={issue.id} href={`https://linear.app/why-not-us-labs/issue/${issue.identifier}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 py-1.5 px-3 rounded-lg hover:bg-white/[0.03] transition-colors group">
                      <span className="text-xs flex-shrink-0">{PRIORITY_ICONS[issue.priority] || '⚪'}</span>
                      <span className="text-[11px] font-mono text-zinc-500 flex-shrink-0 w-[52px]">{issue.identifier}</span>
                      <span className="text-sm text-zinc-300 flex-1 truncate group-hover:text-white transition-colors">{issue.title}</span>
                      {issue.assignee && <span className="text-[10px] text-zinc-600 hidden sm:block flex-shrink-0">{issue.assignee.name}</span>}
                      <span className="text-[10px] text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">↗</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ─── Main Page ───────────────────────────────────────────────
export default function Dashboard() {
  const [dateStr, setDateStr] = useState('')
  const [timeStr, setTimeStr] = useState('')
  const [daysUntilEvie, setDaysUntilEvie] = useState(0)
  const [nba, setNba] = useState<NBAData | null>(null)
  const [nbaLoading, setNbaLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [inboxStatus, setInboxStatus] = useState<InboxStatus>({ lastReviewed: null, pendingCount: 0, urgentCount: 0 })
  const [lastReviewedAgo, setLastReviewedAgo] = useState('…')
  const [inboxExpanded, setInboxExpanded] = useState(false)
  const [inboxDrafts, setInboxDrafts] = useState<Draft[]>([])
  const [inboxDraftsLoaded, setInboxDraftsLoaded] = useState(false)
  const [sentCount, setSentCount] = useState(0)
  const [linearData, setLinearData] = useState<LinearData>({})
  const [linearLoading, setLinearLoading] = useState(true)

  // Action items state
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [sourceFilter, setSourceFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('All')
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'source'>('dueDate')
  const [chartsCollapsed, setChartsCollapsed] = useState(false)

  const fetchAll = useCallback(async () => {
    const [tasksRes, draftsRes, activityRes, inboxRes] = await Promise.all([
      fetch('/api/tasks').then(r => r.json()).catch(() => []),
      fetch('/api/drafts').then(r => r.json()).catch(() => []),
      fetch('/api/activity').then(r => r.json()).catch(() => []),
      fetch('/api/inbox-status').then(r => r.json()).catch(() => ({ lastReviewed: null, pendingCount: 0, urgentCount: 0 })),
    ])
    setTasks(tasksRes)
    setDrafts(draftsRes)
    setActivity(activityRes)
    setInboxStatus(inboxRes)
  }, [])

  useEffect(() => {
    fetchAll()
    const i = setInterval(fetchAll, 30000)
    return () => clearInterval(i)
  }, [fetchAll])

  // Fetch action items
  useEffect(() => {
    const fetchAI = async () => {
      try {
        const res = await fetch('/api/action-items')
        const data = await res.json()
        setActionItems(data)
      } catch { /* ignore */ }
    }
    fetchAI()
    const i = setInterval(fetchAI, 60000)
    return () => clearInterval(i)
  }, [])

  useEffect(() => {
    const fetchLinear = async () => {
      try {
        const res = await fetch('/api/linear')
        const data = await res.json()
        setLinearData(data)
      } catch { /* ignore */ }
      finally { setLinearLoading(false) }
    }
    fetchLinear()
    const i = setInterval(fetchLinear, 300000)
    return () => clearInterval(i)
  }, [])

  useEffect(() => {
    const fetchNBA = async () => {
      try {
        const res = await fetch('/api/nba')
        const data = await res.json()
        setNba(data)
      } catch {
        setNba({ record: '', standing: '', streak: '', todayGame: null, nextGame: null, isLive: false, error: true })
      } finally { setNbaLoading(false) }
    }
    fetchNBA()
    const interval = setInterval(fetchNBA, nba?.isLive ? 30000 : 300000)
    return () => clearInterval(interval)
  }, [nba?.isLive])

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }))
      setTimeStr(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }))
      const evie = new Date('2026-06-30')
      setDaysUntilEvie(Math.ceil((evie.getTime() - now.getTime()) / 86400000))
      if (inboxStatus.lastReviewed) {
        const mins = Math.round((now.getTime() - new Date(inboxStatus.lastReviewed).getTime()) / 60000)
        if (mins < 1) setLastReviewedAgo('just now')
        else if (mins < 60) setLastReviewedAgo(`${mins} min ago`)
        else setLastReviewedAgo(`${Math.round(mins / 60)}h ago`)
      }
    }
    update()
    const i = setInterval(update, 30000)
    return () => clearInterval(i)
  }, [inboxStatus.lastReviewed])

  // Filtered & sorted action items
  const filteredItems = useMemo(() => {
    let items = [...actionItems]
    if (sourceFilter !== 'all') items = items.filter(i => i.source === sourceFilter)
    if (projectFilter !== 'All') items = items.filter(i => i.project === projectFilter)

    // Sort
    items.sort((a, b) => {
      // Completed items always last
      if (a.status === 'done' && b.status !== 'done') return 1
      if (b.status === 'done' && a.status !== 'done') return -1

      // Overdue items first (among non-done)
      const today = new Date(); today.setHours(0,0,0,0)
      const aOverdue = a.status !== 'done' && new Date(a.dueDate + 'T00:00:00') < today
      const bOverdue = b.status !== 'done' && new Date(b.dueDate + 'T00:00:00') < today
      if (aOverdue && !bOverdue) return -1
      if (bOverdue && !aOverdue) return 1

      if (sortBy === 'dueDate') return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      if (sortBy === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      return a.source.localeCompare(b.source)
    })
    return items
  }, [actionItems, sourceFilter, projectFilter, sortBy])

  const handleCompleteTask = async (id: string) => {
    await fetch(`/api/tasks/${id}/complete`, { method: 'POST' })
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'done' } : t))
  }

  const handleCompleteActionItem = async (id: string) => {
    await fetch(`/api/action-items/${id}/complete`, { method: 'POST' })
    setActionItems(prev => prev.map(i => i.id === id ? { ...i, status: 'done', completedAt: new Date().toISOString() } : i))
  }

  const handleToggleInbox = async () => {
    const next = !inboxExpanded
    setInboxExpanded(next)
    if (next && !inboxDraftsLoaded) {
      const res = await fetch('/api/drafts').then(r => r.json()).catch(() => [])
      setInboxDrafts(res.filter((d: Draft) => d.status === 'pending'))
      setInboxDraftsLoaded(true)
    }
  }

  const handleSendDraft = async (id: string, _body: string) => {
    await fetch(`/api/drafts/${id}/send`, { method: 'POST' })
    setSentCount(c => c + 1)
    setInboxStatus(prev => ({ ...prev, pendingCount: Math.max(0, prev.pendingCount - 1) }))
    setTimeout(() => setInboxDrafts(prev => prev.filter(d => d.id !== id)), 1500)
  }

  const handleSaveDraft = (_id: string) => {
    setTimeout(() => setInboxDrafts(prev => prev.filter(d => d.id !== _id)), 1500)
  }

  const handleDeleteDraft = async (id: string) => {
    await fetch(`/api/drafts/${id}/reject`, { method: 'POST' })
    setInboxStatus(prev => ({ ...prev, pendingCount: Math.max(0, prev.pendingCount - 1) }))
    setTimeout(() => setInboxDrafts(prev => prev.filter(d => d.id !== id)), 1500)
  }

  const finnTasks = tasks.filter(t => t.owner === 'finn')
  const gavinTasks = tasks.filter(t => t.owner === 'gavin')
  const finnDone = finnTasks.filter(t => t.status === 'done').length
  const gavinDone = gavinTasks.filter(t => t.status === 'done').length
  const mrr = 1030
  const arr = mrr * 12
  const oneTime = 17000

  const pendingCount = filteredItems.filter(i => i.status !== 'done').length
  const overdueCount = filteredItems.filter(i => {
    if (i.status === 'done') return false
    const today = new Date(); today.setHours(0,0,0,0)
    return new Date(i.dueDate + 'T00:00:00') < today
  }).length

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

      {/* ═══ FIRST FOLD: Header, Weather, Knicks, Inbox ═══ */}

      {/* TOP BAR */}
      <header className="fade-up fade-up-1 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2.5">
              <span className="text-cyan-400">🐟</span>
              <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Command Center</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-1">{dateStr}</p>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <p className="text-xl font-light tracking-wide text-white/80 font-mono">{timeStr}</p>
            <p className="text-xs text-purple-400 font-medium">{daysUntilEvie} days until Evie 💜</p>
            <Link href="/access" className="text-[11px] text-zinc-500 hover:text-cyan-400 transition-colors mt-1">Access Inventory →</Link>
          </div>
        </div>
      </header>

      {/* WIDGETS ROW */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {/* Weather */}
        <div className="fade-up fade-up-2 glass p-5 bg-gradient-to-br from-blue-950/30 to-transparent">
          <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 mb-3">Oyster Bay Cove, NY</p>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extralight tracking-tighter text-white">{WEATHER.temp}°</span>
              </div>
              <p className="text-sm text-zinc-400 mt-1">{WEATHER.condition}</p>
              <p className="text-xs text-zinc-600 mt-0.5">H:{WEATHER.high}° L:{WEATHER.low}°</p>
            </div>
            <span className="text-5xl opacity-80">{WEATHER.icon}</span>
          </div>
        </div>

        {/* Knicks */}
        <div className="fade-up fade-up-3 glass p-5 bg-gradient-to-br from-orange-950/20 to-blue-950/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🏀</span>
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-orange-400">NEW YORK KNICKS</p>
                <p className="text-[10px] text-zinc-500">{nbaLoading ? '...' : nba?.standing || ''}</p>
              </div>
              {nba?.isLive && (
                <span className="flex items-center gap-1.5 ml-2 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />LIVE
                </span>
              )}
            </div>
            <div className="text-right">
              {nbaLoading ? (
                <div className="h-8 w-16 bg-white/[0.05] rounded animate-pulse" />
              ) : (
                <>
                  <p className="text-3xl font-extralight tracking-tight text-white font-mono">{nba?.record || '—'}</p>
                  {nba?.streak && <p className="text-xs text-emerald-400 font-medium">🔥 {nba.streak}</p>}
                </>
              )}
            </div>
          </div>
          {nbaLoading ? (
            <div className="h-10 bg-white/[0.03] rounded-lg animate-pulse" />
          ) : nba?.todayGame ? (
            nba.todayGame.status === 'live' ? (
              <div className="bg-white/[0.03] rounded-lg px-4 py-3 border border-red-500/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-widest text-red-400/80">{nba.todayGame.gameStatusText || `Q${nba.todayGame.period}`}</span>
                  {nba.todayGame.clock && <span className="text-[10px] text-zinc-500 font-mono">{nba.todayGame.clock}</span>}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1"><p className="text-xs font-bold text-orange-400">NYK</p><p className="text-2xl font-bold text-white">{nba.todayGame.knicksScore}</p></div>
                  <span className="text-zinc-600 text-xs px-3">vs</span>
                  <div className="text-center flex-1"><p className="text-xs font-bold text-zinc-400">{nba.todayGame.opponentTricode}</p><p className="text-2xl font-bold text-white/70">{nba.todayGame.opponentScore}</p></div>
                </div>
              </div>
            ) : nba.todayGame.status === 'final' ? (
              <div className="bg-white/[0.03] rounded-lg px-4 py-3 border border-white/[0.04]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">Final</span>
                  <span className={`text-[10px] font-bold ${nba.todayGame.won ? 'text-emerald-400' : 'text-red-400'}`}>{nba.todayGame.won ? '✓ WIN' : '✗ LOSS'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1"><p className="text-xs font-bold text-orange-400">NYK</p><p className="text-2xl font-bold text-white">{nba.todayGame.knicksScore}</p></div>
                  <span className="text-zinc-600 text-xs px-3">vs</span>
                  <div className="text-center flex-1"><p className="text-xs font-bold text-zinc-400">{nba.todayGame.opponentTricode}</p><p className="text-2xl font-bold text-white/70">{nba.todayGame.opponentScore}</p></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.04]">
                <span className="text-zinc-500">Today</span>
                <span className="text-white/80">{nba.todayGame.home ? 'vs' : '@'} {nba.todayGame.opponentTricode}</span>
                <span className="text-zinc-500">{nba.todayGame.time || nba.todayGame.gameStatusText}</span>
              </div>
            )
          ) : nba?.nextGame ? (
            <div className="flex items-center justify-center text-xs bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.04]">
              <span className="text-zinc-500">{nba.nextGame.text}</span>
            </div>
          ) : nba?.error ? (
            <div className="flex items-center justify-center text-xs bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.04]">
              <span className="text-zinc-500">Stats loading...</span>
            </div>
          ) : null}
        </div>
      </section>

      {/* INBOX STATUS */}
      <div className="fade-up fade-up-3 mb-8">
        <button onClick={handleToggleInbox} className="w-full glass px-5 py-3 flex items-center gap-4 text-xs cursor-pointer hover:border-white/[0.1] transition-all duration-300 group">
          <span className={`w-2 h-2 rounded-full pulse-dot ${inboxStatus.urgentCount > 0 ? 'bg-red-400' : 'bg-emerald-400'}`} />
          <span className="text-zinc-400">Inbox</span>
          <span className="text-zinc-300">Last reviewed: {lastReviewedAgo}</span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-zinc-300 hidden sm:inline">{Math.max(0, inboxStatus.pendingCount - sentCount)} drafts pending</span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className={`hidden sm:inline ${inboxStatus.urgentCount > 0 ? 'text-red-400 font-medium' : 'text-zinc-300'}`}>{inboxStatus.urgentCount} urgent</span>
          <svg className={`w-4 h-4 text-zinc-500 ml-auto transition-transform duration-300 ${inboxExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${inboxExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          {inboxDrafts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {inboxDrafts.map(draft => (
                <InboxDraftCard key={draft.id} draft={draft} onSend={handleSendDraft} onSave={handleSaveDraft} onDelete={handleDeleteDraft} />
              ))}
            </div>
          ) : inboxDraftsLoaded ? (
            <div className="glass p-8 text-center">
              <p className="text-2xl mb-2">✨</p>
              <p className="text-sm text-zinc-400">All caught up</p>
            </div>
          ) : (
            <div className="glass p-6 text-center">
              <p className="text-xs text-zinc-500">Loading drafts…</p>
            </div>
          )}
        </div>
      </div>

      {/* ═══ SECOND FOLD: Unified Action Items Hub ═══ */}
      <section className="fade-up fade-up-4 mb-8">
        <SectionHeader icon="🎯" badge={
          <div className="flex items-center gap-2">
            {overdueCount > 0 && (
              <span className="text-[10px] text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/15 font-medium">
                {overdueCount} overdue
              </span>
            )}
            <span className="text-[10px] text-zinc-400 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.06] font-medium">
              {pendingCount} pending
            </span>
          </div>
        }>
          Action Items
        </SectionHeader>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT: List (60%) */}
          <div className="flex-1 lg:w-[60%] min-w-0">
            {/* Filter bar: Source */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {SOURCE_FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setSourceFilter(f.key)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all duration-200 ${
                    sourceFilter === f.key
                      ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]'
                      : 'bg-white/[0.03] text-zinc-500 border-white/[0.06] hover:bg-white/[0.05] hover:text-zinc-300'
                  }`}
                >
                  {f.icon && <span className="mr-1">{f.icon}</span>}{f.label}
                </button>
              ))}
            </div>

            {/* Filter bar: Project */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {PROJECT_FILTERS.map(p => (
                <button
                  key={p}
                  onClick={() => setProjectFilter(p)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all duration-200 ${
                    projectFilter === p
                      ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                      : 'bg-white/[0.02] text-zinc-600 border-white/[0.04] hover:bg-white/[0.04] hover:text-zinc-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Sort</span>
              {(['dueDate', 'priority', 'source'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`text-[10px] px-2 py-0.5 rounded-full transition-all ${
                    sortBy === s ? 'text-white bg-white/[0.08]' : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  {s === 'dueDate' ? 'Due Date' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {/* Items list */}
            <div className="glass p-3 sm:p-4 max-h-[600px] overflow-y-auto">
              <div className="space-y-0.5">
                {filteredItems.map(item => (
                  <ActionItemRow key={item.id} item={item} onComplete={handleCompleteActionItem} />
                ))}
                {filteredItems.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-zinc-600 text-sm">No items match filters</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Charts (40%) */}
          <div className="lg:w-[40%] flex-shrink-0">
            {/* Mobile collapse toggle */}
            <button
              onClick={() => setChartsCollapsed(!chartsCollapsed)}
              className="lg:hidden w-full glass px-4 py-2.5 flex items-center justify-between text-xs mb-3"
            >
              <span className="text-zinc-400">📊 Dashboard</span>
              <svg className={`w-4 h-4 text-zinc-500 transition-transform ${chartsCollapsed ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`${chartsCollapsed ? 'hidden' : 'block'} lg:block`}>
              <ActionItemsDashboard items={filteredItems} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ THIRD FOLD: Linear Board + Existing Sections ═══ */}

      {/* LINEAR BOARD */}
      {linearLoading ? (
        <div className="fade-up glass p-6 mb-8">
          <div className="h-6 w-48 bg-white/[0.05] rounded animate-pulse" />
        </div>
      ) : Object.keys(linearData).length > 0 && (
        <LinearBoard data={linearData} />
      )}

      {/* FINN ACTIVITY FEED */}
      <section className="fade-up glass p-5 sm:p-6 mb-8 glow-cyan">
        <SectionHeader icon="🐟" badge={
          <span className="text-[10px] text-cyan-400/80 bg-cyan-500/10 border border-cyan-500/15 px-2.5 py-1 rounded-full font-medium">LIVE</span>
        }>
          Finn Activity Feed
        </SectionHeader>
        <div className="space-y-1">
          {activity.map((item, i) => (
            <div key={item.id || i} className="slide-in flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors" style={{ animationDelay: `${0.3 + i * 0.06}s` }}>
              <span className="text-sm mt-0.5">{item.icon}</span>
              <span className="text-sm text-zinc-300 flex-1">{item.text}</span>
              <span className="text-[10px] text-zinc-600 font-mono whitespace-nowrap">{item.time}</span>
            </div>
          ))}
          {activity.length === 0 && <p className="text-xs text-zinc-600 italic px-3 py-2">No activity yet…</p>}
        </div>
      </section>

      {/* ACTION ITEMS (old Finn/Gavin tasks) */}
      <section className="fade-up grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="glass p-5 sm:p-6">
          <SectionHeader icon="🐟" badge={
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15">{finnDone}/{finnTasks.length}</span>
          }>Finn&apos;s Tasks</SectionHeader>
          <div className="space-y-0.5">
            {finnTasks.map(task => (
              <div key={task.id} className={`flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-all duration-500 group ${task.status === 'done' ? 'opacity-60' : ''}`}>
                <button onClick={() => handleCompleteTask(task.id)} disabled={task.status === 'done'} className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${task.status === 'done' ? 'border-emerald-500/40 bg-emerald-500/20' : 'border-zinc-600 hover:border-emerald-400 hover:bg-emerald-500/10 cursor-pointer'}`}>
                  {task.status === 'done' && <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </button>
                <PriorityDot priority={task.priority} />
                <span className={`text-sm flex-1 transition-all duration-500 ${task.status === 'done' ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>{task.title}</span>
                <span className="text-[10px] text-zinc-600 hidden sm:block">{task.category}</span>
                <StatusBadge status={task.status} />
              </div>
            ))}
            {finnTasks.length === 0 && <p className="text-xs text-zinc-600 italic px-3 py-2">Loading…</p>}
          </div>
        </div>
        <div className="glass p-5 sm:p-6">
          <SectionHeader icon="👤" badge={
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15">{gavinDone}/{gavinTasks.length}</span>
          }>Gavin&apos;s Tasks</SectionHeader>
          <div className="space-y-0.5">
            {gavinTasks.map(task => (
              <div key={task.id} className={`flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-all duration-500 group ${task.status === 'done' ? 'opacity-60' : ''}`}>
                <button onClick={() => handleCompleteTask(task.id)} disabled={task.status === 'done'} className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${task.status === 'done' ? 'border-emerald-500/40 bg-emerald-500/20' : 'border-zinc-600 hover:border-emerald-400 hover:bg-emerald-500/10 cursor-pointer'}`}>
                  {task.status === 'done' && <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </button>
                <PriorityDot priority={task.priority} />
                <span className={`text-sm flex-1 transition-all duration-500 ${task.status === 'done' ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>{task.title}</span>
                <span className="text-[10px] text-zinc-600 hidden sm:block">{task.category}</span>
                <StatusBadge status={task.status} />
              </div>
            ))}
            {gavinTasks.length === 0 && <p className="text-xs text-zinc-600 italic px-3 py-2">Loading…</p>}
          </div>
        </div>
      </section>

      {/* REVIEW QUEUE */}
      <section className="fade-up glass p-5 sm:p-6 mb-8">
        <SectionHeader icon="⏳" badge={
          <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/15">{REVIEW_QUEUE.length} pending</span>
        }>Review Queue</SectionHeader>
        <div className="space-y-0.5">
          {REVIEW_QUEUE.map(item => (
            <div key={item.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors">
              <PriorityDot priority={item.priority} />
              <span className="text-sm text-zinc-200 flex-1">{item.title}</span>
              <span className="text-[10px] text-amber-400/60 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/10">{item.type}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ACTIVE PROJECTS */}
      <section className="fade-up mb-8">
        <SectionHeader icon="⚡">Active Projects</SectionHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROJECTS.map((project, i) => (
            <div key={i} className="glass p-5">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-semibold ${project.color}`}>{project.name}</span>
                <span className="text-[10px] text-zinc-500 bg-white/[0.03] px-2 py-0.5 rounded-full border border-white/[0.05]">{project.type}</span>
              </div>
              <p className="text-lg font-light text-white/80">{project.revenue}</p>
              <p className="text-xs text-zinc-500 mt-1">{project.status}</p>
              <div className="mt-3 pt-3 border-t border-white/[0.04]">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-0.5">Next</p>
                <p className="text-xs text-zinc-400">{project.nextAction}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REVENUE & GOALS */}
      <section className="fade-up glass p-5 sm:p-6 mb-8 glow-green">
        <SectionHeader icon="💰">Revenue &amp; Goals</SectionHeader>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
          <div><p className="text-3xl font-extralight text-emerald-400">${mrr.toLocaleString()}</p><p className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1">Monthly MRR</p><p className="text-[10px] text-zinc-500 mt-0.5">$30 Stripe + $1K BLD</p></div>
          <div><p className="text-3xl font-extralight text-white/80">${arr.toLocaleString()}</p><p className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1">Current ARR</p></div>
          <div><p className="text-3xl font-extralight text-emerald-400">${(oneTime / 1000).toFixed(0)}K</p><p className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1">One-time received</p></div>
          <div><p className="text-3xl font-extralight text-white/40">${((mrr * 12 + oneTime) / 1000).toFixed(0)}K</p><p className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1">Total earned</p></div>
        </div>
        <div className="space-y-4">
          {[
            { label: '$500K ARR', target: 500000, color: 'from-emerald-500 to-green-400' },
            { label: '$1M ARR', target: 1000000, color: 'from-yellow-500 to-amber-400' },
            { label: '$5M ARR', target: 5000000, color: 'from-purple-500 to-violet-400' },
          ].map((goal) => {
            const pct = (arr / goal.target) * 100
            return (
              <div key={goal.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-500">{goal.label}</span>
                  <span className="text-zinc-400 font-mono">{pct.toFixed(2)}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${goal.color} progress-bar rounded-full`} style={{ width: `${Math.max(pct, 0.5)}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* RECENT WINS */}
      <section className="fade-up glass p-5 sm:p-6 mb-8 bg-gradient-to-br from-emerald-950/10 to-transparent">
        <SectionHeader icon="🏆">Recent Wins</SectionHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {RECENT_WINS.map((win, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:border-emerald-500/10 transition-colors">
              <span className="text-2xl">{win.icon}</span>
              <div>
                <p className="text-sm font-medium text-emerald-400">{win.title}</p>
                <p className="text-xs text-zinc-500">{win.desc}</p>
                <p className="text-[10px] text-zinc-600 mt-0.5">{win.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="fade-up text-center py-8">
        <p className="text-xs text-zinc-600">Command Center v3.0 &nbsp;|&nbsp; Gavin + Finn 🐟 &nbsp;|&nbsp; Why Not Us?</p>
      </footer>
    </main>
  )
}
