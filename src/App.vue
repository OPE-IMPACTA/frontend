<template>
  <div id="q-app">
    <transition mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>
<script>

export default {
  computed: {
    namePath () {
      return this.$route.name
    }
  },
  watch: {
    namePath (val) {
      const token = window.localStorage.getItem('token')
      if (val === 'Login' && token) {
        this.$router.push({ name: 'Home' })
        return
      }
      if (this.$route.meta.hasAuth) {
        if (!token) {
          this.$router.push({ name: 'Login' })
        }
      }
    }
  }
}
</script>
