// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import "@fortawesome/fontawesome-free/css/all.css";
import Vue from "vue";
import App from "./App";
import router from "./router";
import VueLogger from "vuejs-logger";
import Vuetify from "vuetify";
import store from "./store";
import "vuetify/dist/vuetify.min.css";
import VueAnalytics from "vue-analytics";

//process.env.BASE_URL = "http://localhost:3004/api/v2/";
//console.log("process.env.BASE_URL");
//console.log(process.env.BASE_URL);

Vue.config.productionTip = false;

const LoggerOptions = {
  isEnabled: true,
  logLevel: "debug",
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: "|",
  showConsoleColors: true
};

Vue.use(Vuetify, {
  iconfont: "fa",
  theme: {
    primary: "#004e6b",
    secondary: "#008c77"
  }
});

Vue.use(VueLogger, LoggerOptions);

Vue.use(VueAnalytics, {
  id: "UA-144176171-1"
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
