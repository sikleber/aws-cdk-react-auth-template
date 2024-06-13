import { Construct } from 'constructs'
import * as appsync from 'aws-cdk-lib/aws-appsync'
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as cognito from 'aws-cdk-lib/aws-cognito'

const PROJECT_ROOT = `${__dirname}/../../..`
const BACKEND_ROOT = `${PROJECT_ROOT}/backend`

export interface AppGraphqlApiProps {
  authUserPool: cognito.UserPool
  authUserPoolClient: cognito.UserPoolClient
  logRetentionDays: number
}

export class AppGraphqlApi extends appsync.GraphqlApi {
  constructor(scope: Construct, props: AppGraphqlApiProps) {
    super(scope, 'AppGraphqlApi', {
      name: 'react-app-graphql-api',
      definition: appsync.Definition.fromFile(
        `${PROJECT_ROOT}/graphql/schema.graphql`
      ),
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

    const lambdaResolver = new nodejs.NodejsFunction(scope, 'LambdaResolver', {
      entry: `${BACKEND_ROOT}/src/graphql/hello_resolver.ts`,
      handler: 'handler',
      projectRoot: BACKEND_ROOT,
      depsLockFilePath: `${BACKEND_ROOT}/package-lock.json`
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
