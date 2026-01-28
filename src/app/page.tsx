'use client'

import { useState, useEffect } from 'react'
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

interface Project {
  name: string
  type: string
  revenue: string
  status: string
  nextAction: string
  color: string
}

interface ActivityItem {
  time: string
  text: string
  icon: string
}

interface ReviewItem {
  id: string
  title: string
  priority: 'high' | 'medium'
  type: string
}

// ─── Hardcoded Data (structured for future API) ─────────────
const WEATHER = { temp: 34, high: 38, low: 28, condition: 'Partly Cloudy', icon: '⛅' }
const KNICKS = { record: '32-17', standing: '3rd in East', streak: 'W4', nextGame: 'Wed 1/29 @ 7:30pm', nextOpponent: 'Miami Heat' }

const FINN_TASKS: Task[] = [
  { id: 'f1', title: 'Slack integration — Socket Mode live', owner: 'finn', status: 'done', priority: 'high', category: 'Integration' },
  { id: 'f2', title: 'CockroachDB interview prep + voice notes', owner: 'finn', status: 'done', priority: 'high', category: 'Job Search' },
  { id: 'f3', title: 'Finn avatar generated (Arcane-style)', owner: 'finn', status: 'done', priority: 'medium', category: 'Identity' },
  { id: 'f4', title: '#wnu-dev channel summary delivered', owner: 'finn', status: 'done', priority: 'medium', category: 'Comms' },
  { id: 'f5', title: 'Email sweeps (7am + 1pm)', owner: 'finn', status: 'done', priority: 'high', category: 'Recurring' },
  { id: 'f6', title: 'iMessage integration setup', owner: 'finn', status: 'in-progress', priority: 'medium', category: 'Integration' },
  { id: 'f7', title: 'Deep CockroachDB prep for Fri interview', owner: 'finn', status: 'pending', priority: 'high', category: 'Job Search' },
  { id: 'f8', title: 'Oyster Bay demo site build', owner: 'finn', status: 'pending', priority: 'medium', category: 'Project' },
  { id: 'f9', title: 'BLD auto-email on new posts', owner: 'finn', status: 'pending', priority: 'medium', category: 'Project' },
]

const GAVIN_TASKS: Task[] = [
  { id: 'g1', title: 'Gemini API key fixed (removed restrictions)', owner: 'gavin', status: 'done', priority: 'medium', category: 'Dev' },
  { id: 'g2', title: 'CockroachDB interview → Fri 1/31 @ 10am', owner: 'gavin', status: 'done', priority: 'high', category: 'Job Search' },
  { id: 'g3', title: 'Check Real Worth App Store status', owner: 'gavin', status: 'pending', priority: 'high', category: 'Product' },
  { id: 'g4', title: 'LinkedIn DMs — respond to all', owner: 'gavin', status: 'pending', priority: 'medium', category: 'Comms' },
  { id: 'g5', title: 'Sprout age ranges from Nicolette', owner: 'gavin', status: 'pending', priority: 'medium', category: 'Product' },
]

const REVIEW_QUEUE: ReviewItem[] = [
  { id: 'r1', title: 'Guidepoint: AI Software invitation', priority: 'high', type: 'Decision' },
  { id: 'r2', title: 'Guidepoint: Comms Recording invitation', priority: 'high', type: 'Decision' },
  { id: 'r3', title: 'LinkedIn DM: Simone Viganò (Principled Intelligence)', priority: 'medium', type: 'Lead' },
  { id: 'r4', title: 'LinkedIn: Global Head CPG @ TCS', priority: 'medium', type: 'Lead' },
]

const ACTIVITY_FEED: ActivityItem[] = [
  { time: '2:45 PM', text: 'Command Center redesigned — Jony Ive edition deployed', icon: '🚀' },
  { time: '1:15 PM', text: 'Inbox reviewed — 3 drafts ready for review', icon: '📧' },
  { time: '1:00 PM', text: 'Email sweep complete — 12 processed, 0 urgent', icon: '✉️' },
  { time: '12:30 PM', text: '#wnu-dev summary delivered to Slack', icon: '💬' },
  { time: '11:00 AM', text: 'CockroachDB research doc finalized — 4,200 words', icon: '📋' },
  { time: '10:15 AM', text: 'Calendar checked — no conflicts today', icon: '📅' },
  { time: '9:30 AM', text: 'LinkedIn DMs scanned — 2 need your response', icon: '🔗' },
  { time: '7:00 AM', text: 'Morning email sweep — inbox clear', icon: '🌅' },
]

