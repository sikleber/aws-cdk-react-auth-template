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

describe('CDK Outputs', () => {
  it('should count 3 outputs', () => {
    expect(Object.keys(template.findOutputs('*')).length).toBe(3)
  })

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
      Export: { Name: 'AppRestApiUrl' },
      Value: {
        'Fn::Join': Match.anyValue()
      }
    })
  })
})
