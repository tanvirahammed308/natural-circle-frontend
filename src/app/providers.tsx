'use client'

import { ThemeProvider } from 'next-themes'

import ReduxProvider from '@/redux/provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ReduxProvider>
  )
}