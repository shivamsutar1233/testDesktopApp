import React from 'react'
import ReactDOM from 'react-dom/client'

function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Grocery Delivery Management</h1>
      <p>React app is working!</p>
      <div style={{ background: '#f0f0f0', padding: '10px', marginTop: '10px' }}>
        <h2>System Status</h2>
        <ul>
          <li>✅ React loaded successfully</li>
          <li>✅ Vite development server running</li>
          <li>🔄 Loading main application...</li>
        </ul>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<TestApp />)
