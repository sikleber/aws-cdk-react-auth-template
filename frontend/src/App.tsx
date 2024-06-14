import React, { ReactElement } from 'react'
import '@aws-amplify/ui-react/styles.css'
import './App.css'
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react'
import Main from './components/Main'
import Header from './components/Header'
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client'
import { fetchAuthSession } from 'aws-amplify/auth'
import { AUTH_TYPE, AuthOptions, createAuthLink } from 'aws-appsync-auth-link'
import { Amplify } from 'aws-amplify'
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link'
import axios from 'axios'

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

const graphqlEndpoint = process.env.GRAPHQL_API_ENDPOINT
const graphqlRegion = process.env.GRAPHQL_API_REGION

if (!graphqlEndpoint || !graphqlRegion) {
  throw new Error(
    'Missing environment variables GRAPHQL_API_ENDPOINT || ' +
      'GRAPHQL_API_REGION'
  )
}

function getApolloClient(
  accessToken: string
): ApolloClient<NormalizedCacheObject> {
  const auth: AuthOptions = {
    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    jwtToken: async () => accessToken
  }

  const config = {
    url: graphqlEndpoint as string,
    region: graphqlRegion as string,
    auth: auth
  }

  const appsyncLink = ApolloLink.from([
    createAuthLink(config),
    createSubscriptionHandshakeLink(config)
  ])

  return new ApolloClient({
    link: appsyncLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-first'
      }
    }
  })
}

const App: React.FunctionComponent = (): ReactElement => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus])
  const [accessToken, setAccessToken] = React.useState<string | undefined>()

  if (authStatus === 'authenticated' && !accessToken) {
    fetchAuthSession().then((session) => {
      // get ID token for REST and access token for GraphQL
      axios.defaults.headers.common['Authorization'] =
        session.tokens?.idToken?.toString()
      setAccessToken(session.tokens?.accessToken?.toString())
    })
  }

  return (
    <Authenticator>
      {accessToken ? (
        <ApolloProvider client={getApolloClient(accessToken)}>
          <div className='App'>
            <Header />
            <Main />
            <footer className='App-footer' />
          </div>
        </ApolloProvider>
      ) : null}
    </Authenticator>
  )
}

export default App
