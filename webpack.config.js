const path = require('path');

module.exports = {
    entry: path.resolve('./src/index.js'),
    devServer: {
        contentBase: './dist'
    },
    output: {
        path: path.resolve('./dist'),
        filename: 'bundle.js',
    },
    module: {
        rules:[
            {
                test: /\.css$/,
                use: [ { loader: 'style-loader' },
                {
                    loader: 'css-loader',
                    options: {
                        modules: true
                    }
                }]
            },
        ]
    }
};