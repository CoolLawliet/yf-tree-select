import YfTreeSelect from './YfTreeSelect.vue';
// 为组件添加 install 方法，用于按需引入
YfTreeSelect.install = function(Vue) {
    Vue.component(YfTreeSelect.name, YfTreeSelect);
};
export default YfTreeSelect;