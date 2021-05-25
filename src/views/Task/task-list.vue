<template>
  <q-page class="q-pa-sm row items-center justify-evenly">
    <div class="col-md-11 col-lg-11 col-sm-5">
      <q-card>
        <q-card-section>
          <div class="title text-center text-dark q-pt-lg">
            Gerenciamento de tarefas
          </div>
        </q-card-section>
        <q-table
          title=""
          :data="data"
          :hide-header="mode === 'grid'"
          :columns="columns"
          row-key="_id"
          :loading="loading"
          :grid="mode === 'grid'"
          :filter="filter"
          :pagination.sync="pagination"
        >
          <template v-slot:top-left>
            <q-btn
              rounded
              icon="add"
              label="Nova tarefa"
              class="bg-orange text-white"
              @click="handleShowCreate"
            />
          </template>
          <template v-slot:top-right>
            <q-input
              outlined
              dense
              debounce="300"
              v-model="filter"
              placeholder="Pesquisar..."
              class="q-mr-xl"
              style="width: 400px"
            >
              <template v-slot:append>
                <q-icon name="search" class="text-primary"/>
              </template>
            </q-input>

            <q-btn
              rounded
              flat
              color="blue"
              icon-right="archive"
              label="Exportar"
              no-caps
              class="q-mr-xl"
              @click="exportTable"
            />
          </template>

          <template #body-cell-action="props">
            <q-td class="text-center">
              <div class="q-gutter-sm">
                <q-btn
                  dense
                  glossy
                  push
                  class="btn-size-md text-white bg-green"
                  field="actions"
                  title="Editar"
                  icon="edit"
                  @click="handleEditItem(props.row)"
                />
                <q-btn
                  dense
                  glossy
                  push
                  class="btn-size-md text-white bg-red"
                  field="actions"
                  title="Deletar"
                  icon="delete"
                  @click="handleGetDelete(props.row)"
                />
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import services from 'src/services'
import { exportFile, date } from 'quasar'
import { clearLocalStorage } from 'src/utils/local-storage'
import sleep from 'src/utils/sleep'
import { warning } from 'src/utils/sweet-alert'

const defaultItem = {
  project_id: '',
  user_id: '',
  description: '',
  startDate: '',
  endDate: '',
  hours: ''
}

