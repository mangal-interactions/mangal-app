// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import Vue from 'vue'
import App from './App'
import { L, LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import router from './router'
import VueLogger from 'vuejs-logger'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'leaflet/dist/leaflet.css'

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

Vue.component('l-map', LMap)
Vue.component('l-tilelayer', LTileLayer)
Vue.component('l-marker', LMarker)
Vue.component('l-popup', LPopup)

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

Vue.use(Vuetify, { iconfont: 'mdi' })
Vue.use(VueLogger, LoggerOptions)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  data: () => ({
    drawer: null
  })
})
