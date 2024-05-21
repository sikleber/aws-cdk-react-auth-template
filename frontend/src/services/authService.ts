import {
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommandInput,
  InitiateAuthCommandOutput,
  AuthenticationResultType,
  SignUpCommandOutput,
  SignUpCommandInput,
  CognitoIdentityProviderClient
} from '@aws-sdk/client-cognito-identity-provider'

const COGNITO_USER_POOL_CLIENT_ID = process.env.COGNITO_USER_POOL_CLIENT_ID
const COGNITO_REGION = process.env.COGNITO_REGION

const cognitoClient = new CognitoIdentityProviderClient({
  region: COGNITO_REGION
})

export const signIn = async (
  username: string,
  password: string
): Promise<AuthenticationResultType> => {
  const params: InitiateAuthCommandInput = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: COGNITO_USER_POOL_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password
    }
  }

  try {
    const command = new InitiateAuthCommand(params)
    const { AuthenticationResult }: InitiateAuthCommandOutput =
      await cognitoClient.send(command)
    if (AuthenticationResult) {
      sessionStorage.setItem('idToken', AuthenticationResult.IdToken || '')
      sessionStorage.setItem(
        'accessToken',
        AuthenticationResult.AccessToken || ''
      )
      sessionStorage.setItem(
        'refreshToken',
        AuthenticationResult.RefreshToken || ''
      )
      return AuthenticationResult
    }
  } catch (error) {
    console.error('Error signing in: ', error)
    throw error
  }

  throw new Error('Error signing in. No authentication result returned.')
}

export const signUp = async (
  username: string,
  email: string,
  password: string
): Promise<SignUpCommandOutput> => {
  const params: SignUpCommandInput = {
    ClientId: COGNITO_USER_POOL_CLIENT_ID,
    Username: username,
    Password: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email
      }
    ]
  }
  try {
    const command = new SignUpCommand(params)
    const response = await cognitoClient.send(command)
    console.log('Sign up success: ', response)
    return response
  } catch (error) {
    console.error('Error signing up: ', error)
    throw error
  }
}

export const confirmSignUp = async (
  username: string,
  code: string
): Promise<boolean> => {
  const params = {
    ClientId: COGNITO_USER_POOL_CLIENT_ID,
    Username: username,
    ConfirmationCode: code
  }
  try {
    const command = new ConfirmSignUpCommand(params)
    await cognitoClient.send(command)
    console.log('User confirmed successfully')
    return true
  } catch (error) {
    console.error('Error confirming sign up: ', error)
    throw error
  }
}
