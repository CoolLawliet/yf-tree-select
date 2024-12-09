/*
 * @moduleName:
 * @Author: dawdler
 * @LastModifiedBy: dawdler
 * @Date: 2019-01-30 16:02:54
 * @LastEditTime: 2020-12-26 14:56:35
 */
const isProduction = process.env.NODE_ENV === 'production';
module.exports = {
    publicPath: './',
    filenameHashing: false,
    productionSourceMap: false,
    lintOnSave: true,
    chainWebpack: config => {
        if (isProduction) {
            // 忽略打包
            config.externals({
                vue: 'Vue',
                'element-ui': 'ElementUI'
            });
        }
    },
    // css相关配置
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: false,
        // 开启 CSS source maps?
        sourceMap: false
    },
    pluginOptions: {
        storybook: {
            allowedPlugins: ['define']
        }
    }
};