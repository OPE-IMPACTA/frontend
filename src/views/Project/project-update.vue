<template>
  <q-page class="row items-center justify-evenly" v-if="this.editItem || forceRedirect()">
    <div class="col-md-6">
      <q-card>
        <q-card-section>
          <div class="text-h5 text-primary text-center">
            Atualizar projeto
          </div>
        </q-card-section>
        <q-list>
          <q-form @submit="handleSubmit" class="form" ref="projectCreateForm">
            <q-card-section>
              <project-management
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

import ProjectManagement from './project-management'
import services from '../../services'
import sleep from 'src/utils/sleep'
import { clearLocalStorage } from 'src/utils/local-storage'
import { warning } from 'src/utils/sweet-alert'

export default {
  name: 'ProjectUpdate',
  props: {
    editItem: {}
  },
  components: { ProjectManagement },
  data () {
    return {
      newEditItem: this.editItem
    }
  },
  methods: {
    async updateProject ({
      id,
      updateData
    }) {
      const response = await warning(
        'Atualizar projeto',
        'Tem certeza que deseja alterar os dados do projeto?',
        'Alterar'
      )

      if (response.isConfirmed) {
        try {
          const { errors } = await services.project.updateProject({
            id,
            data: updateData
          })

          if (!errors) {
            this.$toast.success('Projeto alterado com sucesso!', {
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
            this.$toast.error('Ocorreu um erro ao deletar o projeto!', {
              timeout: 2000
            })
          }
          await sleep(2000)
        } catch (error) {
          this.$toast.error('Ocorreu um erro ao deletar o projeto!', {
            timeout: 2000
          })
        }
      }
    },
    handleSubmit () {
      const {
        _id: id,
        name,
        description
      } = this.newEditItem

      this.updateProject({
        id: id,
        updateData: {
          name,
          description,
          user_id: this.editItem.user.value || this.editItem.user_id,
          client_id: this.editItem.client.value || this.editItem.client_id
        }
      })
    },
    async handleCancelAdd () {
      const response = await warning(
        'Cancelar cadastro',
        'Tem certeza que deseja cancelar o cadastro do projeto?',
        'Cancelar'
      )

      if (response.isConfirmed) {
        await this.$router.push({ name: 'Project' })
      }
    },
    forceRedirect () {
      this.$router.push({ name: 'Project' })
    }
  }
}
</script>
