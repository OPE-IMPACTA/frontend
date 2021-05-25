<template>
  <q-layout view="hHh Lpr lFf" class="bg-grey-2">
    <q-header
      elevated
      v-if="isLogin"
    >
      <q-toolbar>
        <q-btn
          flat
          @click="drawer = !drawer"
          round
          dense
          icon="menu"
        />
        <q-toolbar-title
          v-if="isLogin"
          class="text-center"
        >
          Seja bem-vindo! {{ user.name }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      elevated
      show-if-above
      v-if="isLogin"
      v-model="drawer"
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      :width="200"
      :breakpoint="500"
      bordered
    >
      <menu-lateral/>
    </q-drawer>
    <q-page-container class="q-ml-xl">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import MenuLateral from './menu-lateral'

export default {
  name: 'MainLayout',
  components: { MenuLateral },
  data () {
    return {
      drawer: false,
      miniState: true,
      user: {}
    }
  },
  computed: {
    routeName () {
      return this.$route.name
    },
    isLogin () {
      return this.$route.name !== 'Login'
    }
  },
  watch: {
    routeName () {
      const user = window.localStorage.getItem('user')
      if (user) {
        this.user = JSON.parse(user)
      }
    }
  }
}
</script>
