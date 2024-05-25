import React, { ReactElement } from 'react'
import '@aws-amplify/ui-react/styles.css'
import './App.css'
import { Amplify } from 'aws-amplify'
import { Authenticator } from '@aws-amplify/ui-react'
import Main from './components/Main'

const userPoolId = process.env.COGNITO_USER_POOL_ID
const userPoolClientId = process.env.COGNITO_USER_POOL_CLIENT_ID

if (!userPoolId || !userPoolClientId) {
  throw new Error(
    'Missing environment variables COGNITO_USER_POOL_ID || ' +
      'COGNITO_USER_POOL_CLIENT_ID'
  )
}

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: userPoolId,
      userPoolClientId: userPoolClientId,
      loginWith: {
        username: true,
        email: true
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: false
      },
      userAttributes: undefined,
      mfa: undefined
    }
  }
})

const App: React.FunctionComponent = (): ReactElement => {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <button onClick={signOut}>Sign out</button>
          <Main />
        </main>
      )}
    </Authenticator>
  )
}

export default App
