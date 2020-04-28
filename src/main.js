import Vue from 'vue'
import App from './App.vue'
import {router} from '../routes/index'
import Axios from "axios";
import store from '../store'
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import qs from 'qs'
import Constants from "./Constants";
import VueSweetalert2 from "vue-sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';
import AuthPlugin from "./plugins/AuthPlugin";

Vue.prototype.$http = Axios;
Vue.prototype.qs = qs;
Vue.prototype.CONSTANTS = Constants;
Vue.prototype.Vue = Vue;
Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(VueSweetalert2);
Vue.use(IconsPlugin);
Vue.use(AuthPlugin);

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app');
