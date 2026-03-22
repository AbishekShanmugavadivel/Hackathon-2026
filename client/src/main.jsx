import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext' // 👈 ADD THIS
import { SpeedInsights } from "@vercel/speed-insights/next"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* 👈 WRAP HERE */}
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0A192F',
              color: '#FFD700',
              border: '1px solid #FFD700',
            },
            success: {
              iconTheme: {
                primary: '#FFD700',
                secondary: '#0A192F',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#0A192F',
              },
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)