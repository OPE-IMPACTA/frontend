<template>
  <section>
    <h1>👍 Compre ou Venda 👎</h1>
    <ProjectsBuscar />
    <ProjectsLista />
  </section>
</template>

<script>
import ProjectsBuscar from '../components/Cards/ProjectsBuscar.vue'
import ProjectsLista from '../components/Cards/ProjectsList.vue'

export default {
  name: 'Home',
  components: {
    ProjectsBuscar,
    ProjectsLista
  }
}
</script>

<style scoped>
h1 {
  color: #87f;
  margin-top: 40px;
  font-size: 2rem;
  text-align: center;
}
</style>
