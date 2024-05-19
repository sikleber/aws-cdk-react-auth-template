import { AppConfig, getAppConfig } from '../src/config'
import * as cdk from 'aws-cdk-lib'

let config: AppConfig

beforeAll(() => {
  config = getAppConfig('test')
})

describe('Config', () => {
  it('should equal test config', () => {
    expect(config).toEqual({
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })
  })
})
