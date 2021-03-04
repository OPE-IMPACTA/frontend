<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-11">
      <q-card name="graphicTests">
        <q-card-section>
          <q-card-title>
            <div class="text-h6 text-center xt-grey-8">
              Relatório de Testes
            </div>
          </q-card-title>
        </q-card-section>
        <q-card-section class="q-pa-none">
          <template>
            <div class="q-pa-md">
              <q-table
                :grid="$q.screen.xs"
                title=""
                :data="data"
                :columns="columns"
                row-key="name"
                :filter="filter"
                selection="single"
                :selected.sync="selected"
                :loading="loading"
              >
                <template v-slot:top-right="props">
                  <q-btn
                    flat
                    color="blue"
                    icon-right="archive"
                    label="Exportar"
                    no-caps
                    @click="exportTable"
                  />
                </template>

                <template #body-cell-status="props">
                  <q-td :props="props">
                    <q-chip :color="props.row.status == 'Sucesso' ? 'green': props.row.status == 'Erro' ? 'red': props.row.status == 'Processando' ? 'blue' : 'grey'" text-color="white" dense class="text-weight-bolder" square>{{props.row[props.col.name]}}</q-chip>
                  </q-td>
                </template>

                <template v-slot:top-left>
                  <q-input outlined borderless dense debounce="300" v-model="filter" placeholder="Pesquisar">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </template>
              </q-table>
            </div>
          </template>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { exportFile, Notify} from "quasar"

function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== void 0
    ? formatFn(val)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

const defaultItem = {
  name: '',
  projeto: '',
  usuario: '',
  status: '',
  descricao: ''
}

export default {
  data () {
    return {
      selected: [],
      filter: '',
      loading: false,
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      columns: [
        {
          name: 'desc',
          required: true,
          label: 'Nome',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'projeto', align: 'center', label: 'Projeto', field: 'projeto', sortable: true },
        { name: 'usuario', align: 'center', label: 'Usuário', field: 'usuario', sortable: true },
        { name: 'descricao', align: 'center', label: 'Descrição (BDD)', field: 'descricao' },
        { name: 'status', align: 'center', label: 'Status', field: 'status' },
        { name: 'data', align: 'center', label: 'Data', field: 'data'}
      ],
      data: [],
      original: [
        {
          id: 1,
          name: 'Teste Login',
          projeto: 'poc-3',
          usuario: 'Thai',
          status: 'Sucesso',
          descricao: 'Teste de login com falha de senha',
          data: "20/01/2021"
        },
        {
          id: 2,
          name: 'Teste Tela inicial',
          projeto: 'poc-3',
          usuario: 'Thai',
          status: 'Erro',
          descricao: 'Teste de Tela Inicial',
          data: "20/01/2021"
        },
        {
          id: 3,
          name: 'Teste Tela inicial',
          projeto: 'poc-3',
          usuario: 'Thai',
          status: 'Sucesso',
          descricao: 'Teste de Tela Inicial',
          data: "10/01/2021"
        },
        {
          id: 4,
          name: 'Teste Tela inicial',
          projeto: 'poc-3',
          usuario: 'Thai',
          status: 'Sucesso',
          descricao: 'Teste de Tela Inicial',
          data: "05/01/2021"
        },
        {
          id: 5,
          name: 'Teste Tela inicial',
          projeto: 'poc-3',
          usuario: 'Thai',
          status: 'Erro',
          descricao: 'Teste de Tela Inicial',
          data: "20/01/2021"
        },
        {
          id: 6,
          name: 'Teste Tela inicial',
          projeto: 'poc-3',
          usuario: 'Thai',
          status: 'Erro',
          descricao: 'Teste de Tela Inicial',
          data: "15/01/2021"
        },
      ],
      noti: () => {},
      show_dialog: false,
      editedIndex: -1,
      editedItem: defaultItem,
      mode: "list",
      currencyColumns: this.columns,
      currencyData: this.original,
      page: 1,
      totalRecord: 0,
      pageCount: 1,
    }
  },

  mounted () {
    if (typeof this.$axios.defaults.headers.common['Authorization'] == 'undefined' || this.$axios.defaults.headers.common['Authorization'] === '') {
      this.$router.push({ path: '/' })
    }
    // get initial data from server (1st page)
    this.onRequest({
      pagination: this.pagination,
      filter: undefined
    })
  },

  methods: {
    exportTable () {
      // naive encoding to csv format
      const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
        this.data.map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'table-export.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
    onRequest (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const filter = props.filter

      this.loading = true

      // emulate server
      setTimeout(() => {
        // update rowsCount with appropriate value
        this.pagination.rowsNumber = this.getRowsNumberCount(filter)

        // get all rows if "All" (0) is selected
        const fetchCount = rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage

        // calculate starting row of data
        const startRow = (page - 1) * rowsPerPage

        // fetch data from "server"
        const returnedData = this.fetchFromServer(startRow, fetchCount, filter, sortBy, descending)

        // clear out existing data and add new
        this.data.splice(0, this.data.length, ...returnedData)

        // don't forget to update local pagination object
        this.pagination.page = page
        this.pagination.rowsPerPage = rowsPerPage
        this.pagination.sortBy = sortBy
        this.pagination.descending = descending

        // ...and turn of loading indicator
        this.loading = false
      }, 1500)
    },

    // emulate ajax call
    // SELECT * FROM ... WHERE...LIMIT...
    fetchFromServer (startRow, count, filter, sortBy, descending) {
      const data = filter
        ? this.original.filter(row => row.name.includes(filter))
        : this.original.slice()

      // handle sortBy
      if (sortBy) {
        const sortFn = sortBy === 'desc'
          ? (descending
              ? (a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0)
              : (a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
          )
          : (descending
              ? (a, b) => (parseFloat(b[sortBy]) - parseFloat(a[sortBy]))
              : (a, b) => (parseFloat(a[sortBy]) - parseFloat(b[sortBy]))
          )
        data.sort(sortFn)
      }

      return data.slice(startRow, startRow + count)
    },

    // emulate 'SELECT count(*) FROM ...WHERE...'
    getRowsNumberCount (filter) {
      if (!filter) {
        return this.original.length
      }
      let count = 0
      this.original.forEach((treat) => {
        if (treat.name.includes(filter)) {
          ++count
        }
      })
      return count
    },
  },
}
</script>
