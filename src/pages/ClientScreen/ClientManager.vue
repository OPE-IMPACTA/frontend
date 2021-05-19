<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-11">
      <ClientList v-if="!show_create_client && !show_update_client" :hide_create="show_create_client" @showCreate="showCreate"
                @showUpdate="showUpdate" :hide_update="show_update_client"></ClientList>
      <ClientRegister v-if="show_create_client"  :edit-item="editItem" @showCreate="showCreate"></ClientRegister>
      <ClientUpdate v-if="show_update_client" :edit-item="editItem" @showUpdate="showUpdate"></ClientUpdate>
    </div>
  </q-page>
</template>

<script lang="ts">
import ClientList from '../../components/ClientScreen/clientList.vue'
import ClientRegister from '../../components/ClientScreen/ClientRegister.vue'
import ClientUpdate from '../../components/ClientScreen/ClientUpdate.vue'

import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ClientManager',
  components: { ClientList, ClientUpdate, ClientRegister },
  data () {
    return {
      show_create_client: false,
      show_update_client: false,
      editItem: {}
    }
  },
  methods: {
    showCreate (hide: boolean) {
      this.show_create_client = hide
    },

    // eslint-disable-next-line @typescript-eslint/ban-types
    showUpdate (data: { editItem: {}; show: boolean }) {
      this.editItem = data.editItem
      this.show_update_client = data.show
    }
  },

  mounted: function () {
    if (typeof this.$axios.defaults.headers.common.Authorization === 'undefined' || this.$axios.defaults.headers.common.Authorization === '') {
      void this.$router.push({ path: '/' })
    }
  }
})
</script>
