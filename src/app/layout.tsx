import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Command Center | Gavin + Finn',
  description: 'Our shared brain. Goals, tasks, revenue, everything.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        {children}
      </body>
    </html>
  )
}
