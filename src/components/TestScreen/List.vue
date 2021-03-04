<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-11">
      <q-card v-if="!show_dialog" name="listaTestes">
        <q-card-section>
          <q-card-title name="titleList">
            <div class="text-h6 text-center xt-grey-8">
              Gerenciamento de Testes
            </div>
          </q-card-title>
        </q-card-section>
        <q-card-section class="q-pa-md">
        <template>
            <q-table
              title=""
              :data="data"
              :columns="columns"
              row-key="_id"
              :loading="loading"
              :filter="filter"
              @request="onRequest"
            >

              <template v-slot:top>
                <q-btn color="green" icon="add" :disable="loading" label="Novo Teste" to="/testes/cadastrar" />
                <q-btn class="q-ml-sm" icon="refresh" color="blue" :disable="loading" @click="refreshTests()" />
                <q-space />
                <q-input outlined borderless dense debounce="300" v-model="filter" placeholder="Pesquisar">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>

              <template #body-cell-status="props">
                <q-td :props="props">
                  <q-chip :color="props.row.status === STATUS.SUCCESS ? 'green': props.row.status === STATUS.ERROR ? 'red': props.row.status === STATUS.RUNNING ? 'blue' : props.row.status === STATUS.PENDING ? 'orange' : 'grey'" text-color="white" dense class="text-weight-bolder" square>{{props.row[props.col.name]}}</q-chip>
                </q-td>
              </template>

              <template #body-cell-action="props">
                <q-td class="text-center">

                  <q-btn v-if="props.row.status === STATUS.NEW" dense flat round color="green" field="actions" title="Play" icon="play_circle" @click="playTest(props.row)"></q-btn>
<!--                  <q-btn dense flat round color="red" field="actions" title="Stop" icon="stop" @click="stopTest(props.row)"></q-btn>-->
                  <q-btn dense flat round color="blue" field="actions" title="Editar" icon="edit" @click="editItem(props.row)"></q-btn>
                  <q-btn dense flat round color="grey" field="actions" title="Deletar" icon="delete" @click="getDelete(props.row)"></q-btn>
                </q-td>
              </template>
            </q-table>

        </template>
        </q-card-section>
      </q-card>
        <template v-if="show_dialog">
          <TestUpdate :edit-item="editedItem" :show_dialog="show_dialog" @updateShowEdit="backToList"></TestUpdate>
        </template>
<!--        <div align="right">-->
<!--          <q-btn @click="backToList()" class="q-ma-md" label="Cancelar"></q-btn>-->
<!--        </div>-->
      </div>
  </q-page>
</template>

<script>
import { exportFile, Notify} from "quasar";
import TestUpdate from "./TestUpdate";

const defaultItem = {
  title: '',
  code: '',
  buyRate: '',
  spotRate: '',
  sellRate: '',
  symbol: '',
  status: ''
}

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

