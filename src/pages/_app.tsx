import type { AppProps } from 'next/app'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/ThemeProvider'
import '../../styles/main.css'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Component {...pageProps} />
        <Toaster />
      </div>
    </ThemeProvider>
  )
}
