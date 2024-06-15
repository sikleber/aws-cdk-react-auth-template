import { Match, Template } from 'aws-cdk-lib/assertions'
import * as cdk from 'aws-cdk-lib'
import { ReactAppStack } from '../../src/stacks/reactAppStack'
import { testConfig } from '../globalFixtures'

let template: Template

beforeAll(() => {
  const app = new cdk.App()
  const stack = new ReactAppStack(app, 'TestReactAppStack', testConfig)
  template = Template.fromStack(stack)
})

describe('Deployment Bucket', () => {
  it('should create a S3 bucket', () => {
    template.hasResource('AWS::S3::Bucket', {
      Type: 'AWS::S3::Bucket',
      DeletionPolicy: 'Delete'
    })
  })

  it('should only be one S3 bucket', () => {
    template.resourceCountIs('AWS::S3::Bucket', 1)
  })
})

describe('CloudFront Distribution', () => {
  it('should create a CloudFront distribution', () => {
    template.hasResource('AWS::CloudFront::Distribution', {
      Type: 'AWS::CloudFront::Distribution',
      Properties: {
        DistributionConfig: {
          Origins: [
            {
              DomainName: {
                'Fn::GetAtt': [
                  Match.stringLikeRegexp('ReactAppDeploymentBucket*'),
                  'RegionalDomainName'
                ]
              }
            }
          ],
          DefaultRootObject: 'index.html',
          DefaultCacheBehavior: {
            Compress: true,
            ViewerProtocolPolicy: 'redirect-to-https'
          },
          CustomErrorResponses: [
            {
              ErrorCode: 404,
              ResponseCode: 200,
              ResponsePagePath: '/index.html'
            },
            {
              ErrorCode: 403,
              ResponseCode: 200,
              ResponsePagePath: '/index.html'
            }
          ]
        }
      }
    })
  })
})

describe('CDK Outputs', () => {
  it('should count 3 outputs', () => {
    expect(Object.keys(template.findOutputs('*')).length).toBe(3)
  })

  it('should output the Deployment Bucket Name', () => {
    template.hasOutput('ReactAppDeploymentBucketName', {
      Value: {
        Ref: Match.stringLikeRegexp('ReactAppDeploymentBucket*')
      }
    })
  })

  it('should output the CloudFront Distribution Domain Name', () => {
    template.hasOutput('ReactAppDistributionDomainName', {
      Value: {
        'Fn::GetAtt': [
          Match.stringLikeRegexp('ReactAppDistribution*'),
          'DomainName'
        ]
      }
    })
  })

  it('should output the CloudFront Distribution ID', () => {
    template.hasOutput('ReactAppDistributionId', {
      Value: {
        Ref: Match.stringLikeRegexp('ReactAppDistribution*')
      }
    })
  })
})
