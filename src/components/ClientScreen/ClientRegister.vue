<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-6">
      <q-card>
        <q-card-section>
          <div class="text-h5 text-primary text-center">
            Cadastrar Cliente
          </div>
        </q-card-section>
        <q-list>
          <q-form @submit="onSubmit" class="form" ref="clientCreateForm">
            <q-card-section>
              <ClientManagement :editItem="editItem"></ClientManagement>
            </q-card-section>
            <div class="text-right">
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
import ClientManagement from './clientManagement.vue'
import { defineComponent } from '@vue/composition-api'

const defaultItem = {
  name: '',
  email: '',
  cnpj: '',
  empresa: '',
  departamento: '',
  telefone: ''
}

export default defineComponent({
  name: 'ClientRegister',
  components: { ClientManagement },
  data () {
    return {
      editItem: defaultItem,
      prompt: false
    }
  },

  methods: {
    onSubmit () {
      void this.$swal({
        title: 'Cadastrar Cliente ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Cadastrar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true
      }).then(result => {
        if (result.isConfirmed) {
          this.$axios
            .post('clients', this.editItem)
            .then(response => {
              void this.$swal({
                title: response.data.Message,
                icon: 'success',
                showConfirmButton: true
              })
              this.resetForm()
              this.$emit('showCreate', false)
            })
            // eslint-disable-next-line handle-callback-err
            .catch(error => {
              void this.$swal({
                title: 'Erro ao cadastrar !',
                text: 'Entre em contato com o suporte',
                icon: 'error',
                showConfirmButton: true
              })
            })
        }
      })
    },

    cancelAdd () {
      void this.$swal({
        title: 'Cancelar cadastro ?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Voltar',
        confirmButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          this.resetForm()
          this.$emit('showCreate', false)
        }
      })
    },

    resetForm () {
      defaultItem.name = ''
      defaultItem.email = ''
      defaultItem.cnpj = ''
      defaultItem.company = ''
      defaultItem.department = ''
      defaultItem.phone = ''
    },

    hide () {
      this.prompt = false
    }
  }
})
</script>
