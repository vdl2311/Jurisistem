import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './app/page'
import './app/globals.css'
import { Toaster } from '@/components/ui/toaster'
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL || "https://fake-url-to-prevent-crash.convex.cloud");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <Home />
      <Toaster />
    </ConvexProvider>
  </React.StrictMode>
)
