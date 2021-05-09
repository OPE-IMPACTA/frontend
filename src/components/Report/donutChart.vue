<template>
  <q-page class="q-pa-sm">
    <div class="echarts">
      <div class="q-ma-md">
        <q-card flat bordered class="shadow q-pa-none q-ma-none">
          <q-card-section>
            <div :class="!$q.dark.isActive? 'text-grey-7':'text-white'" class="text-h6">Situação dos testes
              <q-btn flat dense icon="fas fa-download" class="float-right" @click="SaveImage('testes')"
                     :color="!$q.dark.isActive? 'grey-8':'white'">
                <q-tooltip>Download</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>

          <q-separator class="full-width" inset></q-separator>

          <q-card-section>
            <IEcharts ref="testes" :option="pieOptions" :resizable="true" style="height:270px"/>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import {exportFile} from "quasar";
import IEcharts from "vue-echarts-v3/src/full.js";
import echarts from 'echarts';

export default {

  components: {
    IEcharts
  },

  data() {
    return {
      listItems: [],
      listValues: [],
      listNames: []
    };
  },

  mounted() {
    this.$axios.get('/tests/chart/')
      .then((response) => {
        this.listItems = response.data
        this.listItems.forEach((item) => {
          this.listValues.push(item.value)
          this.listNames.push(item.name)
        })
      })
      .catch((error) => {
        console.log(error)
      })
  },

  created: function () {
  },

  methods: {
    SaveImage(type) {
      const linkSource = this.$refs[type].getDataURL();
      const downloadLink = document.createElement('a');
      document.body.appendChild(downloadLink);
      downloadLink.href = linkSource;
      downloadLink.target = '_self';
      downloadLink.download = type + '.png';
      downloadLink.click();
    },
    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map(col => wrapCsvValue(col.label))].concat(
        this.data.map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'activity.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    }
  },

  computed: {
    pieOptions() {
      return {
        tooltip: {
          show: true
        },
        legend: {
          orient: 'horizontal',
          bottom: 0,
          width: 500,
          textStyle: {
            color: this.$q.dark.isActive ? 'white' : '#676767'
          }
        },
        color: ['#21BA45', '#C10015', '#FF9f00', '#1976D2'],
        series: [
          {
            name: 'Testes',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: 'inner',
                formatter: function (param, index) {
                  return param.value
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            selectedMode: 'single',
            data: this.listItems
          }
        ]
      }
    }
  }
};
</script>



