import React, { ReactElement, useEffect } from 'react'
import './Main.css'
import { useLazyQuery } from '@apollo/client'
import { GET_HELLO } from '../graphql/queries'

interface GraphqlApiButtonProps {
  updateMessage: (message: string) => void
}

const GraphqlApiButton: React.FunctionComponent<GraphqlApiButtonProps> = ({
  updateMessage
}): ReactElement => {
  const [getHello, { error, data }] = useLazyQuery(GET_HELLO)

  useEffect(() => {
    if (error) {
      console.error(error)
      updateMessage('Failed to call the GraphQL API')
    } else if (data) {
      updateMessage(data.getHello)
    }
  }, [error, data, updateMessage])

  return (
    <button className='api-button' onClick={() => getHello()}>
      Call GraphQL API
    </button>
  )
}

export default GraphqlApiButton
