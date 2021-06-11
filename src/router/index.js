import Vue from 'vue'
import VueRouter from 'vue-router'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

import routes from './routes'

Vue.use(Toast)
Vue.use(VueSweetalert2)
Vue.use(VueRouter)

Vue.filter('formatDate', (valor) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  const date = new Date(valor)
  const dateTimeFormat = new Intl.DateTimeFormat('pt-br', options)
  return dateTimeFormat.format(date)
})

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}
