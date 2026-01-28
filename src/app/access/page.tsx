'use client'

import { useState } from 'react'
import { 
  Shield, CheckCircle2, Clock, ArrowLeft,
  Mail, Calendar, MessageSquare, Twitter, Linkedin, Hash,
  Globe, Search, Monitor, Camera, Mic, Image, FileText,
  Code, GitBranch, Rocket, Terminal,
  Bell, MapPin, Cloud, Cpu,
  Brain, Headphones, Film, Sparkles
} from 'lucide-react'

interface AccessItem {
  name: string
  icon: React.ReactNode
  description: string
  status: 'active' | 'potential'
  category: string
}

const accessItems: AccessItem[] = [
  // Communication
  { name: 'Gmail', icon: <Mail className="w-5 h-5" />, description: 'Read, send, search, and organize emails via Google Workspace CLI.', status: 'active', category: 'Communication' },
  { name: 'Google Calendar', icon: <Calendar className="w-5 h-5" />, description: 'View, create, and edit calendar events. Check upcoming schedule.', status: 'active', category: 'Communication' },
  { name: 'iMessage / SMS', icon: <MessageSquare className="w-5 h-5" />, description: 'Read messages, send texts, search chat history.', status: 'active', category: 'Communication' },
  { name: 'WhatsApp', icon: <MessageSquare className="w-5 h-5" />, description: 'Send messages, search and sync conversation history.', status: 'active', category: 'Communication' },
  { name: 'Telegram', icon: <MessageSquare className="w-5 h-5" />, description: 'Primary channel — direct chat, reactions, inline buttons.', status: 'active', category: 'Communication' },
  { name: 'Slack', icon: <Hash className="w-5 h-5" />, description: 'Messages, reactions, pins, channel monitoring. Socket Mode live.', status: 'active', category: 'Communication' },
  { name: 'X / Twitter', icon: <Twitter className="w-5 h-5" />, description: 'Read timeline, search, post, engage via cookie-based auth.', status: 'active', category: 'Communication' },
  { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, description: 'Messaging, profile viewing, network actions via browser automation.', status: 'active', category: 'Communication' },

  // Productivity
  { name: 'Apple Notes', icon: <FileText className="w-5 h-5" />, description: 'Create, edit, search, move, and export notes on macOS.', status: 'active', category: 'Productivity' },
  { name: 'Apple Reminders', icon: <Bell className="w-5 h-5" />, description: 'Add, edit, complete, and list reminders with date filters.', status: 'active', category: 'Productivity' },
  { name: 'Things 3', icon: <CheckCircle2 className="w-5 h-5" />, description: 'Full task management — inbox, today, projects, areas, tags.', status: 'active', category: 'Productivity' },
  { name: 'Notion', icon: <FileText className="w-5 h-5" />, description: 'Create and manage pages, databases, and blocks via API.', status: 'active', category: 'Productivity' },
  { name: 'Linear', icon: <Cpu className="w-5 h-5" />, description: 'Issues, projects, and team workflow management.', status: 'active', category: 'Productivity' },
  { name: 'Google Drive / Sheets / Docs', icon: <FileText className="w-5 h-5" />, description: 'Read, create, and edit files across Google Workspace.', status: 'active', category: 'Productivity' },

  // Dev & Code
  { name: 'GitHub', icon: <GitBranch className="w-5 h-5" />, description: 'Issues, PRs, CI runs, and full API access via gh CLI.', status: 'active', category: 'Dev & Code' },
  { name: 'Coding Agents', icon: <Terminal className="w-5 h-5" />, description: 'Run Claude Code, Codex, or other coding agents in background.', status: 'active', category: 'Dev & Code' },
  { name: 'Deploy Agent', icon: <Rocket className="w-5 h-5" />, description: 'Ship and deploy projects.', status: 'active', category: 'Dev & Code' },
  { name: 'Conventional Commits', icon: <Code className="w-5 h-5" />, description: 'Proper git commit formatting for changelog and versioning.', status: 'active', category: 'Dev & Code' },

  // Media & Web
  { name: 'Voice / TTS (ElevenLabs)', icon: <Mic className="w-5 h-5" />, description: 'Text-to-speech with Jessica voice. Voice replies > text walls.', status: 'active', category: 'Media & Web' },
  { name: 'Whisper Transcription', icon: <Headphones className="w-5 h-5" />, description: 'Audio transcription — local model and OpenAI API.', status: 'active', category: 'Media & Web' },
  { name: 'Browser Automation', icon: <Globe className="w-5 h-5" />, description: 'Full Chrome control — navigate, screenshot, interact with any site.', status: 'active', category: 'Media & Web' },
  { name: 'Web Search & Fetch', icon: <Search className="w-5 h-5" />, description: 'Brave Search API + page content extraction.', status: 'active', category: 'Media & Web' },
  { name: 'Image Generation', icon: <Image className="w-5 h-5" />, description: 'OpenAI DALL-E and Gemini image generation.', status: 'active', category: 'Media & Web' },
  { name: 'PDF Editing', icon: <FileText className="w-5 h-5" />, description: 'Edit PDFs with natural language instructions.', status: 'active', category: 'Media & Web' },
  { name: 'Video Frames', icon: <Film className="w-5 h-5" />, description: 'Extract frames or clips from videos using ffmpeg.', status: 'active', category: 'Media & Web' },
  { name: 'URL / Podcast Summarizer', icon: <Sparkles className="w-5 h-5" />, description: 'Summarize web pages, podcasts, YouTube — text or transcript.', status: 'active', category: 'Media & Web' },
  { name: 'GIF Search', icon: <Image className="w-5 h-5" />, description: 'Search GIF providers, download, extract stills.', status: 'active', category: 'Media & Web' },

  // System
  { name: 'macOS UI Automation', icon: <Monitor className="w-5 h-5" />, description: 'Capture and interact with macOS UI via Peekaboo.', status: 'active', category: 'System' },
  { name: 'Filesystem Access', icon: <FileText className="w-5 h-5" />, description: 'Full read/write access to workspace and local files.', status: 'active', category: 'System' },
  { name: 'Cron Jobs & Reminders', icon: <Clock className="w-5 h-5" />, description: 'Scheduled tasks, timed reminders, recurring jobs.', status: 'active', category: 'System' },
  { name: 'Device Notifications', icon: <Bell className="w-5 h-5" />, description: 'Push notifications to paired devices.', status: 'active', category: 'System' },
  { name: 'Camera Snaps (RTSP)', icon: <Camera className="w-5 h-5" />, description: 'Capture frames from RTSP/ONVIF cameras.', status: 'active', category: 'System' },
  { name: 'Weather', icon: <Cloud className="w-5 h-5" />, description: 'Current conditions and forecasts, no API key needed.', status: 'active', category: 'System' },
  { name: 'Places / Restaurant Search', icon: <MapPin className="w-5 h-5" />, description: 'Google Places API for local search and reviews.', status: 'active', category: 'System' },

  // Potential Access
  { name: 'Granola (Meeting Notes)', icon: <Brain className="w-5 h-5" />, description: 'AI meeting transcription and notes. Could integrate for auto-summaries after calls.', status: 'potential', category: 'Potential' },
  { name: 'Voice Calls', icon: <Mic className="w-5 h-5" />, description: 'No voice-call skill exists yet. Could build for outbound/inbound call handling.', status: 'potential', category: 'Potential' },
  { name: 'Stripe Dashboard', icon: <Sparkles className="w-5 h-5" />, description: 'Direct Stripe API access for real-time MRR, subscriptions, and payment data.', status: 'potential', category: 'Potential' },
  { name: 'Vercel Dashboard', icon: <Rocket className="w-5 h-5" />, description: 'Direct Vercel API for deployment status, logs, and project management.', status: 'potential', category: 'Potential' },
  { name: 'App Store Connect', icon: <Monitor className="w-5 h-5" />, description: 'Check app review status, analytics, and manage releases programmatically.', status: 'potential', category: 'Potential' },
]

