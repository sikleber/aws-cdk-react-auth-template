import { Match, Template } from 'aws-cdk-lib/assertions'
import * as cdk from 'aws-cdk-lib'
import { testConfig } from '../globalFixtures'
import { BackendStack } from '../../src/stacks/backendStack'
import { AuthStack } from '../../src/stacks/authStack'

let template: Template

beforeAll(() => {
  const app = new cdk.App()
  const authStack = new AuthStack(app, 'TestAuthStack', testConfig)
  const stack = new BackendStack(
    app,
    'TestReactAppStack',
    testConfig,
    authStack
  )
  template = Template.fromStack(stack)
})

describe('REST API', () => {
  it('should be created', () => {
    template.hasResource('AWS::ApiGateway::RestApi', {
      Type: 'AWS::ApiGateway::RestApi',
      Properties: {
        Name: 'react-app-rest-api'
      }
    })
  })

  it('should create a API deployment', () => {
    template.hasResource('AWS::ApiGateway::Deployment', {
      Type: 'AWS::ApiGateway::Deployment'
    })
  })

  it('should create a API stage', () => {
    template.hasResource('AWS::ApiGateway::Stage', {
      Type: 'AWS::ApiGateway::Stage',
      Properties: {
        StageName: 'prod',
        RestApiId: {
          Ref: Match.stringLikeRegexp('AppRestApi')
        }
      }
    })
  })

  it('should have number of resources', () => {
    template.resourceCountIs('AWS::ApiGateway::Resource', 1)
  })

  it('should have GET hello method with authorizer', () => {
    template.hasResource('AWS::ApiGateway::Method', {
      Type: 'AWS::ApiGateway::Method',
      Properties: {
        HttpMethod: 'GET',
        AuthorizationType: 'COGNITO_USER_POOLS',
        AuthorizerId: {
          Ref: Match.stringLikeRegexp('CognitoUserPoolsAuthorizer')
        }
      }
    })
  })
})

describe('Lambda Function', () => {
  it('should count lambda functions', () => {
    // + 1 for log retention
    template.resourceCountIs('AWS::Lambda::Function', 3)
  })
})

describe('CDK Outputs', () => {
  it('should output the GraphQL API URL', () => {
    template.hasOutput('AppGraphqlApiUrl', {
      Value: {
        'Fn::GetAtt': [Match.stringLikeRegexp('AppGraphqlApi*'), 'GraphQLUrl']
      }
    })
  })

  it('should output the GraphQL API region', () => {
    template.hasOutput('AppGraphqlApiRegion', {
      Value: {
        Ref: 'AWS::Region'
      }
    })
  })

  it('should output the REST API URL', () => {
    template.hasOutput('*', {
      Value: {
        'Fn::Join': Match.anyValue()
      }
    })
  })
})
