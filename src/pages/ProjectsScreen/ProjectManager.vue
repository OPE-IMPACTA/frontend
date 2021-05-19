<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-11">
      <ProjectList v-if="!show_create_project && !show_update_project" :hide_create="show_create_project" @showCreate="showCreate"
                @showUpdate="showUpdate" :hide_update="show_update_project"></ProjectList>
      <ProjectRegister v-if="show_create_project"  :edit-item="editItem" @showCreate="showCreate"></ProjectRegister>
      <ProjectUpdate v-if="show_update_project" :edit-item="editItem" @showUpdate="showUpdate"></ProjectUpdate>
    </div>
  </q-page>
</template>

<script lang="ts">
import ProjectList from '../../components/ProjectScreen/projectList.vue'
import ProjectRegister from '../../components/ProjectScreen/projectRegister.vue'
import ProjectUpdate from '../../components/ProjectScreen/projectUpdate.vue'

import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ProjectManager',
  components: { ProjectList, ProjectUpdate, ProjectRegister },
  data () {
    return {
      show_create_project: false,
      show_update_project: false,
      editItem: {}
    }
  },
  methods: {
    showCreate (hide: boolean) {
      this.show_create_project = hide
    },

    // eslint-disable-next-line @typescript-eslint/ban-types
    showUpdate (data: { editItem: {}; show: boolean }) {
      this.editItem = data.editItem
      this.show_update_project = data.show
    }
  },

  mounted: function () {
    if (typeof this.$axios.defaults.headers.common.Authorization === 'undefined' || this.$axios.defaults.headers.common.Authorization === '') {
      void this.$router.push({ path: '/' })
    }
  }
})
</script>
