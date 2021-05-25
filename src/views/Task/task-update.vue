<template>
  <q-page class="row items-center justify-evenly" v-if="this.editItem || forceRedirect()">
    <div class="col-md-6">
      <q-card>
        <q-card-section>
          <div class="text-h5 text-primary text-center">
            Atualizar tarefa
          </div>
        </q-card-section>
        <q-list>
          <q-form @submit="handleSubmit" class="form" ref="tarefaCreateForm">
            <q-card-section>
              <task-management
                :editItem="newEditItem"
              />
            </q-card-section>
            <div class="text-right">
              <q-btn
                @click="handleCancelAdd"
                class="q-ma-ls"
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

import TaskManagement from './task-management'
import services from '../../services'
import sleep from 'src/utils/sleep'
import { clearLocalStorage } from 'src/utils/local-storage'
import { warning } from 'src/utils/sweet-alert'

export default {
  name: 'TaskUpdate',
  props: {
    editItem: {}
  },
  components: { TaskManagement },
  data () {
    return {
      newEditItem: this.editItem
    }
  },
  methods: {
    async updateClient ({
      id,
      updateData
    }) {
      const response = await warning(
        'Atualizar tarefa',
        'Tem certeza que deseja alterar os dados do tarefa?',
        'Alterar'
      )

      if (response.isConfirmed) {
        try {
          const { errors } = await services.task.updateTask({
            id,
            data: updateData
          })

          if (!errors) {
            this.$toast.success('Task alterado com sucesso!', {
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
            this.$toast.error('Ocorreu um erro ao deletar a tarefa!', {
              timeout: 2000
            })
          }
          await sleep(2000)
        } catch (error) {
          this.$toast.error('Ocorreu um erro ao deletar a tarefa!', {
            timeout: 2000
          })
        }
      }
    },
    handleSubmit () {
      const {
        _id: id
      } = this.newEditItem

      this.updateClient({
        id: id,
        updateData: {
          project_id: this.editItem.project.value || this.editItem.project_id,
          user_id: this.editItem.user.value || this.editItem.user_id,
          description: this.editItem.description,
          startDate: this.editItem.startDate,
          endDate: this.editItem.endDate,
          hours: this.editItem.hours
        }
      })
    },
    async handleCancelAdd () {
      const response = await warning(
        'Cancelar cadastro',
        'Tem certeza que deseja cancelar o cadastro da tarefa?',
        'Cancelar'
      )

      if (response.isConfirmed) {
        await this.$router.push({ name: 'Task' })
      }
    },
    forceRedirect () {
      this.$router.push({ name: 'Task' })
    }
  }
}
</script>
