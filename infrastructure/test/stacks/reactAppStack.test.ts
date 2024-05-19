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

describe('Bucket Deployment', () => {
  it('should create a bucket deployment', () => {
    template.hasResource('Custom::CDKBucketDeployment', {
      Type: 'Custom::CDKBucketDeployment',
      Properties: {
        DestinationBucketName: {
          Ref: Match.stringLikeRegexp('ReactAppDeploymentBucket*')
        }
      }
    })
  })

  it('should only be one bucket deployment', () => {
    template.resourceCountIs('Custom::CDKBucketDeployment', 1)
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

describe('Template Output', () => {
  it('should contain a CloudFront distribution domain name output', () => {
    template.hasOutput('ReactAppDistributionDomainName', {
      Value: {
        'Fn::GetAtt': [
          Match.stringLikeRegexp('ReactAppDistribution*'),
          'DomainName'
        ]
      }
    })
  })
})
