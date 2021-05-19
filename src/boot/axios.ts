import axios, { AxiosInstance } from 'axios'
import { boot } from 'quasar/wrappers'
import {
  Loading,
  QSpinnerDots
} from 'quasar'

declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosInstance;
  }
}

export default boot(({ Vue }) => {
  axios.defaults.baseURL = 'https://backend-ope.herokuapp.com'
  console.log(process.env.API)

  Vue.prototype.$axios = axios
  Vue.prototype.$axios.interceptors.request.use(async function (config: { hasOwnProperty: (arg0: string) => never; optLoading: { spinner: never; spinnerColor: never; message: never; delay: never }; showLoading: boolean }) {
    const optLoading = {
      spinner: (config.hasOwnProperty('spinner')) ? config.optLoading.spinner : QSpinnerDots,
      spinnerColor: (config.hasOwnProperty('spinnerColor')) ? config.optLoading.spinnerColor : 'secondary',
      message: (config.hasOwnProperty('message')) ? config.optLoading.message : '',
      delay: (config.hasOwnProperty('delay')) ? config.optLoading.delay : 400
    }

    if (!config.hasOwnProperty('showLoading') || config.showLoading) {
      // @ts-ignore
      Loading.show(optLoading)
      await sleep(2000)
    }

    return config
  }, function (error: any) {
    return Promise.reject(error)
  })

  Vue.prototype.$axios.interceptors.response.use(function (response: any) {
    Loading.hide()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response
  }, function (error: any) {
    if (error.response.status === 401 && error.response.config.url !== 'auth/login') {
      localStorage.setItem('user', '')
      localStorage.setItem('token', '')
      axios.defaults.headers.common.Authorization = ''

      window.location.href = '/'
    }

    Loading.hide()
    return Promise.reject(error)
  })

  axios.defaults.headers.common.Authorization = localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
})

/**
 * Criaçaõ de sleep para controle de loading
 *
 * @param ms
 */
function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
