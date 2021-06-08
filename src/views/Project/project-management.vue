<template>
  <div>
    <q-item items-center>
      <q-item-section>
        <q-input
          outlined
          v-model="newEditItem.name"
          label="Nome do projeto"
          type="text"
          color="orange"
          :rules="emptyField('Nome obrigatório')"/>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          outlined
          v-model="newEditItem.user"
          label="Usuários"
          color="orange"
          :options="users"
          :rules="emptyField('Usuário obrigatório')"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          outlined
          v-model="newEditItem.client"
          label="Clientes"
          color="orange"
          :options="clients"
          :rules="emptyField('Usuário obrigatório')"
        />
      </q-item-section>
    </q-item>
    <q-item v-if="newEditItem.status">
      <q-item-section>
        <q-select
          outlined
          v-model="newEditItem.status"
          label="Status"
          color="orange"
          :options="status"
          :rules="emptyField('Usuário obrigatório')"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          outlined
          v-model="newEditItem.description"
          label="Descrição"
          type="textarea"
          color="orange"
          :rules="emptyField('Descrição obrigatório')"
        />
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import { emptyField } from 'src/utils/rules-fields'
import services from 'src/services'
import { clearLocalStorage } from 'src/utils/local-storage'
import { STATUS } from 'src/utils/constant'

export default {
  name: 'ClientManagement',
  props: {
    editItem: {}
  },
  data () {
    return {
      newEditItem: this.editItem,
      users: [],
      clients: [],
      status: [
        { value: 'new', label: 'Novo' },
        { value: 'progress', label: 'Em andamento' },
        { value: 'completed', label: 'Finalizado' },
        { value: 'canceled', label: 'Cancelado' }
      ],
      emptyField
    }
  },
  mounted () {
    this.newEditItem.status = STATUS[this.editItem.status].label
    this.getClients()
    this.getUsers()
  },
  methods: {
    async getClients () {
      try {
        const {
          data,
          errors
        } = await services.client.getClients()

        if (errors && errors.status === 401) {
          clearLocalStorage()
          this.$toast.error('Token inválido', {
            timeout: 2000
          })
          await this.$router.push({ name: 'Login' })
        }

        data.data.forEach(({
          _id: id,
          name
        }) => {
          this.clients.push({
            value: id,
            label: name
          })
        })
      } catch (error) {
        this.$toast.error('Ocorreu um erro ao buscar os clientes', {
          timeout: 2000
        })
      }
    },
    async getUsers () {
      try {
        const {
          data,
          errors
        } = await services.user.getUsers()

        if (errors && errors.status === 401) {
          clearLocalStorage()
          this.$toast.error('Token inválido', {
            timeout: 2000
          })
          await this.$router.push({ name: 'Login' })
        }

        data.data.forEach(({
          _id: id,
          name
        }) => {
          this.users.push({
            value: id,
            label: name
          })
        })
      } catch (error) {
        this.$toast.error('Ocorreu um erro ao buscar os usuários', {
          timeout: 2000
        })
      }
    }
  }
}
</script>
