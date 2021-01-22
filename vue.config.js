module.exports = {
    publicPath: "./", // ./相对路径
    productionSourceMap: false, // 打包时不生成.map文件
    // 这里写你调用接口的基础路径，来解决跨域
    devServer: {
        open: true,
        proxy: {
            '/dev-api': {
                target: 'http://127.0.0.1:8889/',
                pathRewrite: { '^/dev-api': '' }
            }
        }
    }
}