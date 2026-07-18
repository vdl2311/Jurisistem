import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './app/page'
import './app/globals.css'
import { Toaster } from '@/components/ui/toaster'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Home />
    <Toaster />
  </React.StrictMode>
)
