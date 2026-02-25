import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import { ToastProvider } from '../src/components/Toast'
import { LocaleProvider } from './locale'
import '../src/css/tokens.css'
import './catalog.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="data-theme" defaultTheme="dark">
      <ToastProvider>
        <LocaleProvider>
          <App />
        </LocaleProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>
)
