import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import axios from 'axios'
import './styles.scss'


axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
Vue.use(ElementUI)

Vue.prototype.$http = axios;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
