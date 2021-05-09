import axios, { AxiosInstance } from 'axios'
import { boot } from 'quasar/wrappers'
import {
  Loading,
  QSpinnerPie
} from 'quasar'

declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosInstance;
  }
}

export default boot(({ Vue }) => {
  axios.defaults.baseURL = process.env.API

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Vue.prototype.$axios = axios
  Vue.prototype.$axios.interceptors.request.use(async function (config) {

    var optLoading = {
      spinner: (config.hasOwnProperty('spinner')) ? config.optLoading.spinner : QSpinnerPie,
      spinnerColor: (config.hasOwnProperty('spinnerColor')) ? config.optLoading.spinnerColor : 'yellow',
      message: (config.hasOwnProperty('message')) ? config.optLoading.message : '',
      delay: (config.hasOwnProperty('delay')) ? config.optLoading.delay : 400
    };

    if(!config.hasOwnProperty('showLoading') || config.showLoading !== false) {

      Loading.show(optLoading);
      await sleep(2000);
    }

    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  Vue.prototype.$axios.interceptors.response.use(function (response: any) {

    Loading.hide();
    return response;
  }, function (error: any) {

    if(error.response.status === 401 && error.response.config.url !== 'auth/login') {
      localStorage.setItem('user', '');
      localStorage.setItem('token', '');
      axios.defaults.headers.common['Authorization'] = '';

      window.location.href = '/';
    }

    Loading.hide();
    return Promise.reject(error);
  });

  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
})

/**
 * Criaçaõ de sleep para controle de loading
 *
 * @param ms
 */
function sleep(ms: int) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
