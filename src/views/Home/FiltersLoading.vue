<template>
  <div class="q-pa-md">
    <q-item style="max-width: 340px">
      <q-item-section>
        <q-skeleton type="text" width="100px" height="80px" class="title-filter"/>
      </q-item-section>
    </q-item>

    <q-item
      style="max-width: 340px"
      class="item-filters"
      v-for="item in this.labelsCount"
      :key="item"
    >
      <q-item-section avatar>
        <q-skeleton type="circle" width="15px" height="15px" class="q-ml-md"/>
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <q-skeleton type="text" height="30px"/>
        </q-item-label>
      </q-item-section>

      <q-item-section avatar>
        <q-skeleton type="circle" width="15px" height="15px" class="q-mr-md"/>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
const LABELS = {
  all: 'Todos',
  new: 'Novo',
  progress: 'Em andamento',
  completed: 'Finalizado',
  canceled: 'Cancelado'
}

export default {
  data () {
    return {
      labelsCount: ''
    }
  },
  mounted () {
    this.labelsCount = Object.keys(LABELS)
  }
}
</script>

<style scoped>

.item-filters {
  margin-bottom: -20px;
}

.title-filter {
  margin-bottom: -20px;
}
</style>
