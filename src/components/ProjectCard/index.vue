<template>
  <div class="q-pa-md" style="max-width: 600px">
    <q-list>
      <q-expansion-item
        v-for="project in project"
        :key="project._id"
        :label="`${project.name}`"
        :caption="`${STATUS[project.status].label}`"
        :icon="`${STATUS[project.status].icon}`"
        class="q-mb-xl shadow-2 text-h6"
        :class="`${STATUS[project.status].text}-8`"
      >
        <q-card>
          <q-card-section class="card-section">
            <div class="text-subtitle1 text-blue-grey-10 text-weight-bold">Cliente</div>
            <div class="text-subtitle2 text-blue-grey-10 text-weight-light">{{ project.client }}</div>
          </q-card-section>
        </q-card>
        <q-card>
          <q-card-section class="card-section">
            <div class="text-subtitle1 text-blue-grey-10 text-weight-bold">Usuário</div>
            <div class="text-subtitle2 text-blue-grey-10 text-weight-light">{{ project.user }}</div>
          </q-card-section>
        </q-card>
        <q-card>
          <q-card-section class="card-section">
            <div class="text-subtitle1 text-blue-grey-10 text-weight-bold">Descrição</div>
            <div class="text-subtitle2 text-blue-grey-10 text-weight-light">{{ project.description }}</div>
          </q-card-section>
        </q-card>
        <q-card v-if="project.task">
          <q-card-section class="card-section">
            <div class="text-subtitle1 text-blue-grey-10 text-weight-bold">Tarefas</div>
            <div class="bg-grey-2 shadow-1">
              <div class="q-ml-sm q-mt-sm text-subtitle1 text-primary text-weight-light">Descrição</div>
              <div class="q-ml-sm text-subtitle2 text-blue-grey-10 text-weight-light">{{ project.task.description }}</div>
              <div class="q-ml-sm text-subtitle1 text-primary text-weight-light">Data inicio</div>
              <div class="q-ml-sm text-subtitle2 text-blue-grey-10 text-weight-light">{{ project.task.startDate | formatDate }}</div>
              <div class="q-ml-sm text-subtitle1 text-primary text-weight-light">Data final</div>
              <div class="q-ml-sm text-subtitle2 text-blue-grey-10 text-weight-light">{{ project.task.endDate | formatDate }}</div>
              <div class="q-ml-sm text-subtitle1 text-primary text-weight-light">Horas</div>
              <div class="q-ml-sm text-subtitle2 text-blue-grey-10 text-weight-light">{{ project.task.hours }} horas</div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script>

import { STATUS } from 'src/utils/constant'

export default {
  props: {
    project: Array
  },
  data () {
    return {
      STATUS
    }
  }
}
</script>

<style lang="scss" scoped>
.card-section {
  background: $grey-1;
  margin-bottom: -20px;
}
</style>
