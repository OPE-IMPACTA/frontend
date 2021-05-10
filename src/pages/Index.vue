<template>
  <q-page class="row items-center justify-evenly">
    <Login
      title="Tela Login"
    ></Login>
  </q-page>
</template>

<script lang="ts">
import Login from '../components/Login.vue'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'PageIndex',
  components: { Login }
})
</script>
