<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-6">
      <q-card>
        <q-card-section>
          <div class="text-h5 text-primary" align="center">
            Atualizar cliente
          </div>
        </q-card-section>
        <q-list>
          <q-form @submit="onSubmit" class="form" ref="userCreateForm">
            <q-card-section>
              <ClientManagement
                :password-rules="passwordRules"
                :confirm-password-rules="confirmPasswordRules"
                :editItem="editItem"
              ></ClientManagement>
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
import ClientManagement from "./clientManagement.vue";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    editItem: {}
  },
  name: "ClientUpdate",
  components: { ClientManagement },
  data() {
    return {
      prompt: false,
      passwordRules: [],
      confirmPasswordRules: [],
      group_id: this.editItem.group_id,
      updateAdmin: false
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
        title: "Atualizar Usuário ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        showLoaderOnConfirm: true
      }).then(result => {
        if (result.isConfirmed) {
          this.$axios
            .put(`users/${data.id}`, data)
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
      let resetPass = false;
      let data = {};

      data = {
        id: this.editItem._id,
        name: this.editItem.name,
        email: this.editItem.email,
        group_id: this.editItem.group.value
      };

      resetPass = this.validResetPassword();

      if (resetPass) {
        data.password = this.editItem.password;
        data.confirmPassword = this.editItem.confirmPassword;
      }

      return data;
    },

    validResetPassword() {
      return (
        this.editItem.password !== "" && this.editItem.confirmPassword !== ""
      );
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
