<template>
  <div class="el-width" v-if="alias == aliasAction">
    <q-input type="text"
             label="Nome do elemento"
             class="q-ma-sm" lazy-rules
             v-model="elementName"
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
  name: "submit",
  props: ['alias'],
  data() {
    return {
      aliasAction: 'addActionSubmit',
      elementName: ''
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
        submit: { type: '', field: this.elementName }
      };
    });
  }
}
</script>

<style scoped>

</style>
