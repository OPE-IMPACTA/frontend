<template>
  <q-list bordered class="rounded-borders">
    <div class="q-toolbar row no-wrap items-center">
      <div class="col-md-12  row flex-center overflow-hidden">
          <img src="../assets/logoE2E.png" style="width: 50%; padding: 10px">
      </div>
    </div>
    <q-item-label
      header
      class="text-white"
    >
      Navegação
    </q-item-label>
    <q-item
      to="/home"
      exact
      active-class="tab-active"
      class="q-ma-sm navigation-item"
      clickable
      v-ripple
    >
      <q-item-section avatar>
        <q-icon name="fas fa-home" />
      </q-item-section>

      <q-item-section>
        Home
      </q-item-section>
    </q-item>

<!--    expansive tests -->
    <q-expansion-item
      icon="far fa-chart-bar"
      class="q-ma-sm navigation-item"
      label="Gerenciar Testes"
    >
      <q-item
        class="q-ml-xl"
        to="/testes/gerenciar"
        active-class="tab-active"
        clickable
      >
        <q-item-section avatar>
          <i class="fas fa-list-ul"></i>
        </q-item-section>

        <q-item-section>
          <q-item-label>Lista</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        class="q-ml-xl"
        clickable
        active-class="tab-active"
        to="/testes/cadastrar"
      >
        <q-item-section avatar>
          <q-icon name="add" />
        </q-item-section>

        <q-item-section>
          Cadastrar
        </q-item-section>
      </q-item>
    </q-expansion-item>

    <q-item
      class="q-ma-sm navigation-item"
      to="/usuarios/gerenciar"
      active-class="tab-active"
      clickable
    >
      <q-item-section avatar>
        <i class="fas fa-users"></i>
      </q-item-section>

      <q-item-section>
        <q-item-label>Gerenciar Usuários</q-item-label>
      </q-item-section>
    </q-item>

    <q-item
      to="/ReportTests"
      exact
      active-class="tab-active"
      class="q-ma-sm navigation-item"
      clickable
      v-ripple
    >
      <q-item-section avatar>
        <i class="fas fa-clipboard-list fa-2x"></i>
      </q-item-section>

      <q-item-section>
        Relatório
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  data () {
    return {
      test: false,
      user: false
    }
  },
}
</script>
