import React from 'react'
import { render } from '@testing-library/react'
import App from '../src/App'
import '@testing-library/jest-dom'

test('renders app', () => {
  render(<App />)
})
