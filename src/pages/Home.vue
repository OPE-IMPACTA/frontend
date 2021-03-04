<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-10">
      <GraphicTests></GraphicTests>
    </div>
  </q-page>
</template>

<script lang="ts">
import IEcharts from "vue-echarts-v3/src/full.js"
import GraphicTests from "components/Cards/GraphicTests.vue"
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Home',
  components: { GraphicTests, IEcharts },

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
