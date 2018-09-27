module.exports = {
  entry: ['./index.js'],
  mode: 'development',
  output: {
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader']
      }
    ]
  }
}