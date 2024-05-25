import React from 'react'
import { render, act } from '@testing-library/react'
import App from '../src/App'
import '@testing-library/jest-dom'

test('renders app', async () => {
  await act(async () => {
    render(<App />)
  })
})
