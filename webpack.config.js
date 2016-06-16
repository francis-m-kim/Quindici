module.exports = {
  context: __dirname,
  entry: "./lib/root.js",
  output: {
    path: "./lib/",
    filename: "bundle.js"
  },
  devtool: 'source-map'
};
