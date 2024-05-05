import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3_deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as cf from 'aws-cdk-lib/aws-cloudfront'
import * as cf_origin from 'aws-cdk-lib/aws-cloudfront-origins'
import { AppConfig } from '../config'

export class ReactAppStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    config: AppConfig,
    props?: cdk.StackProps
  ) {
    super(scope, id, props)

    const deploymentBucket = new s3.Bucket(this, 'ReactAppDeploymentBucket', {
      removalPolicy: config.removalPolicy
    })
    new s3_deploy.BucketDeployment(this, 'ReactAppDeployment', {
      sources: [s3_deploy.Source.asset('../frontend/dist')],
      destinationBucket: deploymentBucket
    })

    const originAccessIdentity = new cf.OriginAccessIdentity(
      this,
      'ReactAppOriginAccessIdentity'
    )
    deploymentBucket.grantRead(originAccessIdentity)

    const distribution = new cf.Distribution(this, 'ReactAppDistribution', {
      defaultBehavior: {
        origin: new cf_origin.S3Origin(deploymentBucket),
        viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        // Single Page App takes care of routing. Serve every path with index.html
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html'
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html'
        }
      ]
    })

    // output the CloudFront domain name
    new cdk.CfnOutput(this, 'ReactAppDistributionDomainName', {
      value: distribution.distributionDomainName
    })
  }
}
