<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-6">
      <q-card>
        <q-card-section>
          <div
            class="text-h4 text-orange text-center q-pt-lg"
          >
            Cadastrar projeto
          </div>
        </q-card-section>
        <q-list>
          <q-form
            @submit="handleSubmit"
            class="form"
            ref="projectCreateForm"
          >
            <q-card-section>
              <project-management
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
import ProjectManagement from './project-management'
import services from '../../services'
import sleep from 'src/utils/sleep'
import { clearLocalStorage } from 'src/utils/local-storage'
import { warning } from 'src/utils/sweet-alert'

const defaultItem = {
  name: '',
  description: '',
  user: '',
  user_id: '',
  client: '',
  client_id: ''
}

export default {
  name: 'ProjectRegister',
  components: { ProjectManagement },
  data () {
    return {
      editItem: defaultItem
    }
  },
  methods: {
    async handleSubmit () {
      try {
        const { errors } = await services.project.registerProject({
          data: {
            name: this.editItem.name,
            description: this.editItem.description,
            client_id: this.editItem.client.value,
            user_id: this.editItem.user.value,
            status: 'Novo'
          }
        })

        if (!errors) {
          this.resetForm()
          this.$toast.success('Projeto criado com sucesso!', {
            timeout: 2000
          })
          await this.$router.push({ name: 'Project' })
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
          this.$toast.error('Ocorreu um erro ao criar o projeto!', {
            timeout: 2000
          })
        }
        await sleep(2000)
      } catch (error) {
        this.$toast.error('Ocorreu um erro ao criar o projeto!', {
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
        await this.$router.push({ name: 'Project' })
      }
    },
    resetForm () {
      defaultItem.user = ''
      defaultItem.client = ''
      defaultItem.description = ''
      defaultItem.name = ''
    }
  }
}
</script>
