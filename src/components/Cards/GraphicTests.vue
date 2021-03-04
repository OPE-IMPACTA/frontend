<template>
    <q-card-section class="row">
    <div class="col-lg-7 col-sm-12 col-xs-12 col-md-7">
      <div class="row">
        <div class="col-lg-3 col-md-3 col-xs-6 col-sm-6">
          <q-item>
            <q-item-section top avatar>
              <q-avatar color="orange-4" text-color="white" icon="stop" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6 text-grey-8 text-bold">9876</q-item-label>
              <q-item-label caption>Parados</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-lg-3 col-md-3 col-xs-6 col-sm-6">
          <q-item>
            <q-item-section top avatar>
              <q-avatar color="green-6" text-color="white" icon="keyboard_arrow_down" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6 text-green-6 text-bold">10200</q-item-label>
              <q-item-label caption>Sucesso</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-lg-3 col-md-3 col-xs-6 col-sm-6">
          <q-item>
            <q-item-section top avatar>
              <q-avatar color="red-10" text-color="white" icon="error" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6 text-orange-8 text-bold">800</q-item-label>
              <q-item-label caption>Erros</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>
      <div>
        <IEcharts style="height: 250px" :option="getSalesOptions" :resizable="true" />
      </div>
    </div>
    <div class="col-lg-5 col-sm-12 col-xs-12 col-md-5">
      <q-item>
        <q-item-section avatar class="">
          <q-icon color="blue" name="fas fa-gift" class="q-pl-md" size="24px" />
        </q-item-section>

        <q-item-section>
          <div class="text-h6">TESTES DO DIA</div>
        </q-item-section>
      </q-item>
      <div>
        <IEcharts style="height: 250px" :option="getPieOptions" :resizable="true" />
      </div>
    </div>
    </q-card-section>
</template>


<script lang="ts">
import IEcharts from "vue-echarts-v3/src/full.js";
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'GraphicTests',
  components: { IEcharts },

  data () {
    return {

    }
  },
  mounted: function () {
    if (typeof this.$axios.defaults.headers.common['Authorization'] == 'undefined' || this.$axios.defaults.headers.common['Authorization'] === '') {
        this.$router.push({ path: '/' })
    }
  },
  computed: {
    getSalesOptions() {
      return {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // Coordinate axis indicator, coordinate axis trigger is valid
            type: "shadow" // The default is a straight line, optional:'line' |'shadow'
          }
        },
        grid: {
          left: "2%",
          right: "2%",
          top: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          }
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "Parados",
            type: "bar",
            data: [124, 100, 20, 120, 117, 70, 110, 90, 50, 90, 20, 50],
            color: "#fdb84b"
          },
          {
            name: "Sucesso",
            type: "bar",
            data: [17, 2, 0, 29, 20, 10, 23, 0, 8, 20, 11, 30],
            color: "#08971e"
          },
          {
            name: "Erros",
            type: "bar",
            data: [20, 100, 80, 14, 90, 86, 100, 70, 120, 50, 30, 60],
            color: "#cc0013"
          }
        ]
      };
    },
    getPieOptions() {
      return {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          bottom: 10,
          left: "center",
          data: ["Novos", "Processando", "Parados", "Sucesso", "Erros"]
        },
        series: [
          {
            name: "Testes",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: false,
                fontSize: "30",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: 87,
                name: "Novos",
                itemStyle: {
                  color: "#666666"
                }
              },
              {
                value: 87,
                name: "Processando",
                itemStyle: {
                  color: "#687bf1"
                }
              },
              {
                value: 150,
                name: "Sucesso",
                itemStyle: {
                  color: "#08971e"
                }
              },
              {
                value: 50,
                name: "Erros",
                itemStyle: {
                  color: "#a00214"
                }
              },
              {
                value: 100,
                name: "Parados",
                itemStyle: {
                  color: "#fdb84b"
                }
              }
            ]
          }
        ]
      };
    }
  },
  methods: {}

})

</script>
