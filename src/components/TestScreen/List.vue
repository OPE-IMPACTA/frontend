<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-12 col-lg-12 col-sm-5">
      <q-card name="listaTestes">
        <q-card-section>
          <div class="text-h6 text-center text-primary">
            Gerenciamento de Testes
          </div>
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
                <q-btn rounded color="green" @click="showCreate()" icon="add" :disable="loading" label="Novo Teste" />
                <q-btn dense flat rounded class="q-ml-sm" icon="refresh" color="blue" :disable="loading" @click="refreshTests()" />
                <q-space />
                <q-input outlined borderless dense debounce="300" v-model="filter" placeholder="Pesquisar">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>

              <template #body-cell-status="props">
                <q-td :props="props">
                  <q-chip :color="props.row.status === STATUS.SUCCESS.label ? 'green': props.row.status === STATUS.ERROR.label ? 'red': props.row.status === STATUS.RUNNING.label ? 'blue' : props.row.status === STATUS.PENDING.label ? 'orange' : 'grey'" text-color="white" dense class="text-weight-bolder" square>{{props.row[props.col.name]}}</q-chip>
                </q-td>
              </template>

              <template #body-cell-descriptionText="props">
                <q-td class="text-center" auto-width>
                    <span v-if="!props.expand">{{ props.row.descriptionText }}</span>
                    <span v-if="props.expand">{{ props.row.description }}</span>
                    <q-btn size="sm" color="yellow-8" flat @click="props.expand = !props.expand" :icon="props.expand ? 'fas fa-eye-slash' : 'fas fa-eye'" />
                </q-td>
              </template>

              <template #body-cell-action="props">
                <q-td class="text-center">
                  <div class="q-gutter-sm">
                    <q-btn
                      v-if="props.row.status !== STATUS.RUNNING.value && props.row.status !== STATUS.PENDING.value"
                      dense glossy push color="green" class="btn-size-md" field="actions" title="Play" icon="play_circle" @click="playTest(props.row)">
                    </q-btn>
                    <q-btn dense glossy push color="blue" class="btn-size-md" field="actions" title="Editar" icon="edit" @click="editItem(props.row)"></q-btn>
                    <q-btn dense glossy push color="grey" class="btn-size-md" field="actions" title="Deletar" icon="delete" @click="getDelete(props.row)"></q-btn>
                  </div>
                  <!--                  <q-btn dense flat round color="red" field="actions" title="Stop" icon="stop" @click="stopTest(props.row)"></q-btn>-->
                </q-td>
              </template>
            </q-table>
        </template>
        </q-card-section>
      </q-card>
      </div>
  </q-page>
</template>

<script>
import { exportFile, Notify } from 'quasar'
import { defineComponent } from '@vue/composition-api';

