import React, { ReactElement } from 'react'
import './Main.css'
import axios from 'axios'

const baseUrl = process.env.REST_API_ENDPOINT
if (!baseUrl) {
  throw new Error('Missing environment variable REST_API_ENDPOINT')
}

interface RestApiButtonProps {
  updateMessage: (message: string) => void
}

const RestApiButton: React.FunctionComponent<RestApiButtonProps> = ({
  updateMessage
}): ReactElement => {
  const callRestApi = async (): Promise<void> => {
    try {
      const response = await axios.get<string>(`${baseUrl}/hello`)
      updateMessage(response.data)
    } catch (e) {
      console.error(e)
      updateMessage('Failed to call the REST API')
    }
  }

  return (
    <button className='api-button' onClick={() => callRestApi()}>
      Call REST API
    </button>
  )
}

export default RestApiButton
