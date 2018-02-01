import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VModal from 'vue-js-modal'

Vue.use(VModal)

Vue.config.productionTip = false

/* eslint-disable no-new */
window.addEventListener('load', () => {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
  })
})
