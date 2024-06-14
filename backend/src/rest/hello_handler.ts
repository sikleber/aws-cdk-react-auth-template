import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda'
import * as jwt from 'jsonwebtoken'

export const handler = (
  event: APIGatewayEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: Context
): APIGatewayProxyResult => {
  const authToken = event.headers['Authorization'] as string
  const decoded = jwt.decode(authToken) as jwt.JwtPayload

  return {
    statusCode: 200,
    body: `Hello ${decoded['cognito:username']} from backend handler!`
  }
}
