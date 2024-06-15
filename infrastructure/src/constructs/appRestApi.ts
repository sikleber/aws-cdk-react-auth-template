import { Construct } from 'constructs'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as path from 'path'

const PROJECT_ROOT = path.join(__dirname, '..', '..', '..')
const BACKEND_ROOT = path.join(PROJECT_ROOT, 'backend')

export interface AppRestApiProps {
  authUserPool: cognito.UserPool
  authUserPoolClient: cognito.UserPoolClient
  logRetentionDays: number
}

export class AppRestApi extends apigateway.RestApi {
  constructor(scope: Construct, props: AppRestApiProps) {
    super(scope, 'AppRestApi', {
      restApiName: 'react-app-rest-api',
      defaultMethodOptions: {
        authorizationType: apigateway.AuthorizationType.COGNITO,
        authorizer: new apigateway.CognitoUserPoolsAuthorizer(
          scope,
          'CognitoUserPoolsAuthorizer',
          {
            cognitoUserPools: [props.authUserPool]
          }
        )
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS
      }
    })

    const handlerLambda = new nodejs.NodejsFunction(
      scope,
      'LambdaRestHandler',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(BACKEND_ROOT, 'src/rest/hello_handler.ts'),
        handler: 'handler',
        projectRoot: BACKEND_ROOT,
        depsLockFilePath: path.join(BACKEND_ROOT, 'package-lock.json')
      }
    )

    const handlerResource = this.root.addResource('hello')
    handlerResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(handlerLambda)
    )
  }
}
