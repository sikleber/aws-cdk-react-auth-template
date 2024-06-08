import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: '../graphql/schema.graphql',
  documents: './src/graphql/*.{ts,tsx}',
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/graphql/__generated__/': {
      preset: 'client'
    }
  }
}

export default config
