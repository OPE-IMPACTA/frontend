<template>
  <section class="tarefas-container">
    <transition mode="out-in">
      <div v-if="tarefas && tarefas.length" class="tarefas" key="produtos">
        <div class="tarefa" v-for="(tarefa, index) in tarefas" :key="index">
          <router-link :to="{ name: 'tarefas' }">
            <div class="projeto">{{ tarefa.project }}</div>
            <div class="usuario">{{ tarefa.user }}</div>
            <div class="cliente">{{ tarefa.client }}</div>
            <div class="dataInicio">{{ tarefa.startDate }}</div>
            <div class="dataFim">{{ tarefa.endDate }}</div>
            <div class="horas">{{ tarefa.hours }}</div>
            <div class="descricao">{{ tarefa.description }}</div>
          </router-link>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'TarefasList',
  data () {
    return {
      tarefas: null,
      tarefasPorPaginas: 9,
      tarefasTotal: 0
    }
  },
  methods: {
    getTarefas () {
      this.tarefas = null

      void this.$axios('tasks').then(resp => {
        this.tarefas = resp.data.data
      })
    }
  },
  created () {
    this.getTarefas()
    console.log(this.tarefas)
  }
})
</script>

<style scoped>

* {
  box-sizing: border-box;
}

body,
ul,
li,
h1,
div,
p {
  padding: 0;
  margin: 0;
}

ul {
  list-style: none;
}

body {
  font-family: Helvetica, sans-serif;
  color: #345;

}

a {
  color: #345;
  text-decoration: none;
}

img {
  max-width: 100%;
  display: block;
}

.tarefas-container {
  max-width: 1000px;
  margin: 0 auto;
}

.tarefas {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 30px;
  margin: 30px;
}

.tarefa {
  box-shadow: 0 4px 8px rgba(30, 60, 90, 0.1);
  padding: 10px;
  background: #fff;
  border-radius: 4px;
  transition: all 0.2s;
}

.tarefa:hover {
  box-shadow: 0 6px 12px rgba(30, 60, 90, 0.2);
  transform: scale(1.1);
  position: relative;
  z-index: 1;
}

.projeto {
  margin-bottom: 10px;
}

</style>
