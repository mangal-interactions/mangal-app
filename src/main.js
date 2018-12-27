// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import '@fortawesome/fontawesome-free/css/all.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLogger from 'vuejs-logger'
import Vuetify from 'vuetify'
import store from './store'
import 'vuetify/dist/vuetify.min.css'
import 'leaflet'
import 'leaflet.markercluster'
import 'leaflet/dist/leaflet.css'
const L = window.L

Vue.config.productionTip = false

const LoggerOptions = {
  isEnabled: true,
  logLevel: 'debug',
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: '|',
  showConsoleColors: true
}

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

Vue.use(Vuetify, {
  iconfont: 'fa'
})
Vue.use(VueLogger, LoggerOptions)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
