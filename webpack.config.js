const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "widget.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/captcha-widget/", // Adjusted if needed based on GitHub Pages repo name
    library: "CAPTCHAWidget",
    libraryTarget: "umd",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      // Adding rule for image files
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "images", // All images will be placed inside 'images' folder in the output directory
              name: "[name].[ext]", // Keep the original name and extension
              publicPath: (url) =>
                `https://t-ukowski.github.io/captcha-widget/images/${url}`, // Ensure correct path for GitHub Pages
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      inject: true,
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },
};
