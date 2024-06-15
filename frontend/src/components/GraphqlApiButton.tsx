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
  // loading and fetchPolicy are only needed to actually execute and react on second button click
  const [getHello, { error, data, loading }] = useLazyQuery(GET_HELLO, {
    fetchPolicy: 'network-only'
  })

  useEffect(() => {
    if (!loading) {
      if (error) {
        console.error(error)
        updateMessage('Failed to call the GraphQL API')
      } else if (data) {
        console.log(data)
        updateMessage(data.getHello)
      }
    }
  }, [error, data, loading, updateMessage])

  return (
    <button className='api-button' onClick={() => getHello()}>
      Call GraphQL API
    </button>
  )
}

export default GraphqlApiButton
