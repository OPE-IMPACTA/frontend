<template>
  <q-page class="row items-center justify-evenly" v-if="this.editItem || forceRedirect()">
    <div class="col-md-6">
      <q-card>
        <q-card-section>
          <div class="text-h5 text-primary text-center" v-if="!changePassword">
            Atualizar usuário
          </div>
          <div class="text-h5 text-primary text-center" v-else>
            Atualizar senha
          </div>
        </q-card-section>
        <q-list>
          <q-form @submit="handleSubmit" class="form" ref="userCreateForm">
            <q-card-section>
              <user-management
                :visibilityFields="visibilityFields"
                :changePassword="changePassword"
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
              <q-btn
                v-if="btnEdit"
                label="Editar senha"
                class="q-mr-md"
                color="orange"
                @click="handleChangeVisibilityPassword(true, false, false)"
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

export default {
  name: 'UserUpdate',
  props: {
    editItem: {}
  },
  components: { UserManagement },
  data () {
    return {
      visibilityFields: true,
      changePassword: false,
      btnEdit: true,
      newEditItem: this.editItem
    }
  },
  methods: {
    async updateUser ({
      id,
      updateData
    }) {
      const response = await warning(
        'Atualizar usuário',
        'Tem certeza que deseja alterar os dados do usuário?',
        'Alterar'
      )

      if (response.isConfirmed) {
        try {
          const { errors } = await services.user.updateUser({
            id,
            data: updateData
          })

          if (!errors) {
            this.$toast.success('Usuário alterado com sucesso!', {
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
          this.$toast.error('Ocorreu um erro ao deletar o usuário!', {
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
        password,
        confirmPassword
      } = this.newEditItem

      if (password && confirmPassword) {
        this.updateUser({
          id: id,
          updateData: {
            password,
            confirmPassword
          }
        })
        return
      }

      this.updateUser({
        id: id,
        updateData: {
          name,
          email,
          group_id: this.newEditItem.group.value
        }
      })
    },
    handleChangeVisibilityPassword (changePassword, visibilityFields, btnEdit) {
      this.changePassword = changePassword
      this.visibilityFields = visibilityFields
      this.btnEdit = btnEdit
    },
    async handleCancelAdd () {
      if (this.changePassword) {
        this.newEditItem.password = ''
        this.newEditItem.confirmPassword = ''
        this.handleChangeVisibilityPassword(false, true, true)
        return
      }

      const response = await warning(
        'Cancelar cadastro',
        'Tem certeza que deseja cancelar o cadastro do usuário?',
        'Cancelar'
      )

      if (response.isConfirmed) {
        await this.$router.push({ name: 'User' })
      }
    },
    forceRedirect () {
      this.$router.push({ name: 'User' })
    }
  }
}
</script>
