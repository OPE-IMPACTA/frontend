<template>
  <q-page class="row items-center justify-evenly" v-if="this.editItem || forceRedirect()">
    <div class="col-md-6">
      <q-card>
        <q-card-section>
          <div class="text-h5 text-primary text-center">
            Atualizar cliente
          </div>
        </q-card-section>
        <q-list>
          <q-form @submit="handleSubmit" class="form" ref="clientCreateForm">
            <q-card-section>
              <client-management
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

import ClientManagement from './client-management'
import services from '../../services'
import sleep from 'src/utils/sleep'
import { clearLocalStorage } from 'src/utils/local-storage'
import { warning } from 'src/utils/sweet-alert'

export default {
  name: 'ClientUpdate',
  props: {
    editItem: {}
  },
  components: { ClientManagement },
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
        'Atualizar cliente',
        'Tem certeza que deseja alterar os dados do cliente?',
        'Alterar'
      )

      if (response.isConfirmed) {
        try {
          const { errors } = await services.client.updateClient({
            id,
            data: updateData
          })

          if (!errors) {
            this.$toast.success('Cliente alterado com sucesso!', {
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
            this.$toast.error('Ocorreu um erro ao deletar o cliente!', {
              timeout: 2000
            })
          }
          await sleep(2000)
        } catch (error) {
          this.$toast.error('Ocorreu um erro ao deletar o cliente!', {
            timeout: 2000
          })
        }
      }
    },
    handleSubmit () {
      const {
        _id: id,
        name,
        email,
        cnpj,
        company,
        department,
        phone
      } = this.newEditItem

      this.updateClient({
        id: id,
        updateData: {
          name,
          email,
          cnpj,
          company,
          department,
          phone
        }
      })
    },
    async handleCancelAdd () {
      const response = await warning(
        'Cancelar cadastro',
        'Tem certeza que deseja cancelar o cadastro do cliente?',
        'Cancelar'
      )

      if (response.isConfirmed) {
        await this.$router.push({ name: 'Client' })
      }
    },
    forceRedirect () {
      this.$router.push({ name: 'Client' })
    }
  }
}
</script>
