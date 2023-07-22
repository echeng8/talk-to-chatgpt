module.exports = {
    entry: './chrome-extension/src/index.ts',
    output: {
      filename: 'bundle.js',
      path: __dirname + '/chrome-extension/dist'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [
        { test: /\.tsx?$/, loader: 'ts-loader' }
      ]
    }, 
    mode: 'development',
    devtool: 'cheap-module-source-map',
  };
  