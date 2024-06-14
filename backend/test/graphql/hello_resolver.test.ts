import { AppSyncResolverEvent } from 'aws-lambda'
import { handler } from '../../src/graphql/hello_resolver'

describe('HelloResolver', () => {
  it('should return user hello message', async () => {
    const event = {
      identity: {
        username: 'user'
      }
    } as AppSyncResolverEvent<never>
    const result = await handler(event)
    expect(result).toBe('Hello user from backend handler!')
  })
})
