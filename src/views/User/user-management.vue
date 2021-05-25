<template>
  <div>
    <q-item items-center v-if="visibilityFields">
      <q-item-section>
        <q-input
          outlined
          v-model="newEditItem.name"
          label="Nome completo"
          type="text"
          color="orange"
          :rules="emptyField('Nome obrigatório')"/>
      </q-item-section>
    </q-item>
    <q-item items-center v-if="visibilityFields">
      <q-item-section>
        <q-input
          outlined
          v-model="newEditItem.email"
          label="Email"
          type="email"
          color="orange"
          :rules="email()"/>
      </q-item-section>
    </q-item>
    <q-item  items-center v-if="visibilityFields">
      <q-item-section>
        <q-select
          outlined
          v-model="newEditItem.group"
          label="Grupo"
          color="orange"
          :options="groups"
          :rules="emptyField('Nome obrigatório')"/>
      </q-item-section>
    </q-item>
    <q-item class="col-md-12" v-if="changePassword">
      <div class="col-md-6">
        <q-input
          bottom-slots
          label="Senha"
          class="q-ma-sm"
          color="orange"
          v-model="newEditItem.password"
          :type="visibilityPass"
          :rules="password(this.newEditItem.password)"
        >
          <template v-slot:prepend>
            <q-icon name="vpn_key"/>
          </template>
          <template v-slot:after>
            <q-btn
              flat
              v-if="visibilityPass === 'password'"
              @click="showPassword('visibilityPass')"
              icon="fas fa-eye"
            />
            <q-btn
              flat
              v-if="visibilityPass === 'text'"
              @click="hidePassword('visibilityPass')"
              icon="fas fa-eye-slash"
            />
          </template>
        </q-input>
      </div>
      <div class="col-md-6">
        <q-input
          label="Confirmar Senha"
          class="q-ma-sm"
          color="orange"
          v-model="newEditItem.confirmPassword"
          :type="visibilityConfirmPass"
          :rules="password(this.newEditItem.password)"
        >
          <template v-slot:prepend>
            <q-icon name="vpn_key"/>
          </template>
          <template v-slot:after>
            <q-btn
              flat
              v-if="visibilityConfirmPass === 'password'"
              @click="showPassword('visibilityConfirmPass')"
              icon="fas fa-eye"
            />
            <q-btn
              flat
              v-if="visibilityConfirmPass === 'text'"
              @click="hidePassword('visibilityConfirmPass')"
              icon="fas fa-eye-slash"
            />
          </template>
        </q-input>
      </div>
    </q-item>
  </div>
</template>

<script>
import services from 'src/services'
import { clearLocalStorage } from 'src/utils/local-storage'
import { emptyField, email, password } from 'src/utils/rules-fields'

export default {
  name: 'UserManagement',
  props: {
    changePassword: Boolean,
    visibilityFields: Boolean,
    editItem: {}
  },
  data () {
    return {
      newEditItem: this.editItem,
      visibilityPass: 'password',
      visibilityConfirmPass: 'password',
      groups: [],
      emptyField,
      email,
      password
    }
  },
  mounted () {
    this.getAllGroups()
  },
  methods: {
    async getAllGroups () {
      try {
        const {
          data,
          errors
        } = await services.group.getAll()

        if (!errors) {
          data.forEach(({
            _id: id,
            group
          }) => {
            this.groups.push({
              value: id,
              label: group
            })
          })
          return
        }

        if (errors.status === 401) {
          this.$toast.error('Token inválido!', {
            timeout: 2000
          })
          clearLocalStorage()
          await this.$router.push({ name: 'Login' })
        }
      } catch (error) {
        this.$toast.error('Ocorreu um erro ao realizar o login', {
          timeout: 2000
        })
      }
    },
    showPassword (visibility) {
      this[visibility] = 'text'
    },
    hidePassword (visibility) {
      this[visibility] = 'password'
    }
  }
}
</script>
