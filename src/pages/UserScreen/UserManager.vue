<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-11">
      <UserList v-if="!show_create_user && !show_update_user" :hide_create="show_create_user" @showCreate="showCreate"
                @showUpdate="showUpdate" :hide_update="show_update_user"></UserList>
      <UserRegister v-if="show_create_user"  :edit-item="editItem" @showCreate="showCreate"></UserRegister>
      <UserUpdate v-if="show_update_user" :edit-item="editItem" @showUpdate="showUpdate"></UserUpdate>
    </div>
  </q-page>
</template>

<script lang="ts">
import UserList from 'components/UserScreen/userList.vue'
import UserRegister from './UserRegister.vue'
import UserUpdate from './UserUpdate.vue'

import { defineComponent } from '@vue/composition-api'
const defaultItem = {
  name: '',
  email: '',
  group_id: false,
  password: '',
  confirmPassword: ''
}
export default defineComponent({
  name: 'UserManager',
  components: { UserList, UserUpdate, UserRegister },
  data () {
    return {
      show_create_user: false,
      show_update_user: false,
      editItem: {}
    }
  },
  methods: {
    showCreate (hide) {
      this.show_create_user = hide
    },

    showUpdate (data) {
      this.editItem = data.editItem
      this.show_update_user = data.show
    }
  },

  mounted: function () {
    if (typeof this.$axios.defaults.headers.common['Authorization'] == 'undefined' || this.$axios.defaults.headers.common['Authorization'] === '') {
      this.$router.push({ path: '/' })
    }
  }
})
</script>
