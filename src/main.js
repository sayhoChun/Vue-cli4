import Vue from 'vue'
import App from './App.vue'
import store from './store'
import {router} from '../routes/index'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Axios from "axios";
import qs from 'qs'
import Constants from "./Constants";

Vue.prototype.$http = Axios;
Vue.prototype.qs = qs;
Vue.prototype.CONSTANTS = Constants;
Vue.prototype.Vue = Vue;

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app');
