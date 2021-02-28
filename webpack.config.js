const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const tsImportPluginFactory = require('ts-import-plugin')
tsImportPluginFactory({ style: true })
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')

module.exports = {
    module: {
        rules: [
            {
                test: [/\.jsx?$/, /\.tsx?$/],
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(scss|sass)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'file-loader?hash=sha512&digest=hex&name=img/[contenthash].[ext]',
                    'image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false',
                ],
            },
            {
                test: /\.(html|txt)$/i,
                use: ['file-loader?hash=sha512&digest=hex&name=img/[contenthash].[ext]'],
            },
        ],
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
    entry: [
        'react-hot-loader/patch', // activate HMR for React
        'webpack-dev-server/client?http://localhost:1234', // bundle the client for webpack-dev-server and connect to the provided endpoint
        'webpack/hot/only-dev-server', // bundle the client for hot reloading, only- means to only hot reload for successful updates
        './src/index.tsx', // the entry point of our app
    ],
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        contentBase: path.resolve('./dist'),
        historyApiFallback: true,
        compress: true,
        port: 3030,
        hot: true,
    },
    devtool: 'cheap-module-source-map',
    plugins: [
        new webpack.ProvidePlugin({
            React: 'react',
        }),
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(true),
        }),
        new AntdDayjsWebpackPlugin(),
        new CopyWebpackPlugin({
            // static files to the site root folder (index and robots)
            patterns: [
                {
                    from: './static/**/*',
                    to: path.resolve('./dist/[name].[ext]'),
                },
            ],
        }),
        new HtmlWebpackPlugin(),
    ],
}
