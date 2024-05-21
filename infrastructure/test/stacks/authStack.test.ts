import { Match, Template } from 'aws-cdk-lib/assertions'
import * as cdk from 'aws-cdk-lib'
import { testConfig } from '../globalFixtures'
import { AuthStack } from '../../src/stacks/authStack'

let template: Template

beforeAll(() => {
  const app = new cdk.App()
  const stack = new AuthStack(app, 'TestAuthStack', testConfig)
  template = Template.fromStack(stack)
})

describe('User Pool', () => {
  it('should create a Cognito User Pool', () => {
    template.hasResource('AWS::Cognito::UserPool', {
      Type: 'AWS::Cognito::UserPool',
      Properties: {
        UserPoolName: 'react-app-user-pool',
        AliasAttributes: ['email'],
        AutoVerifiedAttributes: ['email'],
        UsernameConfiguration: {
          CaseSensitive: false
        },
        Policies: {
          PasswordPolicy: {
            MinimumLength: 8,
            RequireLowercase: true,
            RequireUppercase: true,
            RequireNumbers: true
          }
        },
        MfaConfiguration: 'OFF',
        DeletionProtection: 'INACTIVE'
      },
      DeletionPolicy: 'Delete',
      UpdateReplacePolicy: 'Delete'
    })
  })
  it('should output the User Pool ID', () => {
    template.hasOutput('CognitoUserPoolId', {
      Value: {
        Ref: Match.stringLikeRegexp('AppUserPool*')
      }
    })
  })
  it('should output the stack region', () => {
    template.hasOutput('CognitoRegion', {
      Value: {
        Ref: 'AWS::Region'
      }
    })
  })
})

describe('User Pool Client', () => {
  it('should create a Cognito User Pool Client', () => {
    template.hasResource('AWS::Cognito::UserPoolClient', {
      Type: 'AWS::Cognito::UserPoolClient',
      Properties: {
        ClientName: 'web-app-client',
        UserPoolId: {
          Ref: Match.stringLikeRegexp('AppUserPool*')
        },
        AccessTokenValidity: 1440,
        IdTokenValidity: 1440,
        AllowedOAuthFlows: ['implicit'],
        AllowedOAuthFlowsUserPoolClient: true,
        AllowedOAuthScopes: ['openid', 'email'],
        AuthSessionValidity: 15,
        CallbackURLs: ['http://localhost:3000'],
        ExplicitAuthFlows: ['ALLOW_USER_SRP_AUTH', 'ALLOW_REFRESH_TOKEN_AUTH'],
        SupportedIdentityProviders: ['COGNITO'],
        TokenValidityUnits: {
          AccessToken: 'minutes',
          IdToken: 'minutes'
        }
      }
    })
  })

  it('should output the User Pool Client ID', () => {
    template.hasOutput('CognitoUserPoolClientId', {
      Value: {
        Ref: Match.stringLikeRegexp('AppUserPoolWebClient*')
      }
    })
  })
})
