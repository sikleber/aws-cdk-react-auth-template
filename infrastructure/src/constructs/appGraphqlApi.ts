import { Construct } from 'constructs'
import * as appsync from 'aws-cdk-lib/aws-appsync'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as cognito from 'aws-cdk-lib/aws-cognito'

export interface AppGraphqlApiProps {
  schemaFilePath: string
  authUserPool: cognito.UserPool
  authUserPoolClient: cognito.UserPoolClient
  logRetentionDays: number
}

export class AppGraphqlApi extends appsync.GraphqlApi {
  constructor(scope: Construct, props: AppGraphqlApiProps) {
    super(scope, 'AppGraphqlApi', {
      name: 'react-app-graphql-api',
      definition: appsync.Definition.fromFile(props.schemaFilePath),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: props.authUserPool,
            appIdClientRegex: props.authUserPoolClient.userPoolClientId,
            defaultAction: appsync.UserPoolDefaultAction.ALLOW // Allow default to authenticate users
          }
        }
      },
      introspectionConfig: appsync.IntrospectionConfig.ENABLED,
      visibility: appsync.Visibility.GLOBAL,
      xrayEnabled: true,
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
        excludeVerboseContent: false,
        retention: props.logRetentionDays
      }
    })

    const lambdaResolver = new lambda.Function(scope, 'LambdaResolver', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async (event, context) => {
          const username = event.identity.username
          return \`Hello \${username} from backend handler!\`
        }
      `)
    })

    const lambdaDataSource = this.addLambdaDataSource(
      'LambdaDataSource',
      lambdaResolver
    )

    this.createResolver('GetHelloResolver', {
      dataSource: lambdaDataSource,
      typeName: 'Query',
      fieldName: 'getHello'
    })
  }
}
