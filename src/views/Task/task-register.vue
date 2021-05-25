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
              <task-management
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
import TaskManagement from './task-management'
import services from '../../services'
import sleep from 'src/utils/sleep'
import { clearLocalStorage } from 'src/utils/local-storage'
import { warning } from 'src/utils/sweet-alert'

const defaultItem = {
  project: '',
  user: '',
  description: '',
  startDate: '',
  endDate: '',
  hours: ''
}

export default {
  name: 'TaskRegister',
  components: { TaskManagement },
  data () {
    return {
      editItem: defaultItem
    }
  },
  methods: {
    async handleSubmit () {
      try {
        const { errors } = await services.task.registerTask({
          data: {
            project_id: this.editItem.project.value,
            user_id: this.editItem.user.value,
            description: this.editItem.description,
            startDate: this.editItem.startDate,
            endDate: this.editItem.endDate,
            hours: this.editItem.hours
          }
        })

        if (!errors) {
          this.resetForm()
          this.$toast.success('Tarefa criada com sucesso!', {
            timeout: 2000
          })
          await this.$router.push({ name: 'Task' })
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
          this.$toast.error('Ocorreu um erro ao criar a tarefa!', {
            timeout: 2000
          })
        }
        await sleep(2000)
      } catch (error) {
        this.$toast.error('Ocorreu um erro ao criar a tarefa!', {
          timeout: 2000
        })
      }
    },
    async handleCancelAdd () {
      const response = await warning(
        'Cancelar cadastro',
        'Tem certeza que deseja cancelar o cadastro da tarefa?',
        'Cancelar'
      )
      if (response.isConfirmed) {
        this.resetForm()
        await this.$router.push({ name: 'Task' })
      }
    },
    resetForm () {
      defaultItem.project = ''
      defaultItem.user = ''
      defaultItem.description = ''
      defaultItem.startDate = ''
      defaultItem.endDate = ''
      defaultItem.hours = ''
    }
  }
}
</script>
