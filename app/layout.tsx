import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Assignment Platform - Professional Academic Services',
  description: 'Connect with professional assignment makers for your academic projects and research needs.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0D2440',
                color: '#E7F0FA',
                borderRadius: '12px',
                border: '1px solid #2E5E99',
              },
              success: {
                style: {
                  background: '#2E5E99',
                  color: '#E7F0FA',
                },
              },
              error: {
                style: {
                  background: '#dc2626',
                  color: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}