import {
  Context,
  AppSyncResolverEvent,
  AppSyncIdentityCognito
} from 'aws-lambda'

export const handler = (
  event: AppSyncResolverEvent<never>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: Context
): string => {
  const identity = event.identity as AppSyncIdentityCognito
  return `Hello ${identity.username} from backend handler!`
}
