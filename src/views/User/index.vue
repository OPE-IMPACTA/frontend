<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-11">
      <q-page-container class="q-ml-xl">
        <router-view/>
      </q-page-container>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'index'
}
</script>
