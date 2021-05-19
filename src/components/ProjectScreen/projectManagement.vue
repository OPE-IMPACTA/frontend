<template>
  <div>
    <q-item>
      <q-item-section>
        <q-input
          outlined
          v-model="editItem.name"
          type="text"
          label="Nome"
          lazy-rules=""
          :rules="[v => !!v || 'Nome obrigatório']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          outlined
          v-model="editItem.user"
          :options="users"
          label="Usuários"
          lazy-rules=""
          :rules="[v => !!v || 'Usuário obrigatório']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          outlined
          v-model="editItem.client"
          :options="clients"
          label="Clientes"
          lazy-rules=""
          :rules="[v => !!v || 'Clientes obrigatório']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          outlined
          v-model="editItem.description"
          type="textarea"
          label="Descrição"
          lazy-rules=""
          :rules="[v => !!v || 'Descrição obrigatório']"
        />
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

const defaultItem = {
  user: '',
  client: '',
  description: '',
  name: ''
}

export default defineComponent({
  props: {
    editItem: {}
  },
  name: 'projectManagement',
  data () {
    return {
      users: [],
      user: '',
      clients: [],
      client: ''
    }
  },
  mounted () {
    if (
      typeof this.$axios.defaults.headers.common.Authorization ===
      'undefined' ||
      this.$axios.defaults.headers.common.Authorization === ''
    ) {
      void this.$router.push({ path: '/' })
    }

    this.$axios
      .get('/users')
      .then(({ data }) => {
        data.data.forEach(item => {
          this.users.push({ value: item._id, label: item.name })
        })
      })
      .catch(() => {
        void this.$swal({
          title: 'Erro ao buscar grupos!',
          text: 'Entre em contato com o suporte',
          icon: 'error',
          showConfirmButton: true
        })
      })

    this.$axios
      .get('/clients')
      .then(({ data }) => {
        data.data.forEach(item => {
          this.clients.push({ value: item._id, label: item.name })
        })
      })
      .catch(() => {
        void this.$swal({
          title: 'Erro ao buscar grupos!',
          text: 'Entre em contato com o suporte',
          icon: 'error',
          showConfirmButton: true
        })
      })
  },
  methods: {
    close () {
      setTimeout(() => {
        this.editItem = Object.assign({}, this.defaultItem)
        this.resetForm()
        this.editedIndex = -1
        this.$emit('hide_create_project', { show: false, reset: false })
      }, 300)
    },

    resetForm () {
      defaultItem.user = ''
      defaultItem.client = ''
      defaultItem.description = ''
      defaultItem.name = ''
    }
  }
})
</script>
