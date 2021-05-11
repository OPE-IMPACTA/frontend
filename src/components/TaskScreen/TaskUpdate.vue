<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-6">
      <q-card>
        <q-card-section>
          <div class="text-h5 text-primary" align="center">
            Atualizar Tarefa
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

export default defineComponent({
  props: {
    editItem: {}
  },
  name: "TaskUpdate",
  components: { TaskManagement },
  data() {
    return {
      user_id: this.editItem.user_id,
      project_id: this.editItem.project_id
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
  },

  methods: {
    onSubmit() {
      let data = this.buildDataUpdate();

      let msg = "";
      this.$swal({
        title: "Atualizar Tarefa ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        showLoaderOnConfirm: true
      }).then(result => {
        if (result.isConfirmed) {
          this.$axios
            .put(`tasks/${data.id}`, data)
            .then(response => {
              msg = response.data.Message;

              this.$swal({
                title: msg,
                icon: "success",
                showConfirmButton: true
              });
              this.$emit("showUpdate", { show: false, editItem: {} });
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

    buildDataUpdate() {
      let data = {};

      data = {
        id: this.editItem._id,
        project_id: this.editItem.project.value || this.editItem.project_id,
        user_id: this.editItem.user.value || this.editItem.user_id,
        description: this.editItem.description,
        startDate: this.editItem.startDate,
        endDate: this.editItem.endDate,
        hours: this.editItem.hours
      };

      return data;
    },

    cancelAdd() {
      this.$swal({
        title: "Cancelar edição ?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Voltar",
        confirmButtonText: "Cancelar"
      }).then(result => {
        if (result.isConfirmed) {
          this.$emit("showUpdate", { show: false, editItem: {} });
        }
      });
    }
  }
});
</script>
