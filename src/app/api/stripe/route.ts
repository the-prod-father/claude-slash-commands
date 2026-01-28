import { NextResponse } from 'next/server'

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY

export async function GET() {
  if (!STRIPE_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  try {
    // Fetch balance
    const balanceRes = await fetch('https://api.stripe.com/v1/balance', {
      headers: { 'Authorization': `Bearer ${STRIPE_KEY}` }
    })
    const balance = await balanceRes.json()

    // Fetch subscriptions
    const subsRes = await fetch('https://api.stripe.com/v1/subscriptions?limit=20&status=all', {
      headers: { 'Authorization': `Bearer ${STRIPE_KEY}` }
    })
    const subscriptions = await subsRes.json()

    // Calculate MRR from active subscriptions
    const activeSubs = subscriptions.data?.filter((s: any) => s.status === 'active') || []
    const stripeMrr = activeSubs.reduce((sum: number, sub: any) => {
      const amount = sub.items?.data?.[0]?.price?.unit_amount || 0
      return sum + (amount / 100)
    }, 0)

    return NextResponse.json({
      balance: balance.available?.[0]?.amount / 100 || 0,
      stripeMrr: Math.round(stripeMrr * 100) / 100,
      activeSubscriptions: activeSubs.length,
      totalSubscriptions: subscriptions.data?.length || 0,
      subscriptions: subscriptions.data?.map((s: any) => ({
        id: s.id,
        status: s.status,
        amount: (s.items?.data?.[0]?.price?.unit_amount || 0) / 100,
        interval: s.items?.data?.[0]?.price?.recurring?.interval || 'month',
      }))
    })
  } catch (error) {
    console.error('Stripe API error:', error)
    return NextResponse.json({ error: 'Failed to fetch Stripe data' }, { status: 500 })
  }
}
