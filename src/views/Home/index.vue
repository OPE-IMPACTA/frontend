<template>
  <q-page>
    <div class="column items-center justify-center bg-blue-grey-1">
      <div class="text-h4 text-weight-regular q-mt-xl">
        Projetos
      </div>
      <div class="text-h6 text-weight-light q-mb-xl q-mt-sm">
        Detalhes de todos os projetos
      </div>
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

        <div class="col-8">
          <p
            v-if="hasError"
            class="text-h6 text-center q-mt-xl"
          >
            Aconteceu um erro ao carregar os projetos 🥺
          </p>
          <p
            v-if="this.projects.length && this.isLoading && !this.hasError"
            class="text-h6 text-center q-mt-xl"
          >
            Ainda nenhum feedback recebido 🥺
          </p>
          <project-card-loading
            v-if="isLoading"
            class="project-card"
          />
          <project-card
            v-else
            class="project-card"
            :project="projects" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import Filters from './Filters'
import FiltersLoading from './FiltersLoading'
import ProjectCard from '../../components/ProjectCard'
import ProjectCardLoading from '../../components/ProjectCard/ProjectCardLoading'
import services from '../../services'
import sleep from '../../utils/sleep'
import { clearLocalStorage } from 'src/utils/local-storage'

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
  components: { Filters, FiltersLoading, ProjectCard, ProjectCardLoading },
  methods: {
    async changeProjectsType (type) {
      try {
        this.isLoading = true
        this.pagination.offset = 0
        this.pagination.limit = 5
        this.type = type
        const { data } = await services.project.getProjects()
        await sleep(1000)

        this.projects = data.data
        this.isLoading = false
      } catch (error) {
        this.handleError(error)
      }
    },

    async fetchProjects () {
      try {
        this.isLoading = true
        const { data, errors } = await services.project.getProjects()

        if (!errors) {
          await sleep(1000)
          this.projects = data.data
          this.isLoading = false
          return
        }

        if (errors.status === 401) {
          clearLocalStorage()
          await this.$router.push({ name: 'Login' })
        }
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
