"use strict";
var webpack = require('webpack');

var config = {
    entry: ["./app/app.js"],
    output: {
        path: './static',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.(js|jsx)$/, exclude: /node_modules/, loaders: ['react-hot', "babel?stage=0"] },
            { test: /\.css$/, exclude: /node_modules/, loader: "style!css" },
            { test: /\.json$/, loader: "json-loader" },
            { test: /\.(png|gif|jpg|jpeg)$/, loader: "url-loader?prefix=font/" },
            { test: /\.html$/, exclude: /node_modules/, loader: "file?name=[name].[ext]" }
        ]
    },
    devtools: 'source-map',
    resolve: {
        extensions: ['','.js','.json','.css'],
        modulesDirectories: ["node_modules"]
    },
    externals: {
        fs: '{}'
    },
    node: {
        console: true,
        net: "empty",
        tls: "empty"
    }
};

module.exports = config;
