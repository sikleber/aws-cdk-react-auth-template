import React, { ReactElement, useState } from 'react'
import logo from '../logo.svg'
import './Main.css'
import { useAuthenticator } from '@aws-amplify/ui-react'
import GraphqlApiButton from './GraphqlApiButton'
import RestApiButton from './RestApiButton'

const Main: React.FunctionComponent = (): ReactElement => {
  const { user } = useAuthenticator((context) => [context.user])
  const [message, setMessage] = useState('')

  return (
    <div className='App-main'>
      <h3>Hello {user.username}</h3>
      <img src={logo} className='App-logo' alt='logo' />
      <RestApiButton updateMessage={setMessage} />
      <GraphqlApiButton updateMessage={setMessage} />
      <p>{message}</p>
    </div>
  )
}

export default Main
