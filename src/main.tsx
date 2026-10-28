import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './assets/css/themes'
import App from './App.tsx'
import { applyBrowserBranding } from './services/platformBranding'

// Initialize browser tab title and favicon immediately
applyBrowserBranding();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
