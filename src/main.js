import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import YfTreeSelect from "../packages/yf-tree-select";

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(YfTreeSelect)
new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
