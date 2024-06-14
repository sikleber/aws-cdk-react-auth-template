import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import * as jwt from 'jsonwebtoken'

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const authToken = event.headers['Authorization'] as string
  const decoded = jwt.decode(authToken) as jwt.JwtPayload

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true // Required for cookies, authorization headers with HTTPS
    },
    body: `Hello ${decoded['cognito:username']} from REST backend handler!`
  }
}
