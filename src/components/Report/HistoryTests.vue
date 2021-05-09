<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-11 col-lg-11 col-sm-5">
      <q-card name="listaTestes">
        <q-card-section>
          <div class="text-h6 text-center text-primary">
            Histórico de execuções
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
                @update:pagination="getUpdatedPagination"
                :selected.sync="selected"
                selection="multiple"
                :pagination="pagination"
            >

              <template v-slot:top>
                <div class="wrap-datepicker">
                  <q-input disable bottom-slots v-model="currentDate" label="Filtro Data" >
                    <template v-slot:after>
                      <q-btn flat dense color="yellow-8" title="data" icon="event" class="cursor-pointer" >
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                          <q-date range landscape v-model="datePicker">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-btn>
                    </template>
                  </q-input>
                </div>

                <q-input outlined v-model="filter" placeholder="Pesquisar">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
                <q-space />
                <div class="q-mt-md">
                  <q-checkbox keep-color v-model="checkReady" label="Pronto" color="gray" />
                  <q-checkbox keep-color v-model="checkPending" label="Pendente" color="orange" />
                  <q-checkbox keep-color v-model="checkRunning" label="Executando" color="blue" />
                  <q-checkbox keep-color v-model="checkSuccess" label="Sucesso" color="green" />
                  <q-checkbox keep-color v-model="checkError" label="Erro" color="red" />
                </div>
                <q-space />

                <div class="q-mt-md">
                  <q-btn-dropdown flat color="blue" label="Exportar" no-caps icon="archive">
                    <q-list>
                      <q-item clickable v-close-popup @click="exportTableCsv">
                        <q-item-section>
                          <q-item-label><q-icon name="fas fa-file-csv"/> .CSV</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item clickable v-close-popup>
                        <q-item-section>
                          <download-excel :fetch="dataExportXls">
                            <q-icon name="fas fa-file-excel"/>
                            .XLS
                          </download-excel>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </div>

                <q-space />

                <div class="q-mt-md">
                  <q-btn rounded color="blue" @click="submitFilter()" icon="search" :disable="loading" label="Pesquisar" />
                  <q-btn dense rounded class="q-ml-sm" color="blue" icon="refresh" :disable="loading" @click="refreshTests()" />
                </div>
              </template>

              <template #body-cell-status="props">
                <q-td :props="props">
                  <q-chip :color="props.row.status === STATUS.SUCCESS.label ? 'green': props.row.status === STATUS.ERROR.label ? 'red': props.row.status === STATUS.RUNNING.label ? 'blue' : props.row.status === STATUS.PENDING.label ? 'orange' : 'grey'" text-color="white" dense class="text-weight-bolder" square>{{props.row[props.col.name]}}</q-chip>
                </q-td>
              </template>

              <template #body-cell-evidence="props">
                <q-td class="text-center">
                  <div class="q-gutter-sm">
                    <q-item-label v-if="props.row.evidences.video == undefined">---</q-item-label>
                    <q-btn
                        v-if="props.row.evidences.video != undefined"
                        dense glossy push color="green" class="btn-size-md" field="evidence" title="Play" icon="play_circle" @click="playVideoEvidence(props.row.test.title, props.row.evidences.video)">
                    </q-btn>
                  </div>
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
import { defineComponent } from '@vue/composition-api';
import { date, exportFile } from "quasar";

