import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'

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

    const handlerLambda = new lambda.Function(scope, 'HandlerLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async (event, context) => {
          const username = event.identity.username
          return \`Hello \${username} from backend handler!\`
        }
      `)
    })

    const handlerResource = this.root.addResource('hello')
    handlerResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(handlerLambda)
    )
  }
}
