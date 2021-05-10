<template>
  <q-list bordered class="rounded-borders text-accent">
    <div class="q-toolbar row no-wrap items-center">
      <div class="col-md-12  row flex-center overflow-hidden">
        <img
          src="../assets/logo-bullest.png"
          style="width: 50%; padding: 15px; margin-top: 10px"
        />
      </div>
    </div>
    <q-item-label header class="text-secondary text-center text-h4">
      Admin
    </q-item-label>

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
        <q-icon name="fas fa-home" />
      </q-item-section>

      <q-item-section>
        Home
      </q-item-section>
    </q-item>

    <q-item
      to="/testes/gerenciar"
      exact
      clickable
      v-ripple
      class="menu"
      active-class="menu-link"
      :active="link === 'inbox'"
      @click="link = 'inbox'"
    >
      <q-item-section avatar>
        <i class="far fa-chart-bar"></i>
      </q-item-section>

      <q-item-section>
        <q-item-label>Gerenciar Testes</q-item-label>
      </q-item-section>
    </q-item>
    
    <q-item
      v-if="admin"
      to="/usuarios/gerenciar"
      exact
      clickable
      v-ripple
      class="menu"
      active-class="menu-link"
      :active="link === 'inbox'"
      @click="link = 'inbox'"
    >
      <q-item-section avatar>
        <i class="fas fa-users"></i>
      </q-item-section>

      <q-item-section>
        <q-item-label>Gerenciar Usuários</q-item-label>
      </q-item-section>
    </q-item>

    <q-item v-else
      to="/usuarios/gerenciar"
      exact
      clickable
      v-ripple
      class="menu"
      active-class="menu-link"
      :active="link === 'inbox'"
      @click="link = 'inbox'"
    >
      <q-item-section avatar>
        <i class="fas fa-users"></i>
      </q-item-section>

      <q-item-section>
        <q-item-label>Meus Dados</q-item-label>
      </q-item-section>
    </q-item>


    <q-expansion-item
      icon="fas fa-clipboard-list fa-2x"
      label="Gerenciar Relatórios"
    >
      <q-item
        to="/relatorios/historicos"
        exact
        clickable
        v-ripple
        class="menu"
        active-class="menu-link"
        :active="link === 'inbox'"
        @click="link = 'inbox'"
      >
        <q-item-section avatar>
          <q-icon name="content_paste" />
        </q-item-section>

        <q-item-section>
          Relatórios
        </q-item-section>
      </q-item>

      <q-item
        to="/relatorios/graficos"
        exact
        clickable
        v-ripple
        class="menu"
        active-class="menu-link"
        :active="link === 'inbox'"
        @click="link = 'inbox'"
      >
        <q-item-section avatar>
          <q-icon name="stacked_bar_chart" />
        </q-item-section>

        <q-item-section>
          Gráficos
        </q-item-section>
      </q-item>
    </q-expansion-item>
  </q-list>
</template>

<script>
export default {
  data() {
    return {
      admin: true,
      link: "inbox",
      group: 'admin'
    };
  },
  created() {
    const user = JSON.parse(localStorage.getItem("user"));
    this.$axios.get("group").then(response => {
      const result = response.data.reduce(
        ({ _id, group }) => _id === user.data.group_id && this.group === group
      );
      this.admin = result;
    });
  }
};
</script>

<style lang="scss">
.menu {
  color: $accent;
}

.menu-link {
  color: $primary;
  background-color: $secondary;
  font-size: 1.2rem;
  box-shadow: 0 6px 12px rgba(30, 60, 90, 0.2);
  transform: scale(1);
}
</style>
