import { Context, AppSyncResolverEvent } from 'aws-lambda'
import { handler } from '../../src/graphql/hello_resolver'

describe('HelloResolver', () => {
  it('should return user hello message', async () => {
    const event = {
      identity: {
        username: 'user'
      }
    } as AppSyncResolverEvent<never>
    const context = {} as Context
    const result = handler(event, context)
    expect(result).toBe('Hello user from backend handler!')
  })
})
