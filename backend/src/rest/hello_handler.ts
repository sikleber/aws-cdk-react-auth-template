import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import * as jwt from 'jsonwebtoken'

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const authToken = event.headers['Authorization'] as string
  const decoded = jwt.decode(authToken) as jwt.JwtPayload

  return {
    statusCode: 200,
    body: `Hello ${decoded['cognito:username']} from backend handler!`
  }
}
