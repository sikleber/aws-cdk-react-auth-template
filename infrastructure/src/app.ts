#!/usr/src/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { ReactAppStack } from './stacks/reactAppStack'
import { getAppConfig } from './config'

const app = new cdk.App()

const config = getAppConfig(app.node.getContext('config') as string)

new ReactAppStack(app, 'ReactAppStack', config)

app.synth()
