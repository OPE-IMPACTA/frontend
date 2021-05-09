import VueCompositionApi from '@vue/composition-api'
import { boot } from 'quasar/wrappers'
// @ts-ignore
import VueSweetalert2 from 'vue-sweetalert2'

// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css'
import JsonExcel from "vue-json-excel";

export default boot(({ Vue }) => {

  Vue.use(VueCompositionApi)
  Vue.use(VueSweetalert2)
  Vue.component("downloadExcel", JsonExcel)
  Vue.prototype.$channelEvents = new Vue;
  Vue.prototype.$constantsEvents = {
    SHOW_CREATE_TEST: 'show-create-test',
    SHOW_UPDATE_TEST: 'show-update-test',
    SEND_COMMAND_ACTION: 'send-command-to-action',
    ADD_OPERATION_QUEUE: 'add-operation-queue',
    DATE_PICKER_FILTER: 'date-picker-filter'
  }
})
