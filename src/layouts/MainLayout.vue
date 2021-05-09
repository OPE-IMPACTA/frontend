<template>
  <q-layout view="lHh Lpr lFf">
    <q-header v-if="isLogin" elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title>

        </q-toolbar-title>
        <q-toolbar-title v-if="isLogin">Bem-vindo (a) {{this.username}}!</q-toolbar-title>

        <div
          :class="$q.dark.isActive ? 'dark_gradient' : 'normal_gradient'"
        ></div>

        <q-btn
          color="#9c9c9c"
          flat
          round
          @click="$q.dark.toggle()"
          :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"
        />
        <q-btn v-if="isLogin" ref="btnLogout" class="btnLogout" @click="onLogout" icon-right="logout" label="Sair" />
      </q-toolbar>
    </q-header>
    <q-drawer
      v-if="isLogin"
      v-model="leftDrawerOpen"
      side="left"
      elevated
      class="left-navigation text-white"
      show-if-above
    >
      <div
        class="full-height drawer_normal"
      >
      <MenuLateral></MenuLateral>
      </div>
    </q-drawer>
    <q-page-container>
      <router-view/>
    </q-page-container>

    <q-footer v-if="isLogin" elevated >
      <q-toolbar>
        <q-toolbar-title>
         E2E
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import {
  Loading,
  QSpinnerPie
} from 'quasar'

import { defineComponent, ref } from '@vue/composition-api'
import MenuLateral from "components/Menu.vue"

export default defineComponent({
  name: 'MainLayout',
  components: { MenuLateral },
  setup () {
    const leftDrawerOpen = ref(false)
    return { leftDrawerOpen }
  },

  data () {
    return {
      user: {},
      username: ''
    }
  },

  created() {
    this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
    this.username = this.user.name;
  },

  computed: {
    isLogin () {
      return this.$route.name !== 'login'
    }
  },
  methods: {
    onLogout () {
      this.$axios.post('/auth/logout').then((response) => {
        localStorage.setItem('user', '');
        localStorage.setItem('token', '');
        this.$axios.defaults.headers.common['Authorization'] = '';
        this.leftDrawerOpen = false;
        this.$router.push({ name: 'login' });
      }).catch((er) =>{
        console.log(er)
      });
    }
  }
})
</script>

<style>
.q-drawer {
  background-size: contain !important;
  background-repeat: no-repeat;
  background-position: bottom;
}
.drawer_normal {
  background-color: rgba(1, 1, 1, 0.75);
}
.tab-active {
  background-color: green;
}
</style>
