var path = require("path");
module.exports = {
    entry: {
        app: ["./app/main.ts"]
    },
    output: {
        path: path.resolve(__dirname, "build"),
        publicPath: "/build/",
        filename: "bundle.js"
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
};