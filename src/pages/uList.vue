<template>
  <q-page class="row justify-evenly">
    <div class="col-lg-12 col-md-12">
      <userList> </userList>
    </div>
  </q-page>
</template>

<script lang="ts">
import userList from "../components/UserScreen/userList.vue";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "Home",
  components: { userList },

  data() {
    return {
      email: "",
      password: "",
      error: false
    };
  },
  mounted: function() {
    if (
      typeof this.$axios.defaults.headers.common["Authorization"] ==
        "undefined" ||
      this.$axios.defaults.headers.common["Authorization"] === ""
    ) {
      this.$router.push({ path: "/" });
    }
  },
  methods: {}
});
</script>
