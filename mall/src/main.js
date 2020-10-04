import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './assets/config/api'
import './assets/config/rem'
import '../node_modules/@iconfu/svg-inject/src/svg-inject.js'
import util from './util'

Vue.use(util);

Vue.config.productionTip = false;
Vue.config.devtools = true;
// 看一些配置

new Vue({
    router,
    store,
    render: h => h(App),
    data: {
        api, // 组件可以直接通过this.$root.api而非import api使用该文件的内容
    }
}).$mount('#app')