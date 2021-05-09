<template>
  <q-page class="q-ma-md">
    <div class="row">
      <div class="col-lg-10 col-sm-10 col-md-10 offset-1">
        <h3>Gráficos</h3>
        <div class="col-lg-5 col-sm-5 col-md-5">
          <q-field label="Que tipo de gráfico você deseja?" style="width: 50%">
            <q-select
              type="radio"
              style="width: 100%"
              color="primary"
              v-model="model" :options="options" />
          </q-field>
        </div>
        <donutChart v-if="model == 'Rosca'"> </donutChart>
        <columnChart v-if="model == 'Coluna'"> </columnChart>
        <barChart v-if="model == 'Barra'"> </barChart>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
let dataItems = require('components/Report/Elements/dataItems.js');
import donutChart from "components/Report/donutChart.vue";
import columnChart from "components/Report/columnChart.vue";
import barChart from "components/Report/barChart.vue";
import {defineComponent} from "@vue/composition-api";

export default defineComponent({
  name: 'Gráficos',
  components: {donutChart, columnChart, barChart},

  data() {
    return {
      model: null,
      options: [
        'Coluna',
        'Barra',
        'Rosca'
      ]
    }
  },
  mounted: function () {
    if (typeof this.$axios.defaults.headers.common['Authorization'] == 'undefined' || this.$axios.defaults.headers.common['Authorization'] === '') {
      this.$router.push({ path: '/' })
    }
  },
  methods: {}

})

</script>
