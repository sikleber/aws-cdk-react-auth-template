import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Authenticator } from '@aws-amplify/ui-react'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Authenticator.Provider>
      <App />
    </Authenticator.Provider>
  </React.StrictMode>
)