const categories = ['Communication', 'Productivity', 'Dev & Code', 'Media & Web', 'System', 'Potential']

const categoryColors: Record<string, string> = {
  'Communication': 'text-blue-400',
  'Productivity': 'text-purple-400',
  'Dev & Code': 'text-green-400',
  'Media & Web': 'text-cyan-400',
  'System': 'text-orange-400',
  'Potential': 'text-yellow-400',
}

export default function AccessPage() {
  const activeCount = accessItems.filter(i => i.status === 'active').length
  const potentialCount = accessItems.filter(i => i.status === 'potential').length

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <a href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-4 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to Command Center
        </a>
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-7 h-7 text-cyan-400" />
          <h1 className="text-2xl sm:text-3xl font-bold">Finn's Access Inventory</h1>
        </div>
        <p className="text-zinc-400 text-sm">Everything I can do, and what we could unlock next.</p>
        
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-mono text-lg">{activeCount}</span>
            <span className="text-zinc-400 text-sm">Active</span>
          </div>
          <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-mono text-lg">{potentialCount}</span>
            <span className="text-zinc-400 text-sm">Potential</span>
          </div>
        </div>
      </header>

      {/* Categories */}
      {categories.map(category => {
        const items = accessItems.filter(i => i.category === category)
        if (items.length === 0) return null
        
        const isPotential = category === 'Potential'
        
        return (
          <section key={category} className="mb-8">
            <h2 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${categoryColors[category]}`}>
              {isPotential ? <Clock className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
              {category}
              <span className="text-xs text-zinc-500 font-normal ml-2">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
            </h2>
            <div className="grid gap-2">
              {items.map((item, i) => (
                <div 
                  key={i} 
                  className={`flex items-start gap-4 p-4 rounded-xl border transition ${
                    isPotential 
                      ? 'bg-yellow-500/5 border-yellow-500/10 hover:border-yellow-500/20' 
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className={`mt-0.5 ${isPotential ? 'text-yellow-400' : 'text-zinc-400'}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.name}</span>
                      {item.status === 'active' && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">LIVE</span>
                      )}
                      {item.status === 'potential' && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">POTENTIAL</span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400 mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })}

      {/* Footer */}
      <footer className="text-center text-zinc-600 text-xs mt-12 pb-8">
        <p>Updated Jan 28, 2026 | Finn 🐟</p>
        <p className="mt-1">Want to add something? Just tell me and I'll wire it up.</p>
      </footer>
    </main>
  )
}
