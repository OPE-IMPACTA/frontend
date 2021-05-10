<template>
  <q-layout view="lHh Lpr lFf">
    <q-header v-if="isLogin" elevated class="bg-secondary text-primary">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title class="text-center" v-if="isLogin"
          >Bem-vindo (a) {{ username }}!</q-toolbar-title
        >
        <q-btn
          v-if="isLogin"
          ref="btnLogout"
          class="btnLogout"
          @click="onLogout"
          icon-right="logout"
          label="Sair"
        />
      </q-toolbar>
    </q-header>
    <q-drawer
      v-if="isLogin"
      v-model="leftDrawerOpen"
      side="left"
      elevated
      class="left-navigation text-accent bg-primary"
      show-if-above
    >
      <div class="full-height bg-primary">
        <MenuLateral></MenuLateral>
      </div>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer v-if="isLogin" class="bg-secondary text-primary">
      <q-toolbar>
        <q-toolbar-title class="q-ml-xl">
          Nós somos Bullest
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { use } from "echarts";
import MenuLateral from "../components/Menu.vue";

export default defineComponent({
  name: "MainLayout",
  components: { MenuLateral },
  setup() {
    const leftDrawerOpen = ref(false);
    return { leftDrawerOpen };
  },

  data() {
    return {
      user: {},
      username: ""
    };
  },

  created() {
    this.user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : "";

    this.username = this.user.data.name;
  },

  computed: {
    isLogin() {
      return this.$route.name !== "login";
    }
  },
  methods: {
    onLogout() {
      this.$axios
        .post("/auth/logout")
        .then(response => {
          localStorage.setItem("user", "");
          localStorage.setItem("token", "");
          this.$axios.defaults.headers.common["Authorization"] = "";
          this.leftDrawerOpen = false;
          this.$router.push({ name: "login" });
        })
        .catch(er => {
          console.log(er);
        });
    }
  }
});
</script>

<style lang="scss">
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

.menu-lateral {
  background: $cyan-7;
}
</style>
