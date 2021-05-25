<template>
  <q-scroll-area class="fit">
    <q-list padding>
      <q-item
        to="Home"
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
      link: 'inbox'
    }
  },
  methods: {
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
