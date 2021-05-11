<template>
  <q-page class="q-pa-sm row items-center justify-evenly">
    <div class="col-md-11 col-lg-11 col-sm-5">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center text-primary">
            Gerenciamento de Tarefas
          </div>
        </q-card-section>
        <q-table
          title=""
          :data="data"
          :hide-header="mode === 'grid'"
          :columns="columns"
          row-key="_id"
          :loading="loading"
          :grid="mode == 'grid'"
          :filter="filter"
          :pagination.sync="pagination"
        >
          <template v-slot:top-left>
            <q-btn
              rounded
              @click="showCreatProject"
              icon="add"
              label="Nova tarefa"
              class="bg-primary text-accent"
            />
            <q-btn
              dense
              flat
              rounded
              class="q-ml-sm bg-secondary text-primary"
              icon="refresh"
              :disable="loading"
              @click="refreshProjects()"
            />
          </template>

          <template v-slot:top-right>
            <q-input
              outlined
              dense
              debounce="300"
              v-model="filter"
              placeholder="Pesquisar"
              class="q-ml-sm"
              style="width: 350px"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn
              rounded
              flat
              color="blue"
              icon-right="archive"
              label="Exportar"
              no-caps
              class="q-ml-sm"
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
                  class="btn-size-md text-primary bg-secondary"
                  field="actions"
                  title="Editar"
                  icon="edit"
                  @click="editItem(props.row)"
                ></q-btn>
                <q-btn
                  dense
                  glossy
                  push
                  class="btn-size-md text-secondary bg-primary"
                  field="actions"
                  title="Deletar"
                  icon="delete"
                  @click="getDelete(props.row)"
                ></q-btn>
              </div>
            </q-td>
          </template>

          <template v-slot:item="props">
            <div
              class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-4 grid-style-transition"
              :style="props.selected ? 'transform: scale(0.95);' : ''"
            >
              <q-card :class="props.selected ? 'bg-grey-2' : ''">
                <q-list dense>
                  <q-item v-for="col in props.cols" :key="col.name">
                    <q-item-section>
                      <q-item-label>{{ col.label }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-chip
                        v-if="col.name === 'status'"
                        :color="
                          props.row.status == 'Active'
                            ? 'green'
                            : props.row.status == 'Disable'
                            ? 'red'
                            : 'grey'
                        "
                        text-color="white"
                        dense
                        class="text-weight-bolder"
                        square
                        >{{ col.value }}</q-chip
                      >
                      <q-td
                        class="text-center"
                        v-else-if="col.name === 'action'"
                      >
                        <q-btn
                          dense
                          glossy
                          push
                          color="blue"
                          field="actions"
                          title="Editar"
                          icon="edit"
                          @click="editItem(props.row)"
                        ></q-btn>
                        <q-btn
                          dense
                          flat
                          round
                          color="grey"
                          field="actions"
                          title="Deletar"
                          icon="delete"
                          @click="getDelete(props.row)"
                        ></q-btn>
                      </q-td>
                      <q-item-label
                        v-else
                        caption
                        :class="col.classes ? col.classes : ''"
                        >{{ col.value }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </div>
          </template>
        </q-table>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { exportFile, date } from "quasar";
const defaultItem = {
  project_id: "",
  user_id: "",
  description: "",
  startDate: "",
  endDate: "",
  hours: ""
};

export default {
  props: {
    resetProjects: Boolean
  },
  watch: {
    resetProjects: function(val) {
      if (this.resetProjects) {
        this.refreshProjects();
        this.$emit("updateReset", false);
      }
    }
  },
  data() {
    return {
      filter: "",
      loading: false,
      group: "",
      show_form: false,
      editedItem: defaultItem,
      mode: "list",
      columns: [
        {
          name: "project",
          required: true,
          label: "Projeto",
          align: "left",
          field: "project",
          sortable: true
        },
        {
          name: "user",
          align: "left",
          label: "Usuário",
          field: "user",
          sortable: true
        },
        {
          name: "client",
          align: "left",
          label: "Cliente",
          field: "client",
          sortable: true
        },
        {
          name: "description",
          align: "left",
          label: "Descrição",
          field: "description",
          sortable: true
        },
        {
          name: "startDate",
          align: "left",
          label: "Data ínicio",
          sortable: true,
          field: row => date.formatDate(row.startDate, 'DD/MM/YYYY'),
        },
        {
          name: "endDate",
          align: "left",
          label: "Data final",
          field: "endDate",
          sortable: true,
          field: row => date.formatDate(row.startDate, 'DD/MM/YYYY'),
        },
        {
          name: "hours",
          align: "left",
          label: "Hora",
          field: "hours",
          sortable: true,
        },
        { name: "action", align: "center", label: "Ações", field: "actions" }
      ],
      data: [],
      pagination: {
        rowsPerPage: 7
      }
    };
  },

  mounted() {
    if (
      typeof this.$axios.defaults.headers.common.Authorization ===
        "undefined" ||
      this.$axios.defaults.headers.common.Authorization === ""
    ) {
      this.$router.push({ path: "/" });
    }
    // get initial data from server (1st page)
    this.onRequest({
      pagination: this.pagination,
      filter: undefined
    });
  },
  methods: {
    exportTable() {
      const header = ["Projetos", "Usuários", "Cliente", "Descrição", "Data ínicio", "Data final", "Hora"];
      const content = this.data.map(row => {
        return `\r\n"${row.project}", "${row.user}", "${row.client}", "${row.description}", "${row.startDate}", "${row.startEnd}", ${row.hours}`;
      });
      const result = `"${header.join('","')}"\r\n${content}`;

      const status = exportFile("tasks-management.csv", result, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Erro ao fazer o download...",
          color: "negative",
          icon: "warning"
        });
      }
    },

    onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;
      this.loading = true;

      setTimeout(() => {
        this.pagination.rowsNumber = this.getRowsNumberCount(filter);

        const fetchCount =
          rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;

        const startRow = (page - 1) * rowsPerPage;

        const returnedData = this.fetchFromServer(
          startRow,
          fetchCount,
          filter,
          sortBy,
          descending
        );

        this.data.splice(0, this.data.length, ...returnedData);

        this.pagination.page = page;
        this.pagination.rowsPerPage = rowsPerPage;
        this.pagination.sortBy = sortBy;
        this.pagination.descending = descending;

        this.loading = false;
      }, 1500);
    },

    fetchFromServer(startRow, count, filter, sortBy, descending) {
      const token = this.$axios.defaults.headers.common["Authorization"];
      const config = {
        headers: { Authorization: token },
        showLoading: false
      };

      this.$axios
        .get("tasks", config)
        .then(response => {
          this.data = response.data.data;
        })
        .catch(e => {
          if (e.response.status !== 200 && e.response.status !== 403) {
            this.noti = this.$q.notify({
              type: "negative",
              multiline: true,
              message: "Erro ao carregar dados",
              timeout: 3000
            });
          }
        });

      const data = filter
        ? this.data.filter(row => row.description.includes(filter))
        : this.data.slice();

      // handle sortBy
      if (sortBy) {
        const sortFn =
          sortBy === "desc"
            ? descending
              ? (a, b) => (a.description > b.description ? -1 : a.description < b.description ? 1 : 0)
              : (a, b) => (a.description > b.description ? 1 : a.description < b.description ? -1 : 0)
            : descending
            ? (a, b) => parseFloat(b[sortBy]) - parseFloat(a[sortBy])
            : (a, b) => parseFloat(a[sortBy]) - parseFloat(b[sortBy]);
        data.sort(sortFn);
      }

      return data.slice(startRow, startRow + count);
    },

    getRowsNumberCount(filter) {
      let count = 0;
      this.data.forEach(treat => {
        if (treat.description.includes(filter)) {
          ++count;
        }
      });
      return count;
    },

    showCreatProject() {
      this.editedItem = defaultItem;
      this.$emit("showCreate", true);
    },

    editItem(item) {
      this.editedIndex = this.data.findIndex(
        (v, i) => v.__index === item.__index
      );

      this.editedItem = Object.assign({}, item);
      this.itemUpdate = {
        editItem: this.editedItem,
        show: true
      };
      this.$emit("showUpdate", this.itemUpdate);
    },

    getDelete(item) {
      this.$swal({
        title: "Atenção!!",
        text: "Tem certeza que deseja deletar o projetos ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d6303e",
        cancelButtonColor: "#c4c4c4",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Deletar"
      }).then(result => {
        if (result.isConfirmed) {
          this.deleteUser(item);
        }
      });
    },

    deleteUser(item) {
      const userId = item._id;
      this.$axios
        .delete("/tasks/" + userId)
        .then(response => {
          if (response.status == 200) {
            this.$swal(
              "Deletado!",
              "A tarefa foi deletado com sucesso!",
              "success"
            );
            this.refreshProjects();
          }
        })
        .catch(e => {
          this.$swal("Erro!", "Entre em contato com o suporte!", "error");
        });
    },

    refreshProjects() {
      this.onRequest({ filter: "", pagination: this.pagination });
    }
  }
};
</script>

<style>
.btn-size-md {
  font-size: 12px;
}
span.block {
  margin-right: 12px;
}
</style>
