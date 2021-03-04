<template>
  <div>
    <div class="row">
      <div class="col-lg-6 col-sm-12 col-md-6">
        <q-field label="Que tipo de operação você quer realizar?" stack-label>
          <q-select
              @input="onChooseOperation"
              type="radio"
              style="width: 100%"
              color="primary"
              v-model="operation" :options="options" />
        </q-field>
      </div>

      <div class="col-lg-1 col-md-1"></div>

      <div class="col-lg-5 col-sm-12 col-md-5">
        <q-field label="Que tipo de operação você quer realizar?" stack-label>
          <q-select
              @input="onChooseOperation"
              type="radio"
              style="width: 100%"
              color="primary"
              v-model="typeField" :options="typesField" />
        </q-field>
      </div>
    </div>

    <ActionClickComponent :alias="valueOperation"></ActionClickComponent>
    <ActionWaitComponent :alias="valueOperation"></ActionWaitComponent>
    <ActionFillComponent :alias="valueOperation"></ActionFillComponent>
    <ActionSubmitComponent :alias="valueOperation"></ActionSubmitComponent>

    <q-btn label="Adicionar ação" @click="addOperation" type="button" class="q-ma-sm" color="primary"/>
  </div>
</template>

<script>
let optionsActions = require('./list-actions');
let allImportsActions = require('./allImportActions');

export default {
  name: "ActionsTest",
  components: allImportsActions(),
  data() {
    return {
      typeField: { label: 'ID', value: 'id' },
      operation: optionsActions[0],
      valueOperation: optionsActions[0].value,
      options: optionsActions,
      typesField: [
        { label: 'ID', value: 'id' },
        { label: 'Class', value: 'class' },
        { label: 'Name', value: 'name' },
        { label: 'Link', value: 'link' },
      ]
    }
  },
  methods: {
    onChooseOperation() {
      this.valueOperation = this.operation.value;
    },

    addOperation() {
      this.$channelEvents.$emit(this.$constantsEvents.SEND_COMMAND_ACTION, this.typeField);
    }
  }
}
</script>

<style scoped>

</style>
