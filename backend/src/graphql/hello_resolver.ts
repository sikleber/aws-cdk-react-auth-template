import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda'
import * as jwt from 'jsonwebtoken'

export const handler = async (
  event: APIGatewayEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: Context
): Promise<APIGatewayProxyResult> => {
  const authToken = event.headers['Authorization'] as string
  const decoded = jwt.decode(authToken)
  const username = '...'
  console.log(decoded)

  return {
    statusCode: 200,
    body: `Hello ${username} from backend handler!`
  }
}