export default {
  name: 'List',
  components: { TestUpdate },
  data () {
    return {
      STATUS: require('../../constants/Application'),
      filter: '',
      loading: false,
      pagination: {
        sortBy: 'desc',
        descending: true,
        page: 1,
        rowsPerPage: 5
      },
      columns: [
        {
          name: 'desc',
          required: true,
          label: 'Nome',
          align: 'left',
          field: row => row.title,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'projeto', align: 'center', label: 'Projeto', field: 'project', sortable: true },
        // { name: 'usuario', align: 'center', label: 'Usuário', field: 'usuario', sortable: true },
        { name: 'descricao', align: 'center', label: 'Descrição (BDD)', field: 'description' },
        { name: 'status', align: 'center', label: 'Status', field: 'status', sortable: true },
        { name: 'action', align: 'center', label: 'Ações', field: 'actions'}
      ],
      data: [],
      show_dialog: false,
      editedItem: defaultItem
    }
  },
  mounted () {
    if (typeof this.$axios.defaults.headers.common['Authorization'] === 'undefined' || this.$axios.defaults.headers.common['Authorization'] === '') {
      this.$router.push({ path: '/' })
    }
    // get initial data from server (1st page)
    this.onRequest({
      pagination: this.pagination,
      filter: undefined
    })
  },

  methods: {
    backToList () {
      this.show_dialog = false,
      this.refreshTests()
    },

    exportTable () {
      let prepareSelected = ''
      if(this.selected.length !== 0){
        let itemSelected = this.selected
        let fields = Object.keys(itemSelected[0])
        let replacer = function(key, value) { return value === null ? '' : value }

        prepareSelected = itemSelected.map(function(row){
          return fields.map(function(fieldName){
            return JSON.stringify(row[fieldName], replacer)
          }).join(',')
        })

        prepareSelected.unshift(fields.join(',')) // add header column
        prepareSelected = prepareSelected.join('\r\n');

      } else {
        // naive encoding to csv format
        prepareSelected = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
          this.data.map(row => this.columns.map(col => wrapCsvValue(
            typeof col.field === 'function'
              ? col.field(row)
              : row[col.field === void 0 ? col.name : col.field],
            col.format
          )).join(','))
        ).join('\r\n')
      }

      const status = exportFile(
        'tests-export.csv',
        prepareSelected,
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

    fetchFromServer (startRow, count, filter, sortBy, descending) {
      this.$axios.get('/tests/', { showLoading: false }).then((response) => {
        this.data = response.data
      }).catch((e) => {
        this.noti = this.$q.notify({
          type: 'negative',
          multiline: true,
          message: `Erro ao carregar dados: `+e,
          timeout: 3000
        })
      })
      const data = filter
        ? this.data.filter(row => row.title.includes(filter))
        : this.data.slice()

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

    getRowsNumberCount (filter) {
      if (!filter) {
        return this.data.length
      }
      let count = 0
      this.data.forEach((treat) => {
        if (treat.name.includes(filter)) {
          ++count
        }
      })
      return count
    },
    getDelete (item) {
      this.$swal({
        title: 'Atenção!!',
        text: "Tem certeza que deseja deletar o Teste ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Deletar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteTest(item)
        }
      })
    },

    deleteTest (item) {
      let testId = item._id
      this.$axios.delete('/tests/'+testId).then((response) =>{
        if(response.status == 200){
          this.$swal(
            'Deletado!',
            'O teste foi deletado com sucesso!',
            'success'
          )
          this.refreshTests()
        }
      }).catch((e) =>{
        this.$swal(
          'Erro!',
          'Entre em contato com o suporte!',
          'error'
        )
        // this.errorMsgTest()
      })
    },

    editItem (item) {
      this.editedIndex = this.data.findIndex((v, i) =>v.__index === item.__index)
      this.editedItem = Object.assign({}, item);
      this.show_dialog = true;
    },
    playTest (item) {
      let testId = item._id
      this.$swal({
        title: 'Rodar o teste ?',
        text: "O teste será enviado para a fila!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Enviar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.testSubmit(testId)
        }
      }).catch((e) => {
        this.testMsgError()
      })
    },

    testSubmit (testId) {
      let msg = ''
      this.$axios.post(`/tests/submit/${testId}`).then((response) => {
        msg = response.data.message
        if(response.status == 200){
          this.$swal({
            icon: 'success',
            title: 'Tudo certo!',
            text : msg,
            showConfirmButton: false,
            timer: 2000
          })
          this.refreshTests()
        }else{
          this.testMsgError()
        }
      }).catch((e) => {
        this.testMsgError()
      })
    },
    stopTest (item) {
      console.log('stop')
    },
    refreshTests () {
      this.onRequest({ filter: this.filter, pagination : this.pagination })
    },

    testMsgError () {
      return this.$swal({
        icon: 'error',
        title: 'Ops.. algo deu errado!',
        text: 'tente novamente, se persistir entre em contato com o suporte!',
        showConfirmButton: true,
      })
    }
  },
}
</script>
