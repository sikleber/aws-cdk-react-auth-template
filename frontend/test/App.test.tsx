import React from 'react'
import { render, act } from '@testing-library/react'
import App from '../src/App'
import '@testing-library/jest-dom'
import { Authenticator } from '@aws-amplify/ui-react'

test('renders app', async () => {
  await act(async () => {
    render(
      <Authenticator.Provider>
        <App />
      </Authenticator.Provider>
    )
  })
})
