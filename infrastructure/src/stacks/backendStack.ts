import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { AppConfig } from '../config'
import * as AppSync from 'aws-cdk-lib/aws-appsync'
import { Visibility } from 'aws-cdk-lib/aws-appsync'
import { AuthStack } from './authStack'

const PROJECT_ROOT = `${__dirname}/../../..`

export class BackendStack extends cdk.Stack {
  public readonly graphqlApi: AppSync.GraphqlApi

  constructor(
    scope: Construct,
    id: string,
    config: AppConfig,
    authStack: AuthStack,
    props?: cdk.StackProps
  ) {
    super(scope, id, props)

    this.graphqlApi = new AppSync.GraphqlApi(this, 'AppGraphqlApi', {
      name: 'react-app-graphql-api',
      definition: AppSync.Definition.fromFile(
        `${PROJECT_ROOT}/graphql/schema.graphql`
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AppSync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: authStack.userPool,
            appIdClientRegex: authStack.userPoolClient.userPoolClientId,
            defaultAction: AppSync.UserPoolDefaultAction.DENY
          }
        }
      },
      introspectionConfig: AppSync.IntrospectionConfig.ENABLED,
      visibility: Visibility.GLOBAL,
      xrayEnabled: true,
      logConfig: {
        fieldLogLevel: AppSync.FieldLogLevel.ALL,
        excludeVerboseContent: false,
        retention: config.logRetentionDays
      }
    })
  }
}
