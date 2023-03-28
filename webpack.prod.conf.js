new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false,
    drop_console: true,
  },
  sourceMap: true,
});
