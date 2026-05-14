'use client'

import { ThemeProvider } from 'next-themes'

import ReduxProvider from '@/redux/provider'
import AuthProvider from '@/components/AuthProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <AuthProvider>
<ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      </AuthProvider>
      
    </ReduxProvider>
  )
}