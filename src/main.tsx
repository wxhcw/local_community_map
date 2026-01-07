import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Global styles
import './index.css'
// ✅ Leaflet 样式
import 'leaflet/dist/leaflet.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
