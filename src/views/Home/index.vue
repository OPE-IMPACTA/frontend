<template>
  <q-page>
    <div class="column items-center justify-center bg-grey-3">
      <h3 class="text-weight-regular q-mt-xl q-mb-sm">
        Projetos
      </h3>
      <h6 class="text-weight-light q-mb-xl q-mt-sm">
        Detalhes de todos os projetos
      </h6>
    </div>
    <div>
      <div class="row">
        <div class="container-filter col-4">
          <h4 class="q-ml-md">
            Listagem
          </h4>
          <filters
            v-if="!isLoading"
            @select="changeProjectsType"
            class="filters q-px-xl"
          />
          <filters-loading
            v-else
            class="filters q-px-xl"
          />
        </div>

        <div class=" col-8 bg-primary">
          <project-card class="project-card" :project="projects" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import Filters from './Filters'
import FiltersLoading from './FiltersLoading'
import ProjectCard from '../../components/ProjectCard'
import services from '../../services'
import sleep from '../../utils/sleep'

export default {
  data () {
    return {
      type: '',
      projects: [],
      isLoading: false,
      pagination: {
        limit: 5,
        offset: 0,
        total: 0
      },
      hasError: false
    }
  },
  components: { Filters, FiltersLoading, ProjectCard },
  methods: {
    async changeProjectsType (type) {
      try {
        this.isLoading = true
        this.pagination.offset = 0
        this.pagination.limit = 5
        this.type = type
        const { data } = await services.project.getProjects()
        this.projects = data.data

        await sleep(2000)
        this.isLoading = false
      } catch (error) {
        this.handleError(error)
      }
    },

    async fetchProjects () {
      try {
        this.isLoading = true
        const { data } = await services.project.getProjects()
        this.projects = data.data

        await sleep(2000)
        this.isLoading = false
      } catch (error) {
        this.handleError(error)
      }
    },
    handleError (error) {
      this.hasError = !!error
    }
  },
  mounted () {
    this.fetchProjects()
  }
}
</script>

<style lang="scss" scoped>

.title {
  font-family: 'Arial', sans-serif;
  font-size: 2.8rem;
  font-weight: bold;
  color: $primary;
  margin: 30px 0 0 0;
}

.subtitle {
  font-family: 'Arial', sans-serif;
  font-size: 1.3rem;
  margin-bottom: 30px;
  font-weight: unset;
}

.project-card {
  margin-top: 110px;
}

.container-project {
  padding-left: 5%;
}

.filters {
  margin-top: -60px;
  padding-left: 0;
}

.container-filter {
  padding-left: 5%;
}

</style>
