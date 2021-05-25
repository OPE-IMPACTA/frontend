<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-6">
      <q-card>
        <q-card-section>
          <div
            class="text-h4 text-orange text-center q-pt-lg"
          >
            Cadastrar cliente
          </div>
        </q-card-section>
        <q-list>
          <q-form
            @submit="handleSubmit"
            class="form"
            ref="clientCreateForm"
          >
            <q-card-section>
              <client-management
                :editItem="editItem"
              />
            </q-card-section>
            <div class="text-right">
              <q-btn
                @click="handleCancelAdd"
                class="q-ma-md"
                label="Cancelar"
              />
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
import ClientManagement from './client-management'
import services from '../../services'
import sleep from 'src/utils/sleep'
import { clearLocalStorage } from 'src/utils/local-storage'
import { warning } from 'src/utils/sweet-alert'

const defaultItem = {
  name: '',
  email: '',
  cnpj: '',
  empresa: '',
  departamento: '',
  telefone: ''
}

export default {
  name: 'ClientRegister',
  components: { ClientManagement },
  data () {
    return {
      editItem: defaultItem
    }
  },
  methods: {
    async handleSubmit () {
      try {
        const { errors } = await services.client.registerClient({ data: this.editItem })

        if (!errors) {
          this.resetForm()
          this.$toast.success('Cliente criado com sucesso!', {
            timeout: 2000
          })
          await this.$router.push({ name: 'Client' })
          return
        }

        if (errors.status === 401) {
          this.$toast.error('Token inválido!', {
            timeout: 2000
          })
          clearLocalStorage()
          await this.$router.push({ name: 'Login' })
          return
        }

        if (errors.status === 400) {
          this.$toast.error('Ocorreu um erro ao criar o cliente!', {
            timeout: 2000
          })
        }
        await sleep(2000)
      } catch (error) {
        this.$toast.error('Ocorreu um erro ao criar o cliente!', {
          timeout: 2000
        })
      }
    },
    async handleCancelAdd () {
      const response = await warning(
        'Cancelar cadastro',
        'Tem certeza que deseja cancelar o cadastro do cliente?',
        'Cancelar'
      )
      if (response.isConfirmed) {
        this.resetForm()
        await this.$router.push({ name: 'Client' })
      }
    },
    resetForm () {
      defaultItem.name = ''
      defaultItem.email = ''
      defaultItem.cnpj = ''
      defaultItem.company = ''
      defaultItem.department = ''
      defaultItem.phone = ''
    }
  }
}
</script>
