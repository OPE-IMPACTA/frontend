<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-11">
      <TaskList v-if="!show_create_task && !show_update_task" :hide_create="show_create_task" @showCreate="showCreate"
                @showUpdate="showUpdate" :hide_update="show_update_task"></TaskList>
      <TaskRegister v-if="show_create_task"  :edit-item="editItem" @showCreate="showCreate"></TaskRegister>
      <TaskUpdate v-if="show_update_task" :edit-item="editItem" @showUpdate="showUpdate"></TaskUpdate>
    </div>
  </q-page>
</template>

<script lang="ts">
import TaskList from '../../components/TaskScreen/taskList.vue'
import TaskRegister from '../../components/TaskScreen/TaskRegister.vue'
import TaskUpdate from '../../components/TaskScreen/TaskUpdate.vue'

import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'TasksManager',
  components: { TaskList, TaskUpdate, TaskRegister },
  data () {
    return {
      show_create_task: false,
      show_update_task: false,
      editItem: {}
    }
  },
  methods: {
    showCreate (hide) {
      this.show_create_task = hide
    },

    showUpdate (data) {
      this.editItem = data.editItem
      this.show_update_task = data.show
    }
  },

  mounted: function () {
    if (typeof this.$axios.defaults.headers.common['Authorization'] == 'undefined' || this.$axios.defaults.headers.common['Authorization'] === '') {
      this.$router.push({ path: '/' })
    }
  }
})
</script>
