<template>
  <div>
    <q-item>
      <q-item-section>
        <q-select
          outlined
          v-model="editItem.project"
          :options="projects"
          label="Projetos"
          lazy-rules
          :rules="[v => !!v || 'Projeto obrigatório']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          outlined
          v-model="editItem.user"
          :options="users"
          label="Usuários"
          lazy-rules
          :rules="[v => !!v || 'Usuário obrigatório']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <div style="max-width: 250px">
          <q-input
            placeholder="Data ínicio"
            filled
            v-model="editItem.startDate"
            mask="date"
            :rules="[v => !!v || 'Descrição obrigatório']"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="editItem.startDate">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </q-item-section>
      <q-item-section>
        <div style="max-width: 250px">
          <q-input
            placeholder="Data Final"
            filled
            v-model="editItem.endDate"
            mask="date"
            :rules="[v => !!v || 'Descrição obrigatório']"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="editItem.endDate">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          outlined
          v-model="editItem.hours"
          type="number"
          label="Horas"
          lazy-rules
          :rules="[v => !!v || 'Horas obrigatório']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          outlined
          v-model="editItem.description"
          type="textarea"
          label="Descrição"
          lazy-rules
          :rules="[v => !!v || 'Descrição obrigatório']"
        />
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import { date } from "quasar";

const defaultItem = {
  project: "",
  user: "",
  description: "",
  startDate: "",
  endDate: "",
  hours: ""
};

export default defineComponent({
  props: {
    editItem: {}
  },
  name: "projectManagement",
  data() {
    return {
      users: [],
      user: "",
      projects: [],
      project: "",
      startDate: date.formatDate(Date.now(), "YYYY/MM/DD"),
      endDate: date.formatDate(Date.now(), "YYYY/MM/DD")
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

    this.$axios
      .get("/users")
      .then(({ data }) => {
        data.data.forEach(item => {
          this.users.push({ value: item._id, label: item.name });
        });
      })
      .catch(() => {
        this.$swal({
          title: "Erro ao buscar grupos!",
          text: "Entre em contato com o suporte",
          icon: "error",
          showConfirmButton: true
        });
      });

    this.$axios
      .get("/projects")
      .then(({ data }) => {
        data.data.forEach(item => {
          this.projects.push({ value: item._id, label: item.description });
        });
      })
      .catch(() => {
        this.$swal({
          title: "Erro ao buscar projetos!",
          text: "Entre em contato com o suporte",
          icon: "error",
          showConfirmButton: true
        });
      });
  },
  methods: {
    close() {
      setTimeout(() => {
        this.editItem = Object.assign({}, this.defaultItem);
        this.resetForm();
        this.editedIndex = -1;
        this.$emit("hide_create_task", { show: false, reset: false });
      }, 300);
    },

    resetForm() {
      (defaultItem.project = ""),
        (defaultItem.user = ""),
        (defaultItem.description = ""),
        (defaultItem.startDate = ""),
        (defaultItem.endDate = ""),
        (defaultItem.hours = "");
    }
  }
});
</script>
