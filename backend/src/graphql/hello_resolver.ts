import { AppSyncResolverEvent, AppSyncIdentityCognito } from 'aws-lambda'

export const handler = async (
  event: AppSyncResolverEvent<never>
): Promise<string> => {
  const identity = event.identity as AppSyncIdentityCognito
  return `Hello ${identity.username} from backend handler!`
}
