<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-6">
      <q-card>
        <q-card-section>
          <div class="text-h5 text-primary" align="center">
            Cadastrar Projeto
          </div>
        </q-card-section>
        <q-list>
          <q-form @submit="onSubmit" class="form" ref="projectCreateForm">
            <q-card-section>
              <ProjectManagement :editItem="editItem"></ProjectManagement>
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
import ProjectManagement from "./projectManagement.vue";
import { defineComponent } from "@vue/composition-api";

const defaultItem = {
  user: "",
  client: "",
  description: ""
};

export default defineComponent({
  name: "ProjectRegister",
  components: { ProjectManagement },
  data() {
    return {
      editItem: defaultItem,
      prompt: false
    };
  },

  methods: {
    onSubmit() {
      this.$swal({
        title: "Cadastrar Projeto ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Cadastrar",
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true
      }).then(result => {
        if (result.isConfirmed) {
          const data = {
            user_id: this.editItem.user.value,
            client_id: this.editItem.client.value,
            description: this.editItem.description,
            status: "Novo"
          };

          this.$axios
            .post("projects", data)
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
      defaultItem.user = "";
      defaultItem.client = "";
      defaultItem.description = "";
    },

    hide() {
      this.prompt = false;
    }
  }
});
</script>