const defaultItem = {
  title: '',
  project: '',
  description: '',
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

export default defineComponent({
  name: 'List',
  data () {
    return {
      STATUS: require('../../constants/Application').STATUS,
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
        {
          name: 'project',
          align: 'center',
          label: 'Projeto',
          field: 'project',
          sortable: true
        },
        {
          name: 'name',
          align: 'center',
          label: 'Usuário',
          field: 'name',
          sortable: true
        },
        {
          name: 'description',
          align: 'center',
          label: 'Descrição (BDD)',
          field: 'description'
        },
        {
          name: 'status',
          align: 'center',
          label: 'Status',
          field: 'status'
        },
        {
          name: 'action',
          align: 'center',
          label: 'Ações',
          field: 'actions'
        }
      ],
      hide_create: Boolean,
      hide_update: Boolean,
      data: [],
      editedItem: defaultItem,
      itemUpdate: {}
    }
  },
  mounted () {
    if (typeof this.$axios.defaults.headers.common.Authorization === 'undefined' || this.$axios.defaults.headers.common.Authorization === '') {
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
      let prepareSelected = ''
      if (this.selected.length !== 0) {
        const itemSelected = this.selected
        const fields = Object.keys(itemSelected[0])
        const replacer = function (key, value) { return value === null ? '' : value }

        prepareSelected = itemSelected.map(function (row) {
          return fields.map(function (fieldName) {
            return JSON.stringify(row[fieldName], replacer)
          }).join(',')
        })

        prepareSelected.unshift(fields.join(',')) // add header column
        prepareSelected = prepareSelected.join('\r\n')
      } else {
        // naive encoding to csv format
        prepareSelected = [this.columns.map(col => wrapCsvValue(col.label))].concat(
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
    async onRequest (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const filter = props.filter
      this.loading = true

      // update rowsCount with appropriate value
      this.pagination.rowsNumber = this.getRowsNumberCount(filter)

      // get all rows if "All" (0) is selected
      const fetchCount = rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage

      // calculate starting row of data
      const startRow = (page - 1) * rowsPerPage

      // fetch data from "server"
      const returnedData = await this.fetchFromServer(startRow, fetchCount, filter, sortBy, descending)

      // clear out existing data and add new
      this.data.splice(0, this.data.length, ...returnedData)

      // don't forget to update local pagination object
      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending

      // ...and turn of loading indicator
      this.loading = false
    },

    async fetchFromServer (startRow, count, filter, sortBy, descending) {

      await this.$axios.get('/tests/', { showLoading: false }).then((response) => {
        this.data = response.data && Object.keys(response.data).length === 0 ? [] : response.data
      }).catch((e) => {
        this.noti = this.$q.notify({
          type: 'negative',
          multiline: true,
          message: 'Erro ao carregar dados',
          timeout: 3000
        })
      })

      const data = filter
        ? this.data.filter(row => row.title.includes(filter))
        : this.data.slice()

      // handle sortBy
      const sortDesc = (descending
          ? (a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0)
          : (a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
      );

      const sortAsc = (descending
          ? (a, b) => (parseFloat(b[sortBy]) - parseFloat(a[sortBy]))
          : (a, b) => (parseFloat(a[sortBy]) - parseFloat(b[sortBy]))
      )

      if (sortBy) {
        let sortFn = sortAsc;

        if (sortBy === 'desc') {
          sortFn = sortDesc
        }
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
        text: 'Tem certeza que deseja deletar o Teste ?',
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
      const testId = item._id
      this.$axios.delete('/tests/' + testId).then((response) => {
        if (response.status == 200) {
          this.$swal(
            'Deletado!',
            'O teste foi deletado com sucesso!',
            'success'
          )
          this.refreshTests()
        }
      }).catch((e) => {
        this.$swal(
          'Erro!',
          'Entre em contato com o suporte!',
          'error'
        )
        // this.errorMsgTest()
      })
    },

    showCreate () {
      this.$channelEvents.$emit(this.$constantsEvents.SHOW_CREATE_TEST, true);
    },

    editItem (item) {
      this.editedIndex = this.data.findIndex((v, i) => v.__index === item.__index)
      this.editedItem = Object.assign({}, item)
      this.hide_update = true
      this.itemUpdate = {
        editItem: this.editedItem,
        hide: true
      }
      this.$channelEvents.$emit(this.$constantsEvents.SHOW_UPDATE_TEST, this.itemUpdate);
    },
    playTest (item) {
      const testId = item._id
      this.$swal({
        title: 'Rodar o teste ?',
        text: 'O teste será enviado para a fila!',
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
        if (response.status == 200) {
          this.$swal({
            icon: 'success',
            title: 'Tudo certo!',
            text: msg,
            showConfirmButton: false,
            timer: 2000
          })
          this.refreshTests()
        } else {
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
      this.onRequest({ filter: '', pagination: this.pagination })
    },

    testMsgError () {
      return this.$swal({
        icon: 'error',
        title: 'Ops.. algo deu errado!',
        text: 'tente novamente, se persistir entre em contato com o suporte!',
        showConfirmButton: true
      })
    }
  }
})
</script>

<style>
  .btn-size-md {
    font-size: 12px;
  }
  span.block{
    margin-right: 12px;
  }
</style>
