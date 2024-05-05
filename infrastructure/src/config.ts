import * as cdk from 'aws-cdk-lib'

export interface AppConfig {
  readonly removalPolicy: cdk.RemovalPolicy
}

const defaultAppConfig: AppConfig = {
  removalPolicy: cdk.RemovalPolicy.RETAIN
}

/**
 * Reads the json configuration file for the given name and overrides the default configuration.
 *
 * @param name The name of the configuration file to read.
 */
export function getAppConfig(name?: string): AppConfig {
  return {
    ...defaultAppConfig,
    ...require(`../../config/${name}.json`)
  }
}
