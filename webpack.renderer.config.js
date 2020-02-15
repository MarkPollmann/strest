const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");

rules.push(
  {
    test: /\.css$/,
    use: [
      { loader: "style-loader" },
      { loader: "css-loader" },
      { loader: "postcss-loader" }
    ]
  },
  {
    test: /\.(png|svg|jpg|gif)$/,
    loader: 'file-loader',
    options: {
      publicPath: '..'
    }
  }
);

module.exports = {
  module: {
    rules
  },
  plugins: plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"]
  }
};
