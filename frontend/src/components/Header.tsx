import React, { ReactElement } from 'react'
import './Header.css'
import { useAuthenticator } from '@aws-amplify/ui-react'

const Header: React.FunctionComponent = (): ReactElement => {
  const { signOut } = useAuthenticator((context) => [context.user])

  return (
    <header className='App-header'>
      <h1>React App Authentication Template</h1>
      <button onClick={signOut}>Sign out</button>
    </header>
  )
}

export default Header