const DAILY_RHYTHM = [
  {
    period: 'Morning',
    icon: '🌅',
    time: '7:00 – 11:00 AM',
    finnDid: ['Email sweep — inbox cleared', 'CockroachDB research doc completed', 'LinkedIn DMs scanned'],
    gavinsAttention: ['2 LinkedIn DMs need response'],
    comingUp: [],
  },
  {
    period: 'Midday',
    icon: '☀️',
    time: '11:00 AM – 4:00 PM',
    finnDid: ['#wnu-dev summary posted', '1pm email sweep done', 'Command Center redesigned'],
    gavinsAttention: ['Review Guidepoint invitations', 'Check Real Worth App Store'],
    comingUp: ['Knicks vs Heat @ 7:30pm'],
  },
  {
    period: 'Evening',
    icon: '🌙',
    time: '4:00 – 10:00 PM',
    finnDid: [],
    gavinsAttention: [],
    comingUp: ['9pm email sweep', 'Prep CockroachDB deep-dive for tomorrow'],
  },
]

const PROJECTS: Project[] = [
  { name: 'Sprout Gifts', type: 'Product', revenue: '$4K project', status: 'Affiliate links LIVE', nextAction: 'Age ranges from Nicolette', color: 'text-pink-400' },
  { name: 'Real Worth', type: 'Product', revenue: '$30/mo MRR', status: 'App Store Pending', nextAction: 'Check review status', color: 'text-purple-400' },
  { name: 'Bucket List Doctor', type: 'Client', revenue: '$1,000/mo', status: 'Active', nextAction: 'Auto-email on new posts', color: 'text-cyan-400' },
  { name: 'Oyster Bay Sites', type: 'Pipeline', revenue: 'TBD', status: 'Pre-demo', nextAction: 'Build demo site', color: 'text-green-400' },
  { name: 'Job Search', type: 'Priority', revenue: 'Bridge income', status: 'Active', nextAction: 'CockroachDB Fri 1/31 @ 10am', color: 'text-orange-400' },
]

const RECENT_WINS = [
  { icon: '💬', title: 'Slack Integration LIVE', desc: 'Socket Mode • DMs • Channel monitoring', date: 'Jan 28' },
  { icon: '🪳', title: 'CockroachDB Interview Prepped', desc: 'Full research + voice notes + guide', date: 'Jan 28' },
  { icon: '🐟', title: 'Finn Has a Face', desc: 'Arcane-style avatar • Identity complete', date: 'Jan 28' },
  { icon: '🚀', title: 'Sprout Affiliate Links LIVE', desc: '11 products • Babylist-style UI', date: 'Jan 27' },
]

// ─── Components ──────────────────────────────────────────────

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

function PriorityDot({ priority }: { priority: string }) {
  const color = priority === 'high' ? 'bg-red-400' : priority === 'medium' ? 'bg-amber-400' : 'bg-zinc-500'
  return <span className={`w-1.5 h-1.5 rounded-full ${color} flex-shrink-0`} />
}

function SectionHeader({ children, icon, badge }: { children: React.ReactNode; icon: string; badge?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="text-lg">{icon}</span>
      <h2 className="text-[15px] font-semibold tracking-tight text-white/90">{children}</h2>
      {badge && <div className="ml-auto">{badge}</div>}
    </div>
  )
}

