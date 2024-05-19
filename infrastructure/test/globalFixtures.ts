import { AppConfig } from '../src/config'
import * as cdk from 'aws-cdk-lib'

export const testConfig: AppConfig = {
  removalPolicy: cdk.RemovalPolicy.DESTROY
}
