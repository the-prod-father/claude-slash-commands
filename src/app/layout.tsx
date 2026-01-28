import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Command Center | Gavin + Finn 🐟',
  description: 'Our shared brain. Goals, tasks, revenue, everything.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-[#050505] text-white antialiased">
        {children}
      </body>
    </html>
  )
}
