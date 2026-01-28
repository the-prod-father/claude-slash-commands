'use client'

import { useState, useEffect } from 'react'
import { 
  Target, TrendingUp, CheckCircle2, Clock, 
  DollarSign, Calendar, Zap, ChevronRight,
  Fish, User, LayoutDashboard, Columns,
  Sun, Cloud, CloudRain, Snowflake, Wind,
  Trophy, TrendingUp as Flame
} from 'lucide-react'

// Types
interface Task {
  id: string
  title: string
  owner: 'finn' | 'gavin' | 'review'
  status: 'pending' | 'done' | 'blocked'
  priority: 'high' | 'medium' | 'low'
  category: 'today' | 'recurring' | 'project' | 'review'
  createdAt: string
}

interface Revenue {
  stripeMrr: number
  clientMrr: number
  totalMrr: number
}

interface Goals {
  mustHave: number
  stretch: number
  moonshot: number
}

interface Weather {
  temp: number
  high: number
  low: number
  condition: string
  icon: 'sun' | 'cloud' | 'rain' | 'snow' | 'wind'
}

interface KnicksData {
  record: string
  wins: number
  losses: number
  standing: string
  streak: string
  nextGame: string
  nextOpponent: string
}

export default function Dashboard() {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [daysUntilEvie, setDaysUntilEvie] = useState(0)
  const [view, setView] = useState<'dashboard' | 'kanban'>('dashboard')
  const [weather, setWeather] = useState<Weather | null>(null)
  const [knicks, setKnicks] = useState<KnicksData | null>(null)
  
  // Current data (will be API-driven later)
  const revenue: Revenue = {
    stripeMrr: 30, // Real Worth subs
    clientMrr: 1000, // BLD retainer
    totalMrr: 1030,
  }
  
  // One-time revenue received
  const oneTimeRevenue = 17000 // BLD $4K + Sprout $4K + Strive $8K + Spirited $1K
  
  const goals: Goals = {
    mustHave: 500000,
    stretch: 1000000,
    moonshot: 5000000,
  }
  
  const tasks: Task[] = [
    // Today - Tuesday Jan 28
    { id: '1', title: 'Sprout: Test affiliate links in prod', owner: 'gavin', status: 'pending', priority: 'high', category: 'today', createdAt: '2026-01-28' },
    { id: '2', title: 'BLD: New subscription setup', owner: 'finn', status: 'pending', priority: 'high', category: 'today', createdAt: '2026-01-28' },
    { id: '3', title: 'Check Real Worth App Store status', owner: 'gavin', status: 'pending', priority: 'high', category: 'today', createdAt: '2026-01-28' },
    { id: '4', title: 'LinkedIn DMs - respond to all', owner: 'gavin', status: 'pending', priority: 'medium', category: 'today', createdAt: '2026-01-28' },
    
    // Recurring (Finn's cron jobs)
    { id: '5', title: 'Email sweep - 7am', owner: 'finn', status: 'pending', priority: 'high', category: 'recurring', createdAt: '2026-01-28' },
    { id: '6', title: 'Morning kickoff - 7:30am', owner: 'finn', status: 'pending', priority: 'high', category: 'recurring', createdAt: '2026-01-28' },
    { id: '7', title: 'Email sweep - 1pm', owner: 'finn', status: 'pending', priority: 'high', category: 'recurring', createdAt: '2026-01-28' },
    { id: '8', title: 'Email sweep - 9pm', owner: 'finn', status: 'pending', priority: 'high', category: 'recurring', createdAt: '2026-01-28' },
    
    // Projects
    { id: '9', title: 'Sprout: Affiliate product display ✅', owner: 'finn', status: 'done', priority: 'high', category: 'project', createdAt: '2026-01-27' },
    { id: '10', title: 'Sprout: Babylist-style UI ✅', owner: 'finn', status: 'done', priority: 'high', category: 'project', createdAt: '2026-01-27' },
    { id: '11', title: 'Sprout: More age ranges from Nicolette', owner: 'gavin', status: 'pending', priority: 'medium', category: 'project', createdAt: '2026-01-28' },
    { id: '12', title: 'Oyster Bay: Build demo site', owner: 'finn', status: 'pending', priority: 'medium', category: 'project', createdAt: '2026-01-27' },
    { id: '13', title: 'BLD: Auto-email on new posts', owner: 'finn', status: 'pending', priority: 'medium', category: 'project', createdAt: '2026-01-27' },
    
    // Review Queue
    { id: '14', title: 'Sprout deployment verification', owner: 'review', status: 'pending', priority: 'high', category: 'review', createdAt: '2026-01-28' },
  ]

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setDate(now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }))
      setTime(now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }))
      
      // Calculate days until Evie (June 30, 2026)
      const evieDate = new Date('2026-06-30')
      const diffTime = evieDate.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setDaysUntilEvie(diffDays)
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000)
    
    // Mock weather for Oyster Bay Cove, NY (will be API later)
    setWeather({
      temp: 34,
      high: 38,
      low: 28,
      condition: 'Partly Cloudy',
      icon: 'cloud'
    })
    
    // Mock Knicks data (will be API later)
    setKnicks({
      record: '32-17',
      wins: 32,
      losses: 17,
      standing: '3rd in East',
      streak: 'W4',
      nextGame: 'Wed 1/29 @ 7:30pm',
      nextOpponent: 'vs Miami Heat'
    })
    
    return () => clearInterval(interval)
  }, [])

  const mrrProgress = (revenue.totalMrr * 12 / goals.mustHave) * 100
  
  const getTasksByCategory = (category: string) => tasks.filter(t => t.category === category)
  const getTasksByOwner = (owner: string) => tasks.filter(t => t.owner === owner)
  
  const WeatherIcon = ({ icon }: { icon: string }) => {
    switch (icon) {
      case 'sun': return <Sun className="w-8 h-8 text-yellow-400" />
      case 'cloud': return <Cloud className="w-8 h-8 text-zinc-400" />
      case 'rain': return <CloudRain className="w-8 h-8 text-blue-400" />
      case 'snow': return <Snowflake className="w-8 h-8 text-cyan-300" />
      default: return <Wind className="w-8 h-8 text-zinc-400" />
    }
  }
  
  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <span className="text-cyan-400">🐟</span> Command Center
          </h1>
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex bg-zinc-800 rounded-lg p-1">
              <button 
                onClick={() => setView('dashboard')}
                className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition ${view === 'dashboard' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button 
                onClick={() => setView('kanban')}
                className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition ${view === 'kanban' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                <Columns className="w-4 h-4" />
                Kanban
              </button>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm text-zinc-400">{date}</p>
              <p className="text-lg font-mono text-white">{time}</p>
              <p className="text-xs text-purple-400 font-medium">{daysUntilEvie} days until Evie 💜</p>
            </div>
          </div>
        </div>
        <p className="text-zinc-400 text-sm">Gavin + Finn | Building history together</p>
      </header>

      {/* Fun Widgets Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Weather Widget */}
        {weather && (
          <div className="card bg-gradient-to-br from-blue-900/30 to-zinc-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wide">Oyster Bay Cove, NY</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-bold">{weather.temp}°</span>
                  <span className="text-zinc-400 text-sm">F</span>
                </div>
                <p className="text-sm text-zinc-300 mt-1">{weather.condition}</p>
                <p className="text-xs text-zinc-500 mt-1">H: {weather.high}° L: {weather.low}°</p>
              </div>
              <WeatherIcon icon={weather.icon} />
            </div>
          </div>
        )}
        
        {/* Knicks Widget */}
        {knicks && (
          <div className="card bg-gradient-to-br from-orange-900/30 to-blue-900/30">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🏀</span>
              <div>
                <p className="font-bold text-orange-400">NEW YORK KNICKS</p>
                <p className="text-xs text-zinc-400">{knicks.standing}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-2xl font-bold font-mono">{knicks.record}</p>
                <p className={`text-xs font-medium ${knicks.streak.startsWith('W') ? 'text-green-400' : 'text-red-400'}`}>
                  {knicks.streak.startsWith('W') ? '🔥' : ''} {knicks.streak}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm bg-zinc-800/50 rounded-lg p-2">
              <span className="text-zinc-400">Next Game:</span>
              <span className="text-white font-medium">{knicks.nextOpponent}</span>
              <span className="text-zinc-400">{knicks.nextGame}</span>
            </div>
          </div>
        )}
      </section>

      {view === 'dashboard' ? (
        <>
          {/* Revenue Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-green-400" />
                <h2 className="font-semibold">Revenue</h2>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="stat-value text-green-400">${revenue.totalMrr.toLocaleString()}</p>
                  <p className="stat-label">Total MRR</p>
                </div>
                <div>
                  <p className="stat-value text-cyan-400">${revenue.stripeMrr}</p>
                  <p className="stat-label">Stripe</p>
                </div>
                <div>
                  <p className="stat-value text-purple-400">${revenue.clientMrr.toLocaleString()}</p>
                  <p className="stat-label">Clients</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400">Progress to $500K ARR</span>
                    <span className="text-green-400">{mrrProgress.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 progress-bar"
                      style={{ width: `${Math.min(mrrProgress, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-purple-400" />
                <h2 className="font-semibold">2026 Goals</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Must Have</span>
                  <span className="font-mono text-green-400">$500K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Stretch</span>
                  <span className="font-mono text-yellow-400">$1M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Moonshot</span>
                  <span className="font-mono text-purple-400">$5M</span>
                </div>
                <hr className="border-zinc-800" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Current ARR</span>
                  <span className="font-mono text-white">${(revenue.totalMrr * 12).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Tasks Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Fish className="w-5 h-5 text-cyan-400" />
                <h2 className="font-semibold">Finn's Tasks</h2>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded ml-auto">
                  {getTasksByOwner('finn').filter(t => t.status === 'done').length}/{getTasksByOwner('finn').length} done
                </span>
              </div>
              <div className="space-y-2">
                {getTasksByOwner('finn').map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50">
                    <CheckCircle2 className={`w-4 h-4 ${task.status === 'done' ? 'text-green-400' : 'text-zinc-600'}`} />
                    <span className={task.status === 'done' ? 'line-through text-zinc-500' : ''}>{task.title}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-purple-400" />
                <h2 className="font-semibold">Gavin's Tasks</h2>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded ml-auto">
                  {getTasksByOwner('gavin').filter(t => t.status === 'done').length}/{getTasksByOwner('gavin').length} done
                </span>
              </div>
              <div className="space-y-2">
                {getTasksByOwner('gavin').map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50">
                    <CheckCircle2 className={`w-4 h-4 ${task.status === 'done' ? 'text-green-400' : 'text-zinc-600'}`} />
                    <span className={task.status === 'done' ? 'line-through text-zinc-500' : ''}>{task.title}</span>
                    {task.priority === 'high' && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">HIGH</span>}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Review Queue */}
          <section className="card mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-yellow-400" />
              <h2 className="font-semibold">Review Queue</h2>
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded ml-auto">
                {getTasksByOwner('review').filter(t => t.status === 'pending').length} pending
              </span>
            </div>
            <div className="space-y-2">
              {getTasksByOwner('review').map(task => (
                <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span>{task.title}</span>
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded ml-auto">REVIEW</span>
                </div>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section className="card mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h2 className="font-semibold">Active Projects</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: 'Sprout Gifts', type: 'Product', revenue: '$4K project', status: '✅ Affiliate links LIVE!' },
                { name: 'Real Worth', type: 'Product', revenue: '$30/mo', status: 'App Store Pending' },
                { name: 'Bucket List Doctor', type: 'Client', revenue: '$1,000/mo', status: 'Active' },
                { name: 'Oyster Bay Sites', type: 'Pipeline', revenue: 'TBD', status: 'Demo Site Next' },
                { name: 'Job Search', type: 'Priority', revenue: 'Bridge Income', status: 'Interviews Active' },
              ].map((project, i) => (
                <div key={i} className="p-3 bg-zinc-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{project.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      project.type === 'Product' ? 'bg-purple-500/20 text-purple-400' :
                      project.type === 'Priority' ? 'bg-red-500/20 text-red-400' :
                      project.type === 'Pipeline' ? 'bg-green-500/20 text-green-400' :
                      'bg-cyan-500/20 text-cyan-400'
                    }`}>{project.type}</span>
                  </div>
                  <p className="text-sm text-green-400">{project.revenue}</p>
                  <p className="text-xs text-zinc-500">{project.status}</p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Recent Wins */}
          <section className="card mb-6 bg-gradient-to-r from-green-900/20 to-zinc-900">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h2 className="font-semibold">Recent Wins 🎉</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                <span className="text-2xl">🚀</span>
                <div>
                  <p className="font-medium text-green-400">Sprout Affiliate Links LIVE</p>
                  <p className="text-xs text-zinc-400">11 products • Babylist-style UI • Jan 27</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="font-medium text-green-400">$17K One-Time Revenue</p>
                  <p className="text-xs text-zinc-400">BLD + Sprout + Strive + Spirited</p>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* Kanban View */
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Today Column */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Today
              <span className="text-xs text-zinc-500 ml-auto">{getTasksByCategory('today').length}</span>
            </h3>
            <div className="space-y-2">
              {getTasksByCategory('today').map(task => (
                <div key={task.id} className={`p-3 rounded-lg border ${task.status === 'done' ? 'bg-zinc-800/30 border-zinc-800' : 'bg-zinc-800/50 border-zinc-700'}`}>
                  <p className={`text-sm ${task.status === 'done' ? 'line-through text-zinc-500' : ''}`}>{task.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {task.owner === 'finn' ? (
                      <span className="text-xs text-cyan-400">🐟 Finn</span>
                    ) : task.owner === 'review' ? (
                      <span className="text-xs text-yellow-400">⏳ Review</span>
                    ) : (
                      <span className="text-xs text-purple-400">👤 Gavin</span>
                    )}
                    {task.priority === 'high' && <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">!</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recurring Column */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
              Recurring
              <span className="text-xs text-zinc-500 ml-auto">{getTasksByCategory('recurring').length}</span>
            </h3>
            <div className="space-y-2">
              {getTasksByCategory('recurring').map(task => (
                <div key={task.id} className={`p-3 rounded-lg border ${task.status === 'done' ? 'bg-zinc-800/30 border-zinc-800' : 'bg-zinc-800/50 border-zinc-700'}`}>
                  <p className={`text-sm ${task.status === 'done' ? 'line-through text-zinc-500' : ''}`}>{task.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-cyan-400">🐟 Finn</span>
                    {task.status === 'done' && <span className="text-xs text-green-400 ml-auto">✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Projects Column */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Projects
              <span className="text-xs text-zinc-500 ml-auto">{getTasksByCategory('project').length}</span>
            </h3>
            <div className="space-y-2">
              {getTasksByCategory('project').map(task => (
                <div key={task.id} className={`p-3 rounded-lg border ${task.status === 'done' ? 'bg-zinc-800/30 border-zinc-800' : 'bg-zinc-800/50 border-zinc-700'}`}>
                  <p className={`text-sm ${task.status === 'done' ? 'line-through text-zinc-500' : ''}`}>{task.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {task.owner === 'finn' ? (
                      <span className="text-xs text-cyan-400">🐟 Finn</span>
                    ) : (
                      <span className="text-xs text-purple-400">👤 Gavin</span>
                    )}
                    {task.status === 'done' && <span className="text-xs text-green-400 ml-auto">✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Review Column */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              Review Queue
              <span className="text-xs text-zinc-500 ml-auto">{getTasksByCategory('review').length}</span>
            </h3>
            <div className="space-y-2">
              {getTasksByCategory('review').map(task => (
                <div key={task.id} className="p-3 rounded-lg border bg-yellow-500/5 border-yellow-500/20">
                  <p className="text-sm">{task.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-yellow-400">⏳ Needs Review</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="text-center text-zinc-600 text-xs mt-8">
        <p>Command Center v0.3 | Updated live by Finn 🐟</p>
        <p className="mt-1">Last update: Jan 27 @ 11:30pm - Sprout affiliate links deployed!</p>
      </footer>
    </main>
  )
}
