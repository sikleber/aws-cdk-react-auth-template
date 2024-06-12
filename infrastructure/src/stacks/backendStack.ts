import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { AppConfig } from '../config'
import * as appsync from 'aws-cdk-lib/aws-appsync'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import { AuthStack } from './authStack'
import { AppGraphqlApi } from '../constructs/appGraphqlApi'
import { AppRestApi } from '../constructs/appRestApi'

export class BackendStack extends cdk.Stack {
  public readonly graphqlApi: appsync.GraphqlApi
  public readonly restApi: apigateway.RestApi

  constructor(
    scope: Construct,
    id: string,
    config: AppConfig,
    authStack: AuthStack,
    props?: cdk.StackProps
  ) {
    super(scope, id, props)

    this.graphqlApi = new AppGraphqlApi(this, {
      authUserPool: authStack.userPool,
      authUserPoolClient: authStack.userPoolClient,
      logRetentionDays: config.logRetentionDays
    })

    new cdk.CfnOutput(this, 'AppGraphqlApiUrl', {
      value: this.graphqlApi.graphqlUrl
    })

    new cdk.CfnOutput(this, 'AppGraphqlApiRegion', {
      value: this.graphqlApi.env.region
    })

    this.restApi = new AppRestApi(this, {
      authUserPool: authStack.userPool,
      authUserPoolClient: authStack.userPoolClient,
      logRetentionDays: config.logRetentionDays
    })

    new cdk.CfnOutput(this, 'AppRestApiUrl', {
      value: this.restApi.url
    })
  }
}
