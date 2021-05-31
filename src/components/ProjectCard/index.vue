<template>
  <div class="q-pa-md" style="max-width: 600px">
    <q-list>
      <q-expansion-item
        v-for="project in this.project"
        :key="project._id"
        :label="`${project.name}`"
        :caption="`${project.status}`"
        icon="content_paste"
        class="q-mb-xl shadow-up-3 bg-blue-grey-1 text-blue text-h6"
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
export default {
  props: {
    project: Array
  }
}
</script>

<style lang="scss" scoped>
.card-section {
  background: $grey-1;
  margin-bottom: -20px;
}
</style>
