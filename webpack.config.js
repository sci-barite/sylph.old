const path = require("path");
const glob = require("glob");
const CopyPlugin = require("copy-webpack-plugin"); 

module.exports = {
    entry: glob.sync('./src/**/*.ts').reduce(function(obj, el) { 
        obj[path.parse(el).name] = el;
        return obj;
    }, {}),
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        module: true
    },
    module: {
        rules: [
            // All .ts and .tsx files should be handled by ts-loader
            {test: /\.tsx?$/, loader: "ts-loader"}
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [{
                from: "**",
                to: path.resolve(__dirname, "dist"),
                context: path.resolve(__dirname, "src"),
                globOptions: {
                    ignore: ["**/*.ts"]
                },
                force: true,
            }]
        })
    ],
    optimization: {
        minimize: false,
        usedExports: true,
        concatenateModules: true
    },
    experiments: {
        outputModule: true
    }
}