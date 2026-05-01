import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MotionConfig } from 'framer-motion'
import { ThemeProvider } from 'next-themes'
import { QueryProvider } from '@/components/providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: { default: 'Forge Sandboxes', template: '%s | Forge Sandboxes' },
  description: 'Visual GUI for Firecracker microVM agent sandboxes',
  keywords: ['firecracker', 'microvm', 'sandbox', 'gui', 'agents', 'nextjs'],
  authors: [{ name: 'VibeCodingLabs' }],
  openGraph: {
    title: 'Forge Sandboxes',
    description: 'Visual GUI for Firecracker microVM agent sandboxes',
    type: 'website'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <QueryProvider>
            <MotionConfig reducedMotion="user">
              {children}
            </MotionConfig>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
