//
// Copyright 2020 DxOS.org
//

module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react'
  ],
  plugins: [
    [
      'babel-plugin-inline-import', {
        extensions: [
          '.mustache',
          '.graphql'
        ]
      }
    ],

    // Allows export of components importing GQL files (without webpack).
    'import-graphql',
    'inline-json-import',

    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from'
  ]
};
