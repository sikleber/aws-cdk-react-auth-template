import { Context, APIGatewayEvent } from 'aws-lambda'
import { handler } from '../../src/rest/hello_handler'

describe('HelloResolver', () => {
  it('should return user hello message', async () => {
    const event = {
      headers: {
        Authorization: 'Bearer eyJraWQiOiJ...'
      }
    } as unknown as APIGatewayEvent
    const context = {} as Context
    const result = handler(event, context)
    expect(result).toBeDefined()
    expect(result.statusCode).toBe(200)
    expect(result.body).toMatch('Hello user from backend handler!')
  })
})
