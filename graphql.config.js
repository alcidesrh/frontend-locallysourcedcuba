module.exports = {
  schema: 'http://127.0.0.1:8000/api/graphql', //['src/graphql/schema.graphql'],
  documents: ['**/*.{graphql,js,ts,jsx,tsx,vue}'],
  extensions: {
    codegen: [
      {
        generator: 'graphql-codegen',
        language: 'typescript',
        output: {
          binding: 'src/graphql/@types/types.d.ts',
        },
      },
    ],
    endpoints: {
      default: {
        url: 'http://127.0.0.1:8000/api/graphql',
        //   headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
      },
    },
  },
};
