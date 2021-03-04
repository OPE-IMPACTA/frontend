import VueCompositionApi from '@vue/composition-api'
import { boot } from 'quasar/wrappers'
// @ts-ignore
import VueSweetalert2 from 'vue-sweetalert2'

// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css'

export default boot(({ Vue }) => {

  Vue.use(VueCompositionApi)
  Vue.use(VueSweetalert2)
  Vue.prototype.$channelEvents = new Vue;
  Vue.prototype.$constantsEvents = {
    SEND_COMMAND_ACTION: 'send-command-to-action',
    ADD_OPERATION_QUEUE: 'add-operation-queue'
  }
})
