<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <particles/>
        <login/>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>

import Particles from 'components/Particles/particles'
import Login from './login'

export default {
  components: { Particles, Login }
}
</script>
