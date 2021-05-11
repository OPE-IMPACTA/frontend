<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-6">
      <q-card>
        <q-card-section>
          <div class="text-h5 text-primary" align="center">
            Cadastrar Tarefa
          </div>
        </q-card-section>
        <q-list>
          <q-form @submit="onSubmit" class="form" ref="taskCreateForm">
            <q-card-section>
              <TaskManagement :editItem="editItem"></TaskManagement>
            </q-card-section>
            <div class="" align="right">
              <q-btn
                @click="cancelAdd"
                class="q-ma-md"
                label="Cancelar"
              ></q-btn>
              <q-btn
                label="Salvar"
                type="submit"
                class="q-ma-md"
                color="primary"
              />
            </div>
          </q-form>
        </q-list>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import TaskManagement from "./taskManagement.vue";
import { defineComponent } from "@vue/composition-api";

const defaultItem = {
  project_id: "",
  user_id: "",
  description: "",
  startDate: "",
  endDate: "",
  hours: ""
};

export default defineComponent({
  name: "TaskRegister",
  components: { TaskManagement },
  data() {
    return {
      editItem: defaultItem,
      prompt: false
    };
  },

  methods: {
    onSubmit() {
      this.$swal({
        title: "Cadastrar Tarefa ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Cadastrar",
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true
      }).then(result => {
        if (result.isConfirmed) {
          const data = {
            project_id: this.editItem.project.value,
            user_id: this.editItem.user.value,
            description: this.editItem.description,
            startDate: this.editItem.startDate,
            endDate: this.editItem.endDate,
            hours: this.editItem.hours
          };

          this.$axios
            .post("tasks", data)
            .then(response => {
              this.$swal({
                title: response.data.Message,
                icon: "success",
                showConfirmButton: true
              });
              this.resetForm();
              this.$emit("showCreate", false);
            })
            .catch(error => {
              this.$swal({
                title: "Erro ao cadastrar !",
                text: "Entre em contato com o suporte",
                icon: "error",
                showConfirmButton: true
              });
            });
        }
      });
    },

    cancelAdd() {
      this.$swal({
        title: "Cancelar cadastro ?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Voltar",
        confirmButtonText: "Cancelar"
      }).then(result => {
        if (result.isConfirmed) {
          this.resetForm();
          this.$emit("showCreate", false);
        }
      });
    },

    resetForm() {
      (defaultItem.project_id = ""),
        (defaultItem.user_id = ""),
        (defaultItem.description = ""),
        (defaultItem.startDate = ""),
        (defaultItem.endDate = ""),
        (defaultItem.hours = "");
    },

    hide() {
      this.prompt = false;
    }
  }
});
</script>
