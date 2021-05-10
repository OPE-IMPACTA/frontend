<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-10">
      <TaskCard></TaskCard>
    </div>
  </q-page>
</template>

<script lang="ts">
import TaskCard from "../components/Cards/TaskCard.vue"
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Home',
  components: { TaskCard },

  data () {
    return {

    }
  },
  mounted: function () {
    if (typeof this.$axios.defaults.headers.common['Authorization'] === 'undefined' || this.$axios.defaults.headers.common['Authorization'] === '') {
      this.$router.push({ path: '/' })
    }
  },
  methods: {}

})

</script>
