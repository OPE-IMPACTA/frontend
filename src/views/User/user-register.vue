<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-6">
      <q-card>
        <q-card-section>
          <div
            class="text-h4 text-orange text-center q-pt-lg"
          >
            Cadastrar usuário
          </div>
        </q-card-section>
        <q-list>
          <q-form
            @submit="handleSubmit"
            class="form"
            ref="userCreateForm"
          >
            <q-card-section>
              <user-management
                :changePassword="true"
                :visibilityFields="true"
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
import UserManagement from './user-management'
import services from '../../services'
import sleep from 'src/utils/sleep'
import { clearLocalStorage } from 'src/utils/local-storage'
import { warning } from 'src/utils/sweet-alert'

const defaultItem = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  group_id: '',
  group: ''
}

export default {
  name: 'UserRegister',
  components: { UserManagement },
  data () {
    return {
      editItem: defaultItem
    }
  },
  methods: {
    async handleSubmit () {
      try {
        this.editItem.group_id = this.editItem.group.value
        const { errors } = await services.user.registerUser({ data: this.editItem })

        if (!errors) {
          this.resetForm()
          this.$toast.success('Usuário criado com sucesso!', {
            timeout: 2000
          })
          await this.$router.push({ name: 'User' })
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
          this.$toast.error('E-mail está sendo utilizado por outro usuário!', {
            timeout: 3000
          })
        }
        await sleep(2000)
      } catch (error) {
        this.$toast.error('Ocorreu um erro ao criar o usuário!', {
          timeout: 2000
        })
      }
    },
    async handleCancelAdd () {
      const response = await warning('Cancelar cadastro', 'Tem certeza que deseja cancelar o cadastro do usuário?', 'Cancelar')
      if (response.isConfirmed) {
        this.resetForm()
        await this.$router.push({ name: 'User' })
      }
    },
    resetForm () {
      defaultItem.name = ''
      defaultItem.email = ''
      defaultItem.password = ''
      defaultItem.confirmPassword = ''
      defaultItem.group_id = ''
      defaultItem.group = ''
    }
  }
}
</script>