export default defineComponent({
  name: 'List',
  data () {
    return {
      selected: [],
      STATUS: require('../../constants/Application').STATUS,
      datePicker: date.formatDate(Date.now(), 'YYYY/MM/DD'),
      currentDate: date.formatDate(Date.now(), 'YYYY/MM/DD'),
      checkPending: false,
      checkRunning: false,
      checkSuccess: false,
      checkError: false,
      checkReady: false,
      status: [],
      filter: '',
      loading: false,
      pagination: {
        sortBy: 'desc',
        descending: true,
        page: 1,
        rowsPerPage: 50
      },
      currentPage: 1,
      columns: [
        {
          name: 'id',
          label: 'ID',
          classes: 'hidden',
          headerClasses: 'hidden',
          field: '_id',
          format: val => `${val}`,
        },
        {
          name: 'operations',
          label: 'Operações',
          align: 'left',
          classes: 'hidden',
          headerClasses: 'hidden',
          format: val => JSON.stringify(val).replace(/['"]+/g, '').replace(','," & "),
          field: row => row.test.operations
        },
        {
          name: 'desc',
          required: true,
          label: 'Nome',
          align: 'left',
          field: row => row.test.title,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'projeto', align: 'center', label: 'Projeto', field: row => row.test.project, sortable: true },
        { name: 'usuario', align: 'center', label: 'Usuário', field: 'name', sortable: true },
        { name: 'descricao', align: 'center', label: 'Descrição (BDD)', field: row => row.test.description },
        { name: 'status', align: 'center', label: 'Status', field: 'status', sortable: true },
        { name: 'created_at', align: 'center', label: 'Data de execução', field: row => date.formatDate(row.created_at, 'DD/MM/YYYY H:m'), sortable: true },
        { name: 'evidence', align: 'center', label: 'Evidências', field: 'evidence' }
      ],
      hide_create: Boolean,
      hide_update: Boolean,
      data: [],
      itemUpdate: {}
    }
  },
  mounted () {
    if (typeof this.$axios.defaults.headers.common.Authorization === 'undefined' || this.$axios.defaults.headers.common.Authorization === '') {
      this.$router.push({ path: '/' })
    }

    this.onRequest();
  },
  computed: {
    pagesNumber () {
      return Math.ceil(this.rows.length / this.pagination.rowsPerPage)
    }
  },
  methods: {
    wrapCsvValue (val, formatFn) {
      let formatted = formatFn !== void 0
          ? formatFn(val)
          : val

      formatted = formatted === void 0 || formatted === null
          ? ''
          : String(formatted)

      formatted = formatted.split('"').join('""')

      return `"${formatted}"`
    },

    async dataExportXls() {

      if(this.selected.length > 1){
        this.selected[0].operations = JSON.stringify(this.selected[0].operations);
        return this.selected
      }

      this.data.map(function (row) {
        row.operations = JSON.stringify(row.operations)
      })

      return this.data
    },

    async exportTableCsv() {
      let date = date.formatDate(Date.now(), 'DDMMYYYY');
      let filename = `Testes-${date}.csv`;
      let prepareSelected = ''

      // for item select --------------
      if (this.selected.length > 0) {

        const itemSelected = this.selected
        const fields = Object.keys(itemSelected[0])

        prepareSelected = itemSelected.map(function (row) {

          return fields.map(function (fieldName) {

            let response = JSON.stringify(row[fieldName]).replace(/['"]+/g, '');

            if (fieldName === 'operations')
            {
              if(row[fieldName].length > 1)
              {
                let operations = '';
                let value = '';

                row[fieldName].map(function (operation) {
                  value = JSON.stringify(operation);
                  response = `${response} - ${value}`;
                  operations = `${operations} - ${value}`;
                })
                response = operations
              }
            }

            filename = `Teste-${row.title}-${date}.csv`;
            return response
          })
        })

        prepareSelected.unshift(this.columns.map(col => wrapCsvValue(col.label))) // add header column
        prepareSelected = prepareSelected.join('\r\n')
      } else {

        // native encoding to csv format for ALL ITENS
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
          filename,
          prepareSelected,
          'text/csv'
      )

      if (status !== true) {
        this.$q.notify({
          message: 'Erro ao realizar o download, verifique o browser ...',
          color: 'negative',
          icon: 'warning'
        })
      }
    },

    async onRequest (props) {
      await this.fetchFromServer()
    },

    async submitFilter() {
      await this.onRequest()
    },

    clearFilter() {
      this.datePicker = date.formatDate(Date.now(), 'YYYY/MM/DD');
      this.filter = '';
      this.checkError = false;
      this.checkSuccess = false;
      this.checkRunning = false;
      this.checkPending = false;
      this.checkReady = false;
    },

    mountFilter() {

      let status = [];
      let filter = [];

      if (typeof this.datePicker == "object" && typeof this.datePicker.from !== undefined && this.datePicker.from !== null) {
        filter.push(`dateStart=${this.datePicker.from}`);
      }

      if (typeof this.datePicker == "object" && typeof this.datePicker.to !== undefined && this.datePicker.to !== null) {
        filter.push(`dateEnd=${this.datePicker.to}`);
      }

      if (typeof this.datePicker == "string") {
        filter.push(`dateStart=${this.datePicker}&dateEnd=${this.datePicker}`);
      }

      if (typeof this.filter !== undefined && this.filter !== null && this.filter.length) {
        filter.push(`search=${this.filter}`);
      }

      if (this.checkReady) {
        status.push('ready');
      }

      if (this.checkPending) {
        status.push('pending');
      }

      if (this.checkRunning) {
        status.push('running');
      }

      if (this.checkSuccess) {
        status.push('success');
      }

      if (this.checkError) {
        status.push('error');
      }

      if(status.length > 0) {
        filter.push(`status=${status}`);
      }

      // filter.push(`page=${this.pagination.page}`);

      return filter.length > 0? `?${filter.join('&')}` : '';
    },

    getUpdatedPagination(data) {
      // this.pagination.page = data.page;
      // this.currentPage = data.page;
      // this.onRequest();
    },

    async fetchFromServer () {

      await this.$axios.get(`/tests/histories${this.mountFilter()}`, { showLoading: false }).then((response) => {
        this.data = response.data && Object.keys(response.data).length === 0 ? [] : response.data
        this.pagination.rowsNumber = 50;
      }).catch((e) => {
        this.noti = this.$q.notify({
          type: 'negative',
          multiline: true,
          message: 'Erro ao carregar dados',
          timeout: 3000
        })
      })

      // const data = filter
      //     ? this.data.filter(row => row.title.includes(filter))
      //     : this.data.slice()
      //
      // // handle sortBy
      // const sortDesc = (descending
      //         ? (a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0)
      //         : (a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
      // );
      //
      // const sortAsc = (descending
      //         ? (a, b) => (parseFloat(b[sortBy]) - parseFloat(a[sortBy]))
      //         : (a, b) => (parseFloat(a[sortBy]) - parseFloat(b[sortBy]))
      // )
      //
      // if (sortBy) {
      //   let sortFn = sortAsc;
      //
      //   if (sortBy === 'desc') {
      //     sortFn = sortDesc
      //   }
      //   data.sort(sortFn)
      // }
      //
      // return data.slice(startRow, startRow + count)
    },

    refreshTests () {
      this.clearFilter()
      this.onRequest()
    },

    playVideoEvidence(title, video) {
      this.$swal({
        html: `<video width="650" controls>
                <source src="${process.env.BUCKET}/${video}" type="video/mp4">
               </video>`,
        showCancelButton: false,
        showConfirmButton: false
      });
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
.wrap-datepicker {
  padding-right: 12px;
  max-width: 300px;
}

.wrap-datepicker .q-field--with-bottom {
  padding-bottom: 0px;
}
</style>