function TaskRow({ task }: { task: Task }) {
  const isDone = task.status === 'done'
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors group">
      <PriorityDot priority={task.priority} />
      <span className={`text-sm flex-1 ${isDone ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
        {task.title}
      </span>
      <span className="text-[10px] text-zinc-600 hidden sm:block">{task.category}</span>
      <StatusBadge status={task.status} />
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────
export default function Dashboard() {
  const [dateStr, setDateStr] = useState('')
  const [timeStr, setTimeStr] = useState('')
  const [daysUntilEvie, setDaysUntilEvie] = useState(0)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }))
      setTimeStr(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }))
      const evie = new Date('2026-06-30')
      setDaysUntilEvie(Math.ceil((evie.getTime() - now.getTime()) / 86400000))
    }
    update()
    const i = setInterval(update, 30000)
    return () => clearInterval(i)
  }, [])

  const finnDone = FINN_TASKS.filter(t => t.status === 'done').length
  const gavinDone = GAVIN_TASKS.filter(t => t.status === 'done').length
  const mrr = 1030
  const arr = mrr * 12
  const oneTime = 17000

  return (
    <main className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

      {/* ═══ TOP BAR ═══ */}
      <header className="fade-up fade-up-1 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2.5">
              <span className="text-cyan-400">🐟</span>
              <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Command Center
              </span>
            </h1>
            <p className="text-zinc-500 text-sm mt-1">{dateStr}</p>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <p className="text-xl font-light tracking-wide text-white/80 font-mono">{timeStr}</p>
            <p className="text-xs text-purple-400 font-medium">{daysUntilEvie} days until Evie 💜</p>
            <Link href="/access" className="text-[11px] text-zinc-500 hover:text-cyan-400 transition-colors mt-1">
              Access Inventory →
            </Link>
          </div>
        </div>
      </header>

      {/* ═══ WIDGETS ROW ═══ */}
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
                <p className="text-[10px] text-zinc-500">{KNICKS.standing}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-extralight tracking-tight text-white font-mono">{KNICKS.record}</p>
              <p className="text-xs text-emerald-400 font-medium">🔥 {KNICKS.streak}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.04]">
            <span className="text-zinc-500">Next</span>
            <span className="text-white/80">vs {KNICKS.nextOpponent}</span>
            <span className="text-zinc-500">{KNICKS.nextGame}</span>
          </div>
        </div>
      </section>

      {/* ═══ INBOX STATUS ═══ */}
      <div className="fade-up fade-up-3 glass px-5 py-3 mb-8 flex items-center gap-4 text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
        <span className="text-zinc-400">Inbox</span>
        <span className="text-zinc-300">Last reviewed: 45 min ago</span>
        <span className="text-zinc-600">•</span>
        <span className="text-zinc-300">3 drafts pending</span>
        <span className="text-zinc-600">•</span>
        <span className="text-zinc-300">0 urgent</span>
      </div>

      {/* ═══ FINN ACTIVITY FEED ═══ */}
      <section className="fade-up fade-up-4 glass p-5 sm:p-6 mb-8 glow-cyan">
        <SectionHeader icon="🐟" badge={
          <span className="text-[10px] text-cyan-400/80 bg-cyan-500/10 border border-cyan-500/15 px-2.5 py-1 rounded-full font-medium">
            LIVE
          </span>
        }>
          Finn Activity Feed
        </SectionHeader>
        <div className="space-y-1">
          {ACTIVITY_FEED.map((item, i) => (
            <div key={i} className={`slide-in flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors`} style={{ animationDelay: `${0.3 + i * 0.06}s` }}>
              <span className="text-sm mt-0.5">{item.icon}</span>
              <span className="text-sm text-zinc-300 flex-1">{item.text}</span>
              <span className="text-[10px] text-zinc-600 font-mono whitespace-nowrap">{item.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ DAILY RHYTHM ═══ */}
      <section className="fade-up fade-up-5 mb-8">
        <SectionHeader icon="🕐">Daily Rhythm</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DAILY_RHYTHM.map((block, i) => {
            const isNow = i === 1 // midday
            return (
              <div key={block.period} className={`glass p-5 ${isNow ? 'border-cyan-500/20 glow-cyan' : ''}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{block.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-white/90">{block.period}</p>
                    <p className="text-[10px] text-zinc-600">{block.time}</p>
                  </div>
                  {isNow && <span className="ml-auto text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/15">NOW</span>}
                </div>
                {block.finnDid.length > 0 && (
                  <div className="mb-2">
                    <p className="text-[10px] uppercase tracking-widest text-cyan-500/60 mb-1">Finn did</p>
                    {block.finnDid.map((item, j) => (
                      <p key={j} className="text-xs text-zinc-400 pl-2 py-0.5 border-l border-cyan-500/20">✓ {item}</p>
                    ))}
                  </div>
                )}
                {block.gavinsAttention.length > 0 && (
                  <div className="mb-2">
                    <p className="text-[10px] uppercase tracking-widest text-purple-500/60 mb-1">Needs Gavin</p>
                    {block.gavinsAttention.map((item, j) => (
                      <p key={j} className="text-xs text-zinc-400 pl-2 py-0.5 border-l border-purple-500/20">→ {item}</p>
                    ))}
                  </div>
                )}
                {block.comingUp.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-amber-500/60 mb-1">Coming up</p>
                    {block.comingUp.map((item, j) => (
                      <p key={j} className="text-xs text-zinc-400 pl-2 py-0.5 border-l border-amber-500/20">◦ {item}</p>
                    ))}
                  </div>
                )}
                {block.finnDid.length === 0 && block.gavinsAttention.length === 0 && block.comingUp.length === 0 && (
                  <p className="text-xs text-zinc-600 italic">Upcoming…</p>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ═══ ACTION ITEMS ═══ */}
      <section className="fade-up fade-up-6 grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Finn's Tasks */}
        <div className="glass p-5 sm:p-6">
          <SectionHeader icon="🐟" badge={
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15">
              {finnDone}/{FINN_TASKS.length}
            </span>
          }>
            Finn&apos;s Tasks
          </SectionHeader>
          <div className="space-y-0.5">
            {FINN_TASKS.map(task => <TaskRow key={task.id} task={task} />)}
          </div>
        </div>

        {/* Gavin's Tasks */}
        <div className="glass p-5 sm:p-6">
          <SectionHeader icon="👤" badge={
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15">
              {gavinDone}/{GAVIN_TASKS.length}
            </span>
          }>
            Gavin&apos;s Tasks
          </SectionHeader>
          <div className="space-y-0.5">
            {GAVIN_TASKS.map(task => <TaskRow key={task.id} task={task} />)}
          </div>
        </div>
      </section>

      {/* ═══ REVIEW QUEUE ═══ */}
      <section className="fade-up fade-up-7 glass p-5 sm:p-6 mb-8">
        <SectionHeader icon="⏳" badge={
          <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/15">
            {REVIEW_QUEUE.length} pending
          </span>
        }>
          Review Queue
        </SectionHeader>
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

      {/* ═══ ACTIVE PROJECTS ═══ */}
      <section className="fade-up fade-up-8 mb-8">
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

      {/* ═══ REVENUE & GOALS ═══ */}
      <section className="fade-up fade-up-9 glass p-5 sm:p-6 mb-8 glow-green">
        <SectionHeader icon="💰">Revenue &amp; Goals</SectionHeader>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
          <div>
            <p className="text-3xl font-extralight text-emerald-400">${mrr.toLocaleString()}</p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1">Monthly MRR</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">$30 Stripe + $1K BLD</p>
          </div>
          <div>
            <p className="text-3xl font-extralight text-white/80">${arr.toLocaleString()}</p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1">Current ARR</p>
          </div>
          <div>
            <p className="text-3xl font-extralight text-emerald-400">${(oneTime / 1000).toFixed(0)}K</p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1">One-time received</p>
          </div>
          <div>
            <p className="text-3xl font-extralight text-white/40">${((mrr * 12 + oneTime) / 1000).toFixed(0)}K</p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1">Total earned</p>
          </div>
        </div>

        {/* Progress bars */}
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
                  <div
                    className={`h-full bg-gradient-to-r ${goal.color} progress-bar rounded-full`}
                    style={{ width: `${Math.max(pct, 0.5)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ═══ RECENT WINS ═══ */}
      <section className="fade-up fade-up-10 glass p-5 sm:p-6 mb-8 bg-gradient-to-br from-emerald-950/10 to-transparent">
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

      {/* ═══ FOOTER ═══ */}
      <footer className="fade-up text-center py-8">
        <p className="text-xs text-zinc-600">
          Command Center v1.0 &nbsp;|&nbsp; Gavin + Finn 🐟 &nbsp;|&nbsp; Why Not Us?
        </p>
      </footer>
    </main>
  )
}
