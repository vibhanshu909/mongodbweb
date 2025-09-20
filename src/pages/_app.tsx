import type { AppProps } from 'next/app'
import { Toaster } from '@/components/ui/toaster'
import '../../styles/main.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Component {...pageProps} />
      <Toaster />
    </div>
  )
}
