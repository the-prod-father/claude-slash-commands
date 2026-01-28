import { NextResponse } from 'next/server'

// Simple in-memory cache
let cache: { data: unknown; timestamp: number } | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

const NYK_TEAM_ID = 1610612752
const NYK_TRICODE = 'NYK'

interface NBATeam {
  teamId: number
  teamName: string
  teamCity: string
  teamTricode: string
  wins: number
  losses: number
  score: number
  seed: number | null
  inBonus: string | null
  timeoutsRemaining: number
  periods: { period: number; periodType: string; score: number }[]
}

interface NBAGame {
  gameId: string
  gameCode: string
  gameStatus: number // 1=scheduled, 2=in progress, 3=final
  gameStatusText: string
  period: number
  gameClock: string
  gameTimeUTC: string
  gameEt: string
  homeTeam: NBATeam
  awayTeam: NBATeam
}

function findKnicksGame(games: NBAGame[]) {
  return games.find(
    g => g.homeTeam.teamId === NYK_TEAM_ID || g.awayTeam.teamId === NYK_TEAM_ID
  )
}

function isKnicksHome(game: NBAGame) {
  return game.homeTeam.teamId === NYK_TEAM_ID
}

function formatGameTime(gameEt: string) {
  try {
    const d = new Date(gameEt)
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/New_York' })
  } catch {
    return ''
  }
}

function formatGameDate(gameEt: string) {
  try {
    const d = new Date(gameEt)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric', timeZone: 'America/New_York' })
  } catch {
    return ''
  }
}

async function fetchNBAData() {
  // Check cache
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data
  }

  try {
    const scoreboardRes = await fetch(
      'https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json',
      { next: { revalidate: 300 } }
    )

    if (!scoreboardRes.ok) {
      throw new Error(`NBA API returned ${scoreboardRes.status}`)
    }

    const scoreboard = await scoreboardRes.json()
    const games: NBAGame[] = scoreboard?.scoreboard?.games || []
    const knicksGame = findKnicksGame(games)

    let record = ''
    let todayGame = null
    let nextGame = null
    let standing = ''
    let streak = ''
    let isLive = false

    if (knicksGame) {
      const knicks = isKnicksHome(knicksGame) ? knicksGame.homeTeam : knicksGame.awayTeam
      const opponent = isKnicksHome(knicksGame) ? knicksGame.awayTeam : knicksGame.homeTeam
      const home = isKnicksHome(knicksGame)

      record = `${knicks.wins}-${knicks.losses}`

      if (knicksGame.gameStatus === 1) {
        // Scheduled
        todayGame = {
          status: 'scheduled',
          opponent: `${opponent.teamCity} ${opponent.teamName}`,
          opponentTricode: opponent.teamTricode,
          time: formatGameTime(knicksGame.gameEt),
          home,
          gameStatusText: knicksGame.gameStatusText,
        }
      } else if (knicksGame.gameStatus === 2) {
        // Live
        isLive = true
        todayGame = {
          status: 'live',
          opponent: `${opponent.teamCity} ${opponent.teamName}`,
          opponentTricode: opponent.teamTricode,
          home,
          knicksScore: knicks.score,
          opponentScore: opponent.score,
          period: knicksGame.period,
          clock: knicksGame.gameClock,
          gameStatusText: knicksGame.gameStatusText,
        }
      } else if (knicksGame.gameStatus === 3) {
        // Final
        todayGame = {
          status: 'final',
          opponent: `${opponent.teamCity} ${opponent.teamName}`,
          opponentTricode: opponent.teamTricode,
          home,
          knicksScore: knicks.score,
          opponentScore: opponent.score,
          gameStatusText: knicksGame.gameStatusText,
          won: knicks.score > opponent.score,
        }
      }
    } else {
      // No Knicks game today — try to find record from any game's team data
      // and provide a "no game today" response
      nextGame = { text: 'No game today' }
    }

    // Try to get standings for conference rank
    try {
      const standingsRes = await fetch(
        'https://cdn.nba.com/static/json/liveData/standings/standings.json',
        { next: { revalidate: 3600 } }
      )
      if (standingsRes.ok) {
        const standingsData = await standingsRes.json()
        const teams = standingsData?.standings?.entries || standingsData?.standings?.teams || []
        // Try different possible structures
        const allTeams = Array.isArray(teams) ? teams : []
        const nyk = allTeams.find((t: Record<string, unknown>) =>
          t.teamId === NYK_TEAM_ID ||
          (t.team && (t.team as Record<string, unknown>).id === NYK_TEAM_ID)
        )
        if (nyk) {
          standing = nyk.conferenceRank
            ? `${ordinal(nyk.conferenceRank)} in ${nyk.conference || 'East'}`
            : ''
          if (!record && nyk.wins !== undefined) {
            record = `${nyk.wins}-${nyk.losses}`
          }
          if (nyk.streak) {
            streak = nyk.streak
          }
        }
      }
    } catch {
      // standings optional
    }

    const result = {
      record,
      standing,
      streak,
      todayGame,
      nextGame,
      isLive,
      gameDate: scoreboard?.scoreboard?.gameDate || '',
    }

    cache = { data: result, timestamp: Date.now() }
    return result
  } catch (error) {
    console.error('NBA API error:', error)
    // Return cached data if available, even if stale
    if (cache) return cache.data
    return { error: true, record: '', standing: '', streak: '', todayGame: null, nextGame: null, isLive: false }
  }
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export async function GET() {
  const data = await fetchNBAData()
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
