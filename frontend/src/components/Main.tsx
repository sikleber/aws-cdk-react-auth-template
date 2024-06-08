import React, { ReactElement, useState } from 'react'
import logo from '../logo.svg'
import { generateClient } from 'aws-amplify/api'
import { GET_HELLO } from '../graphql/queries'
import { getCurrentUser } from 'aws-amplify/auth'

const client = generateClient()

const Main: React.FunctionComponent = (): ReactElement => {
  const [result, setResult] = useState(null)
  const handleClick = async (): Promise<void> => {
    try {
      const response = await client.graphql({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        query: GET_HELLO
      })
      console.log(response)
      setResult(response)
    } catch (error) {
      if (error.errors && error.errors[0].errorType === 'Unauthorized') {
        console.warn('Unauthorized error:', error.errors[0])
      } else {
        console.error('Get hello failed:', error)
      }
    }
  }
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={handleClick}>Call API</button>
        {result && <p>{result.data.createTodo.text}</p>}
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

export default Main
