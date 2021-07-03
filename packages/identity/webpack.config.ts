import * as path from 'path';
import * as webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

const allowlist = [/^@nws\/core/];
const config: webpack.Configuration = {
  mode: 'production',
  entry: './src/server.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'server.bundle.js',
  },
  devtool: 'source-map',

  externals: [
    //@ts-ignore
    nodeExternals({
      allowlist,
    }),
    //@ts-ignore
    nodeExternals({
      modulesDir: path.join(__dirname, '../../node_modules'),
      allowlist,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, '..', 'core')],
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  target: 'node',
};

export default config;
