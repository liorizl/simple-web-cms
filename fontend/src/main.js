// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './routers/router'
//import ElementUI from 'element-ui';
//import 'element-ui/lib/theme-chalk/index.css';
import axios from "axios"
import vueCookies from 'vue-cookies';
import "./assets/less/index.less";
Vue.use(vueCookies)
//Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.axios=axios
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router:router,
    components: { App }
})
