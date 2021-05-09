<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-11">
      <List v-if="!hide_create && !hide_update" :edit-item="editedItem" :hide_create="hide_create" :hide_update="hide_update"></List>
      <TestRegister v-if="hide_create"></TestRegister>
      <TestUpdate v-if="hide_update" :edit-item="editedItem"></TestUpdate>
    </div>
  </q-page>

</template>

<script>
import List from 'components/TestScreen/List.vue'
import TestRegister from './TestRegister.vue'
import TestUpdate from './TestUpdate.vue'

export default {
  name: 'TestManager',
  components: { List, TestRegister, TestUpdate },
  data () {
    return {
      hide_create: false,
      hide_update: false,
      editedItem: []
    }
  },
  created() {
    this.$channelEvents.$on(this.$constantsEvents.SHOW_CREATE_TEST, (hide) => {
      this.hide_create = hide
    })

    this.$channelEvents.$on(this.$constantsEvents.SHOW_UPDATE_TEST, (data) => {
      this.editedItem = data.editItem
      this.hide_update = data.hide
    })
  },
  methods: {}
}
</script>
