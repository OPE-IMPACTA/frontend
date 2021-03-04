<template>
  <q-form @submit="onSubmit" class="form" ref="testsForm">
    <TestManager :editItem="editItem"></TestManager>
    <div class="" align="right">
      <q-btn @click="backToList" class="q-ma-md" label="Cancelar"></q-btn>
      <q-btn label="Salvar" type="submit" class="q-ma-md" color="primary"/>
    </div>
  </q-form>
</template>

<script>
import TestManager from "./TestManager";

export default {
  name: "TestUpdate",
  components: {TestManager},
  props: {
    editItem: [],
    show_dialog: Boolean
  },

  data() {
    return {
      step: 1,
      // editedIndex: -1,
      // editedItem: defaultItem,
      // mode: "list",
      // currencyColumns: this.columns,
      // currencyData: this.data,
      title: '',
      project: '',
      description: '',
      url: '',
      editField: [],
      prompt: false,
      newValue: '',
      operations: []
    }
  },
  methods: {
    backToList() {
      this.$swal({
        title: 'Atenção!!',
        text: "Cencelar a edição ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4ed630',
        cancelButtonColor: '#c1c1c1',
        cancelButtonText: 'Voltar',
        confirmButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.$emit('updateShowEdit');
        }
      })
    },

    onSubmit() {
      const token = this.$axios.defaults.headers.common['Authorization'];
      const config = {
        headers: {Authorization: token}
      };

      let testId = this.editItem._id

      this.$swal({
        title: 'Salvar edição ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Salvar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.$axios.put('/tests/' + testId,
      {
              title: this.editItem.title,
              project: this.editItem.project,
              description: this.editItem.description,
              url: this.editItem.url,
              operations: this.editItem.operations
            },
            config
          ).then((response) => {
            this.$swal({
              title: 'Concluido',
              text: "Edição efetuada com sucesso !",
              icon: 'warning',
              confirmButtonColor: '#4ed630',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.isConfirmed) {
                this.$emit('updateShowEdit', this.show_dialog);
              }
            })
            // this.$router.push({ path: '/home' })
          }).catch((e) => {
            alert('Teste não cadastrado')
            return false
          })
        }
      })
    }
  }
}
</script>
