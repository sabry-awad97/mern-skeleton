const path = require("path");

const config = {
    name: "server",
    mode: "development",
    target: "node",
    entry: path.resolve(__dirname, "src", "server", "server.ts"),
    devtool: "inline-source-map",
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: /src/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "dist",
        filename: "server.generated.js",
    },
};

module.exports = config;