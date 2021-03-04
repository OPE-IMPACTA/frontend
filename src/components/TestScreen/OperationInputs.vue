<template>
  <q-field label="Que tipo de operação você quer realizar?" stack-label>
    <template v-slot:prepend>
      <q-icon name="priority_high" />
    </template>
    <q-select
      style="width: 100%"
      type="radio"
      color="primary"
      v-model="operationInput"
      :options="Options"
      v-on:input="clicked"
    />
  </q-field>
</template>

<script>

export default {

  methods:{
    clicked: function(value) {
      this.$emit('clicked', value)
    }
  },

  data() {
    return {
      operationInput: '',
      accepted: [],
      Options: [
        'Click',
        'Wait',
        'Fill',
        'Action'
      ]
    }
  }

}
</script>
