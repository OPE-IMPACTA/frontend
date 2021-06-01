<template>
  <div class="q-pa-md" style="max-width: 600px">
    <q-list>
      <q-expansion-item
        v-for="project in project"
        :key="project._id"
        :label="`${project.name}`"
        :caption="`${STATUS[project.status].label}`"
        :icon="`${STATUS[project.status].icon}`"
        class="q-mb-xl shadow-up-3 text-h6"
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
        <q-card>
          <q-card-section class="card-section">
            <div class="text-subtitle1 text-blue-grey-10 text-weight-bold">Tarefas</div>
            <div class="text-subtitle2 text-blue-grey-10 text-weight-light">Aqui são todas as tarefas</div>
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
