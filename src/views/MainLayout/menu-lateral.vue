<template>
  <q-scroll-area class="fit">
    <q-list padding>
      <q-item
        to="/home"
        exact
        clickable
        v-ripple
        class="menu"
        active-class="menu-link"
        :active="link === 'inbox'"
        @click="link = 'inbox'"
      >
        <q-item-section avatar>
          <q-icon name="home"/>
        </q-item-section>

        <q-item-section>
          Home
        </q-item-section>
      </q-item>

      <q-item
        v-if="group === 'admin'"
        to="/user"
        exact
        clickable
        v-ripple
        class="menu"
        active-class="menu-link"
        :active="link === 'inbox'"
        @click="link = 'inbox'"
      >
        <q-item-section avatar>
          <q-icon name="people_alt"/>
        </q-item-section>

        <q-item-section>
          Usuários
        </q-item-section>
      </q-item>

      <q-item
        to="/client"
        exact
        clickable
        v-ripple
        class="menu"
        active-class="menu-link"
        :active="link === 'inbox'"
        @click="link = 'inbox'"
      >
        <q-item-section avatar>
          <q-icon name="contacts"/>
        </q-item-section>

        <q-item-section>
          Clientes
        </q-item-section>
      </q-item>

      <q-item
        to="/project"
        exact
        clickable
        v-ripple
        class="menu"
        active-class="menu-link"
        :active="link === 'inbox'"
        @click="link = 'inbox'"
      >
        <q-item-section avatar>
          <q-icon name="folder_shared"/>
        </q-item-section>

        <q-item-section>
          Projetos
        </q-item-section>
      </q-item>

      <q-item
        to="/task"
        exact
        clickable
        v-ripple
        class="menu"
        active-class="menu-link"
        :active="link === 'inbox'"
        @click="link = 'inbox'"
      >
        <q-item-section avatar>
          <q-icon name="task_alt"/>
        </q-item-section>

        <q-item-section>
          Tarefas
        </q-item-section>
      </q-item>

      <q-separator/>

      <q-item
        clickable
        v-ripple
        class="menu"
        @click="handleLogout"
      >
        <q-item-section avatar>
          <q-icon name="logout"/>
        </q-item-section>

        <q-item-section>
          Sair
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>

<script>
import services from 'src/services'
import { clearLocalStorage } from 'src/utils/local-storage'

export default {
  name: 'MenuLateral',
  data () {
    return {
      link: 'inbox',
      group: ''
    }
  },
  methods: {
    async getAllGroups () {
      try {
        const {
          data,
          errors
        } = await services.group.getAll()

        if (!errors) {
          return data
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
    async handleLogout () {
      try {
        await services.user.logout()
        clearLocalStorage()
        await this.$router.push({ name: 'Login' })
      } catch (error) {
        clearLocalStorage()
        await this.$router.push({ name: 'Login' })
      }
    }
  },
  showPassword (visibility) {
    this[visibility] = 'text'
  },
  hidePassword (visibility) {
    this[visibility] = 'password'
  },
  async mounted () {
    const groups = await this.getAllGroups()
    const user = window.localStorage.getItem('user')
    const groupID = user ? JSON.parse(user).group_id : ''
    const result = groups.find(({ _id: id }) => id === groupID)
    this.group = result.group
  }
}
</script>

<style lang="scss">
.menu {
  color: $dark;
}

.menu-link {
  color: white;
  background-color: orange;
  font-size: 1.2rem;
  box-shadow: 0 6px 12px rgba(30, 60, 90, 0.2);
  transform: scale(1);
}
</style>
