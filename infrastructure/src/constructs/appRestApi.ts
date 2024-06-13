import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs'

const PROJECT_ROOT = `${__dirname}/../../..`
const BACKEND_ROOT = `${PROJECT_ROOT}/backend`

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
      }
    })

    const handlerLambda = new nodejs.NodejsFunction(
      scope,
      'LambdaRestHandler',
      {
        entry: `${BACKEND_ROOT}/src/rest/hello_handler.ts`,
        handler: 'handler',
        projectRoot: BACKEND_ROOT,
        depsLockFilePath: `${BACKEND_ROOT}/package-lock.json`
      }
    )

    const handlerResource = this.root.addResource('hello')
    handlerResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(handlerLambda)
    )
  }
}
