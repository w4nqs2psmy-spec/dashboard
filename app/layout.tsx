import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import RoleSelector from '@/components/RoleSelector'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Kasvualusta 2035',
  description: 'Varhaisen tuen järjestelmä suomalaisille kouluille',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi" className={inter.variable}>
      <body className="font-sans min-h-screen bg-[#faf9f7]">
        <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌱</span>
              <span className="font-semibold text-stone-800 tracking-tight">Kasvualusta 2035</span>
            </div>
            <RoleSelector />
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </main>
        <footer className="text-center text-xs text-stone-300 py-6">
          Kasvualusta 2035 · Varhaisen tuen järjestelmä
        </footer>
      </body>
    </html>
  )
}
