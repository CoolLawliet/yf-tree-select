import YfTreeSelect from './yf-tree-select/index';
const components = [YfTreeSelect];

// 定义 install 方法
const install = function(Vue) {
    if (install.installed) return;
    install.installed = true;
    // 遍历并注册全局组件
    components.forEach(component => {
        Vue.component(component.name, component);
    });
};
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}
export {
    YfTreeSelect
}
export default {
    // 导出的对象必须具备一个 install 方法
    install,
    YfTreeSelect
}