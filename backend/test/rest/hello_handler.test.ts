import { APIGatewayEvent } from 'aws-lambda'
import { handler } from '../../src/rest/hello_handler'

describe('HelloResolver', () => {
  it('should return user hello message', async () => {
    const event = {
      headers: {
        Authorization:
          // eslint-disable-next-line max-len
          'eyJraWQiOiJaNlF5YmxJXC9WU1JQbEw0VE1jQm1za1lVc3dYZFNrVHNvQ1VoelhKYWZETT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMzk0NzgwMi04MGYxLTcwZmMtZDhlZi0wY2Q0MDAzZDdlMjgiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfNnV4ZFgxYnM4IiwiY29nbml0bzp1c2VybmFtZSI6InNrbGViZXIiLCJvcmlnaW5fanRpIjoiNzQwY2EwNTctYmNkNS00ZTg3LTljNTktYWE0NTZlNWQ4OWZmIiwiYXVkIjoiM2xvOWdzaDcxM3VlaDV2OGcyZTMzdXZjaGQiLCJldmVudF9pZCI6IjYzNDg1YWRmLTdjM2UtNDE2My1hNGU3LTk1NjVlZjE4ODhlNyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzE4MjIzNjg4LCJleHAiOjE3MTg0MDQ5MjgsImlhdCI6MTcxODMxODUyOCwianRpIjoiZTRkODg3NjctODliYy00NWFiLWE1YmQtNTg2OWUwNWZmZDg2IiwiZW1haWwiOiJTS2xlYmVyQGJocy13b3JsZC5jb20ifQ.yXRiHKxjJ8ZbWKxYOUPQfk9P8mG8EyBUOSG6DWM1WVTQy02M02ryPn2aK6cslKyGYeFgZMgpe9on_ph4ra5YUBGAq-nmsB_sC4dylkYM3lbRg2E83PFc5IO66E6NefM3hDWOCSW5T5RE411E2ZZx7IZXZzMIh7Mvs_6MS2cEDZblzxIDpf9TK3ZGhC85ANynkp_Kl7xWH2waYs9xFJ5LFY2y9dTLGv9l8mEL_OXjiQLOP3pmNnntNNbIm4mciQhTETE2cOdmbDqwlBZ6WtepkNPe97YlN1VJTeCHzdkzietjgg5n1izTTVJQajb_YCnbYItYIPFNy5NNVr8qT-wzTA'
      }
    } as unknown as APIGatewayEvent
    const result = await handler(event)
    expect(result).toBeDefined()
    expect(result.statusCode).toBe(200)
    expect(result.body).toMatch('Hello skleber from backend handler!')
  })
})
