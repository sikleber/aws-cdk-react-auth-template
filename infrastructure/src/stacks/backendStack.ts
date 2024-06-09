import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { AppConfig } from '../config'
import * as AppSync from 'aws-cdk-lib/aws-appsync'
import { Visibility } from 'aws-cdk-lib/aws-appsync'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { AuthStack } from './authStack'

const PROJECT_ROOT = `${__dirname}/../../..`

export class BackendStack extends cdk.Stack {
  public readonly graphqlApi: AppSync.GraphqlApi
  public readonly lambdaResolver: lambda.Function
  public readonly lambdaDataSource: AppSync.LambdaDataSource

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
            defaultAction: AppSync.UserPoolDefaultAction.ALLOW // Allow default to authenticate users
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

    this.lambdaResolver = new lambda.Function(this, 'LambdaResolver', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async (event, context) => {
          const username = event.identity.username
          return \`Hello \${username} from backend handler!\`
        }
      `)
    })

    this.lambdaDataSource = this.graphqlApi.addLambdaDataSource(
      'LambdaDataSource',
      this.lambdaResolver
    )

    this.graphqlApi.createResolver('GetHelloResolver', {
      dataSource: this.lambdaDataSource,
      typeName: 'Query',
      fieldName: 'getHello'
    })

    new cdk.CfnOutput(this, 'AppGraphqlApiUrl', {
      value: this.graphqlApi.graphqlUrl
    })

    new cdk.CfnOutput(this, 'AppGraphqlApiKey', {
      value: this.graphqlApi.apiKey || ''
    })

    new cdk.CfnOutput(this, 'AppGraphqlApiRegion', {
      value: this.graphqlApi.env.region
    })
  }
}
