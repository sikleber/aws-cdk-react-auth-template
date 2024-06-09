import React, { ReactElement, useState } from 'react'
import logo from '../logo.svg'
import { generateClient } from 'aws-amplify/api'
import { GET_HELLO } from '../graphql/queries'
import { Get_HelloQuery } from '../graphql/__generated__/graphql'

const client = generateClient()

const Main: React.FunctionComponent = (): ReactElement => {
  const [helloStateTxt, setHelloStateTxt] = useState('Click the button!')

  const handleClick = async (): Promise<void> => {
    try {
      const response = (await client.graphql({
        query: GET_HELLO
      })) as { data: Get_HelloQuery }
      setHelloStateTxt(response.data.getHello)
    } catch (error) {
      console.error('Get hello failed:', error)
    }
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>{helloStateTxt}</p>
        <button onClick={handleClick}>Call API</button>
      </header>
    </div>
  )
}

export default Main
