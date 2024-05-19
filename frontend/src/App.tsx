import React from 'react'
import logo from './logo.svg'
import './App.css'

const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID
const COGNITO_USER_POOL_CLIENT_ID = process.env.COGNITO_USER_POOL_CLIENT_ID

function App(): JSX.Element {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>Cognito User Pool ID: {COGNITO_USER_POOL_ID}</p>
        <p>Cognito User Pool Client ID: {COGNITO_USER_POOL_CLIENT_ID}</p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
