import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:5042/graphql',
  documents: './src/**/*.ts',
  generates: {
    './src/services/api/generated.service.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-apollo-angular'],
      config: {
        addExplicitOverride: true,
      },
    }
  }
}
export default config
