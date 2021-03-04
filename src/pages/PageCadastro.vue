<template>
  <q-page class="row justify-evenly">
    <div class="container col-9">
      <TestRegister></TestRegister>
    </div>
  </q-page>

</template>

<script lang="ts">
import MenuLateral from 'components/MenuLateral.vue'
import TestRegister from 'components/TestScreen/TestRegister.vue'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Home',
  components: { MenuLateral, TestRegister }
})
</script>
