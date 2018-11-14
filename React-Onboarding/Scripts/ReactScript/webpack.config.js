module.exports = {
    context: __dirname,
    mode: 'development',
    entry:  {
        customer: "./CustomersIndex.js",
        product: "./Product.js",
        store: "./Store.js",
        sales:"./Sales.js",
        navmenu: "./NavBar.js"
       
    }
,
    output: {
            path: __dirname + "/dist",
            filename: "[name].bundle.js"
    }
    ,
    watch: true,
    resolve: {
        extensions: [".jsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', "@babel/preset-react"],
                        plugins: [require('@babel/plugin-proposal-object-rest-spread'), "@babel/plugin-proposal-class-properties"]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    }
};

