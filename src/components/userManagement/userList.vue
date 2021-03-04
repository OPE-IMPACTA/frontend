<template>
  <q-page class="q-pa-sm">
    <q-card>
      <q-table
        title="Gerenciamento de Usuários"
        :data="data"
        :hide-header="mode === 'grid'"
        :columns="columns"
        row-key="name"
        :grid="mode=='grid'"
        :filter="filter"
        :pagination.sync="pagination"
      >
        <template v-slot:top-right="props">
          <q-btn @click="novoUsuario=true" outline color="primary" label="Adicionar novo" class="q-mr-xs"/>

          <q-input outlined dense debounce="300" v-model="filter" placeholder="Buscar">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>

          <q-btn
            flat
            round
            dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            v-if="mode === 'list'"
          >
            <q-tooltip
              :disable="$q.platform.is.mobile"
              v-close-popup
            >{{props.inFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen'}}
            </q-tooltip>
          </q-btn>

          <q-btn
            flat
            round
            dense
            :icon="mode === 'grid' ? 'list' : 'grid_on'"
            @click="mode = mode === 'grid' ? 'list' : 'grid'; separator = mode === 'grid' ? 'none' : 'horizontal'"
            v-if="!props.inFullscreen"
          >
            <q-tooltip
              :disable="$q.platform.is.mobile"
              v-close-popup
            >{{mode==='grid' ? 'List' : 'Grid'}}
            </q-tooltip>
          </q-btn>

          <q-btn
            color="primary"
            icon-right="archive"
            label="Exportar pra csv"
            no-caps
            @click="exportTable"
          />
        </template>
      </q-table>
    </q-card>
    <q-dialog v-model="novoUsuario">
      <q-card style="width: 600px; max-width: 60vw;">
        <q-card-section>
          <div class="text-h5">
            Adicionar novo usuário
            <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn>
          </div>
        </q-card-section>
        <q-separator inset></q-separator>
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md" @submit="onSubmit()">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">Nome</q-item-label>
                  <q-input dense outlined v-model="usuarios.name" label="Nome completo"/>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">Cargo</q-item-label>
                  <q-input dense outlined v-model="usuarios.position" label="Cargo"/>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">Email</q-item-label>
                  <q-input dense outlined v-model="usuarios.email" label="Email"/>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">Senha</q-item-label>
                  <q-input dense outlined v-model="usuarios.password" label="Senha" type="password"/>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">Repita a Senha</q-item-label>
                  <q-input dense outlined v-model="usuarios.repeatPassword" label="Repita a Senha" type="password"/>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-checkbox
                    v-model="usuarios.adminFlag"
                    label="Privilégios de administrador?"
                    true-value= "1"
                    false-value="0"
                    size="lg"
                  />
                </q-item-section>
              </q-item>
            </q-list>
            <q-card-actions align="right" class="text-teal">
              <q-btn label="Cadastrar" type="submit" color="primary" v-close-popup/>
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {exportFile, Loading, QSpinnerPie} from "quasar";

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

export default {
  data() {
    return {
      filter: "",
      usuarios: {},
      novoUsuario: false,
      mode: "list",
      columns: [
        {
          name: "name",
          required: true,
          label: "Nome",
          align: "left",
          field: "name",
          sortable: true
        },                    {
          name: "position",
          required: true,
          label: "Cargo",
          align: "left",
          field: "position",
          sortable: true
        },
        {
          name: "email",
          align: "left",
          label: "Email",
          field: "email",
          sortable: true
        },
        {
          name: "groupId",
          align: "left",
          label: "Administrador?",
          field: "groupId",
          sortable: true
        },
        {
          name: "actions",
          align: "left",
          label: "Ação",
          field: "actions",
          sortable: true
        }
      ],
      data: [
        {
          name: "João",
          position: "dev",
          email: "joao.siles@i9xp.com.br",
          password: '',
          repeatPassword: '',
          groupId: true,
          actions: ""
        },                    {
          name: "Lais",
          position: "qa",
          email: "lais@email.com",
          password: '',
          repeatPassword: '',
          groupId: false,
          actions: ""
        },                    {
          name: "Thai",
          position: "dev",
          email: "thai@monstradofront.com",
          password: '',
          repeatPassword: '',
          groupId: true,
          actions: ""
        },                    {
          name: "Henrique",
          position: "dev",
          email: "henrique.silva@i9xp.com.br",
          password: '',
          repeatPassword: '',
          groupId: true,
          actions: ""
        },

      ],
      pagination: {
        rowsPerPage: 10
      }
    };
  },
  methods: {
    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map(col => wrapCsvValue(col.label))]
        .concat(
          this.data.map(row =>
            this.columns
              .map(col =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      const status = exportFile("usuarios-management.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning"
        });
      }
    },

    onSubmit() {
      Loading.show({
        spinner: QSpinnerPie,
        spinnerColor: 'yellow',
        message: 'Aguarde, gravando dados...',
        delay: 400
      })

      this.timer = setTimeout(() => {
        this.fieldPasswordValidate()
        return false
        this.timer = void 0
      }, 3000)
    },

    testRecord() {
      let currentObj = this
      this.$axios.post('/users', {
        name: this.usuarios.name,
        position: this.usuarios.position,
        email: this.usuarios.email,
        password: this.usuarios.password,
        group_id: '60306aaa91b311004d32c4e9'
      })
        .then(function (response) {
          currentObj.output = response.data;
          Loading.hide();
          currentObj.$swal({
            icon: 'success',
            text: 'Dados salvos com sucesso!'
          });
        })
        .catch(function (error) {
          currentObj.output = error;
          Loading.hide();
          currentObj.$swal({
            icon: 'error',
            text: 'Ocorreu um erro! Verifique seus dados.'
          });
        });
    },

    fieldPasswordValidate() {
      var password = this.password
      var repeatPassword = this.repeatPassword

      if (password == repeatPassword) {
        this.testRecord()
        return true;
      } else {
        alert("Senhas não batem. Verifique o valor digitado.");
        Loading.hide()
        return false;
      }
    }
  }
};
</script>
