<template>
  <div class="el-width" v-if="alias == aliasAction">
    <q-input type="text"
             label="Insira um texto ou uma expressão regular válida"
             class="q-ma-sm"
             v-model="elementValue"
             lazy-rules
    >
      <template v-slot:prepend>
        <q-icon name="description" />
      </template>
    </q-input>
  </div>
</template>

<script>
const Resource = require('./resource');

export default {
  name: "assert",
  props: ['alias'],
  data() {
    return {
      aliasAction: 'addActionAssert',
      elementValue: ''
    }
  },
  watch: {
    alias: function(newValue, oldValue) {
      Resource.Operation.alias = newValue;
    }
  },
  created() {
    Resource.Operation.alias = this.alias;
    Resource.Operation.addOperationQueue(this, () => {
      return {
        assert: { type: '', value: this.elementValue }
      };
    });
  }
}
</script>

<style scoped>

</style>
