<template>
  <div class="el-width" v-if="alias == aliasAction">
    <q-input type="text"
             label="Valor da operação de wait"
             class="q-ma-sm"
             v-model="elementName"
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
  name: "wait",
  props: ['alias'],
  data() {
    return {
      aliasAction: 'addActionWait',
      elementName: ''
    }
  },
  watch: {
    alias: function(newValue, oldValue) {
      Resource.Operation.alias = newValue;
    }
  },
  created() {
    Resource.Operation.addOperationQueue(this, () => {
      return {
        wait: { type: '', field: this.elementName }
      };
    });
  }
}
</script>

<style scoped>

</style>
