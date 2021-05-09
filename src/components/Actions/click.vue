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
  name: "click",
  props: ['alias'],
  data() {
    return {
      aliasAction: 'addActionClick',
      elementName: ''
    }
  },
  watch: {
    alias: function(newValue, oldValue) {
      Resource.Operation.alias = newValue;
    }
  },
  created () {
    Resource.Operation.alias = this.alias;
    Resource.Operation.addOperationQueue(this, () => {
      return {
        click: { type: '', field: this.elementName }
      };
    });
  }
}
</script>

<style scoped>

</style>
