<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-6">
      <q-card>
        <q-card-section>
          <div class="text-h5 text-primary" align="center">
            Cadastrar Cliente
          </div>
        </q-card-section>
        <q-list>
          <q-form @submit="onSubmit" class="form" ref="userCreateForm">
            <q-card-section>
              <ClientManagement :password-rules="passwordRules" :confirm-password-rules="confirmPasswordRules" :editItem="editItem"></ClientManagement>
            </q-card-section>
            <div class="" align="right">
              <q-btn @click="cancelAdd" class="q-ma-md" label="Cancelar"></q-btn>
              <q-btn label="Salvar" type="submit" class="q-ma-md" color="primary"/>
            </div>
          </q-form>
        </q-list>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import ClientManagement from "./clientManagement.vue"
import { defineComponent } from '@vue/composition-api'

const defaultItem = {
  name: '' ,
  email: '' ,
  password: '',
  confirmPassword: '',
  group_id: ''
}

export default defineComponent({
  name: "ClientRegister",
  components: { ClientManagement },
  data () {
    return {
      editItem: defaultItem,
      prompt: false,
      passwordRules: [
        v => !!v || 'Senha obrigatória',
        v => v.length >= 6 || 'Minimo 6 caracteres'
      ],
      confirmPasswordRules: [
        v => !!v || 'Senha obrigatória',
        v => v.length >= 6 || 'Minimo 6 caracteres'
      ]
    }
  },

  methods: {
    onSubmit() {

      this.editItem.group_id = this.editItem.group.value;

      this.$swal({
        title: 'Cadastrar Usuário ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Cadastrar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true
      }).then((result) => {

        if (result.isConfirmed) {

          this.$axios.post('users', this.editItem).then(response => {
            this.$swal({
              title: response.data.Message,
              icon: 'success',
              showConfirmButton: true
            })
            this.resetForm();
            this.$emit('showCreate', false);
          })
          .catch(error => {
            this.$swal({
              title: 'Erro ao cadastrar !',
              text: 'Entre em contato com o suporte',
              icon: 'error',
              showConfirmButton: true
            })
          });
        }
      })
    },

    cancelAdd () {
      this.$swal({
        title: 'Cancelar cadastro ?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Voltar',
        confirmButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.resetForm();
          this.$emit('showCreate', false);
        }
      })
    },

    resetForm () {
      defaultItem.name = '';
      defaultItem.email = '';
      defaultItem.password = '';
      defaultItem.confirmPassword = '';
      defaultItem.group_id = '';
    },

    hide(){
      this.prompt = false
    }
  }
})
</script>
