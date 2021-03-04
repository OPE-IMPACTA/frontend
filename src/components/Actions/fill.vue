<template>
  <div class="el-width" v-if="alias == aliasAction">
    <q-input type="text"
             label="Nome do elemento"
             class="q-ma-sm"
             lazy-rules
             v-model="elementName"
             >
      <template v-slot:prepend>
        <q-icon name="description" />
      </template>
    </q-input>
    <q-input type="text"
             label="Valor da operação"
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
  name: "fill",
  props: ['alias'],
  data() {
    return {
      aliasAction: 'addActionFill',
      elementName: '',
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
        fill: {
          type: '',
          field: this.elementName,
          value: this.elementValue
        }
      };
    });
  }
}
</script>

<style scoped>

</style>
