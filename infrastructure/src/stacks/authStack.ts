import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import { AppConfig } from '../config'

export class AuthStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool
  public readonly userPoolClient: cognito.UserPoolClient

  constructor(
    scope: Construct,
    id: string,
    config: AppConfig,
    props?: cdk.StackProps
  ) {
    super(scope, id, props)

    this.userPool = new cognito.UserPool(this, 'AppUserPool', {
      userPoolName: 'react-app-user-pool',
      signInAliases: { username: true, email: true },
      signInCaseSensitive: false,
      selfSignUpEnabled: true,
      autoVerify: { email: true },
      keepOriginal: { email: true }, // keep original email until change is verified
      passwordPolicy: {
        minLength: 8,
        requireDigits: true,
        requireLowercase: true,
        requireUppercase: true,
        requireSymbols: false,
        tempPasswordValidity: cdk.Duration.days(3)
      },
      mfa: cognito.Mfa.OFF,
      deletionProtection: config.removalPolicy !== cdk.RemovalPolicy.DESTROY,
      removalPolicy: config.removalPolicy,
      standardAttributes: {}, // set standard (built-in) user attributes
      customAttributes: {}, // set custom user attributes
      userInvitation: {
        emailSubject: 'Invite to join our awesome app!',
        emailBody:
          'Hello, you have been invited to join our awesome app!\n' +
          'Username: {username}\n' +
          'Temporary password: {####}\n' +
          'Sign in here: {##Verify email##}'
      },
      userVerification: {
        emailSubject: 'Verify your email for our awesome app!',
        emailBody:
          'Hello, thanks for signing up to our awesome app! ' +
          'Your verification code is: {####}\n',
        emailStyle: cognito.VerificationEmailStyle.CODE
      }
    })

    // Todo: see if this is something to do
    // https://aws.amazon.com/blogs/security/protect-public-clients-for-amazon-cognito-by-using-an-amazon-cloudfront-proxy/
    this.userPoolClient = this.userPool.addClient('WebClient', {
      userPoolClientName: 'web-app-client',
      accessTokenValidity: cdk.Duration.days(1),
      idTokenValidity: cdk.Duration.days(1),
      authSessionValidity: cdk.Duration.minutes(15),
      authFlows: {
        userSrp: true
      },
      oAuth: {
        flows: { implicitCodeGrant: true },
        scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL],
        callbackUrls: ['http://localhost:3000']
      }
    })

    new cdk.CfnOutput(this, 'CognitoUserPoolId', {
      value: this.userPool.userPoolId
    })
    new cdk.CfnOutput(this, 'CognitoUserPoolClientId', {
      value: this.userPoolClient.userPoolClientId
    })
    new cdk.CfnOutput(this, 'CognitoRegion', {
      value: this.region
    })
  }
}