export default {
  name: 'TaskList',
  data () {
    return {
      filter: '',
      group: '',
      mode: 'list',
      loading: false,
      show_form: false,
      editedItem: defaultItem,
      columns: [
        {
          name: 'project',
          required: true,
          label: 'Projeto',
          align: 'left',
          field: 'project',
          sortable: true
        },
        {
          name: 'user',
          align: 'left',
          label: 'Usuário',
          field: 'user',
          sortable: true
        },
        {
          name: 'client',
          align: 'left',
          label: 'Cliente',
          field: 'client',
          sortable: true
        },
        {
          name: 'description',
          align: 'left',
          label: 'Descrição',
          field: 'description',
          sortable: true
        },
        {
          name: 'startDate',
          align: 'left',
          label: 'Data início',
          sortable: true,
          field: row => date.formatDate(row.startDate, 'DD/MM/YYYY')
        },
        {
          name: 'endDate',
          align: 'left',
          label: 'Data final',
          sortable: true,
          field: row => date.formatDate(row.endDate, 'DD/MM/YYYY')
        },
        {
          name: 'hours',
          align: 'left',
          label: 'Hora',
          field: 'hours',
          sortable: true
        },
        {
          name: 'action',
          align: 'center',
          label: 'Ações',
          field: 'actions'
        }
      ],
      data: [],
      pagination: {
        rowsPerPage: 7
      }
    }
  },
  mounted () {
    this.onRequest({
      pagination: this.pagination,
      filter: undefined
    })
  },
  methods: {
    exportTable () {
      const header = ['Projetos', 'Usuários', 'Cliente', 'Descrição', 'Data início', 'Data final', 'Hora']

      const content = this.data.map(row => {
        return `\r\n"${row.project}", "${row.user}", "${row.client}", "${row.description}", "${row.startDate}", "${row.endDate}", ${row.hours}`
      })
      const result = `"${header.join('","')}"\r\n${content}`

      const status = exportFile('tasks-management.csv', result, 'text/csv')

      if (status !== true) {
        this.$toast.error('Erro ao fazer o download...', {
          timeout: 2000
        })
      }
    },
    async onRequest (props) {
      const {
        page,
        rowsPerPage,
        sortBy,
        descending
      } = props.pagination
      const filter = props.filter
      this.loading = true

      setTimeout(async () => {
        this.pagination.rowsNumber = this.getRowsNumberCount(filter)

        const fetchCount =
          rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage

        const startRow = (page - 1) * rowsPerPage

        await this.fetchFromServer(
          startRow,
          fetchCount,
          filter,
          sortBy,
          descending
        )

        // this.data.splice(0, this.data.length, ...returnedData)

        this.pagination.page = page
        this.pagination.rowsPerPage = rowsPerPage
        this.pagination.sortBy = sortBy
        this.pagination.descending = descending

        this.loading = false
      }, 1500)
    },
    async fetchFromServer (startRow, count, filter, sortBy, descending) {
      try {
        const {
          data,
          errors
        } = await services.task.getTasks()

        if (errors && errors.status === 401) {
          clearLocalStorage()
          this.$toast.error('Token inválido', {
            timeout: 2000
          })
          await this.$router.push({ name: 'Login' })
        }
        this.data = data.data
      } catch (error) {
        this.$toast.error('Ocorreu um erro ao buscar as tarefas', {
          timeout: 2000
        })
      }

      const data = filter
        ? this.data.filter(row => row.title.includes(filter))
        : this.data.slice()

      // handle sortBy
      if (sortBy) {
        const sortFn = sortBy === 'desc'
          ? descending
            ? (a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0)
            : (a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
          : descending
            ? (a, b) => parseFloat(b[sortBy]) - parseFloat(a[sortBy])
            : (a, b) => parseFloat(a[sortBy]) - parseFloat(b[sortBy])
        data.sort(sortFn)
      }

      return data.slice(startRow, startRow + count)
    },
    getRowsNumberCount (filter) {
      let count = 0
      this.data.forEach(treat => {
        if (treat.name.includes(filter)) {
          ++count
        }
      })
      return count
    },
    handleShowCreate () {
      this.editedItem = defaultItem
      this.$router.push({ name: 'TaskRegister' })
    },
    handleEditItem (item) {
      this.$router.push({
        name: 'TaskUpdate',
        params: { editItem: item }
      })
    },
    async handleGetDelete (item) {
      const response = await warning(
        'Deletar tarefa',
        'Tem certeza que deseja deletar a tarefa?',
        'Deletar'
      )

      if (response.isConfirmed) {
        await this.handleDelete(item)
      }
    },
    async handleDelete (item) {
      try {
        const { _id: id } = item
        const {
          errors
        } = await services.task.deleteTask(id)

        if (!errors) {
          this.refresh()
          this.$toast.success('Deletado com sucesso', {
            timeout: 2000
          })
          return
        }

        if (errors.status === 401) {
          this.$toast.error('Token inválido!', {
            timeout: 2000
          })
          clearLocalStorage()
          await this.$router.push({ name: 'Login' })
          return
        }

        if (errors.status === 400) {
          this.$toast.error('Não foi possível deletar a tarefa!', {
            timeout: 2000
          })
        }
        await sleep(2000)
      } catch (error) {
        this.$toast.error('Ocorreu um erro ao deletar a tarefa!', {
          timeout: 2000
        })
      }
    },
    refresh () {
      this.data = []
      this.onRequest({
        filter: '',
        pagination: this.pagination
      })
    }
  }
}
</script>

<style scoped>
.btn-size-md {
  font-size: 12px;
}

.title {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 1.5rem;
}
</style>
