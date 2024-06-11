import React, { ReactElement } from 'react'
import logo from '../logo.svg'
import './Main.css'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { useLazyQuery } from '@apollo/client'
import { GET_HELLO } from '../graphql/queries'

const Main: React.FunctionComponent = (): ReactElement => {
  const { username } = useAuthenticator((context) => [context.user])
  const [getHello, { error, data }] = useLazyQuery(GET_HELLO)

  let helloTxt = 'Click the button to call the API'
  if (error) {
    helloTxt = `Error! ${error.message}`
  } else if (data) {
    helloTxt = data.getHello
  }

  return (
    <div className='App-main'>
      <h3>Hello {username}</h3>
      <img src={logo} className='App-logo' alt='logo' />
      <p>{helloTxt}</p>
      <button onClick={() => getHello()}>Call API</button>
    </div>
  )
}

export default Main
