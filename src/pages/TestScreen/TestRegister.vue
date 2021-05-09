<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-12">
      <q-form @submit="onSubmit" class="form" ref="testsCreateForm">
        <TestManagement :editItem="editItem"></TestManagement>
        <div class="" align="right">
          <q-btn @click="cancelAdd" class="q-ma-md" label="Cancelar"></q-btn>
          <q-btn label="Salvar" type="submit" class="q-ma-md" color="primary"/>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import ActionsTest from "components/Actions/ActionsTest";
import TestManagement from "components/TestScreen/TestManagement";

const defaultItem = {
  title: '' ,
  project: '' ,
  description: '' ,
  url: '',
  operations: []
}

export default {
  name: "TestRegister",
  components: {
    ActionsTest,
    TestManagement
  },
  data() {
    return {
      editField:[],
      editItem: defaultItem,
      prompt: false,
      newValue: '',
      operations: []
    }
  },

  created() {
    this.$channelEvents.$on(this.$constantsEvents.ADD_OPERATION_QUEUE, (value) => {
      this.operations.push(value);
    });
  },

  methods: {
    onSubmit () {
      let dataSubmit = this.editItem;

      this.$swal({
        title: 'Cadastrar Teste ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Cadastrar Teste',
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.$axios.post('/tests', dataSubmit)
            .then(response => {
              if (!response.statusText === 'OK') {
                throw new Error(response.statusText)
              }
              this.$swal({
                title: 'Cenário de teste cadastrado com sucesso !',
                icon: 'success',
                showConfirmButton: true
              })
              this.resetForm();
              this.$channelEvents.$emit(this.$constantsEvents.SHOW_CREATE_TEST, false);
            })
            .catch(error => {
              this.$swal({
                title: 'Erro ao cadastrar !',
                text: 'Entre em contato com o suporte',
                icon: 'error',
                showConfirmButton: true
              })
            })
        }
      })
    },

    deleteItemArray: function (index) {
      this.operations.splice(index, 1);
    },

    editItemArray: function() {

      if (this.editField['key'].length == 1) {
        this.operations[this.editField['index']]
          [Object.keys(this.operations[this.editField['index']])] = this.editField['value']

      } else {
        this.operations[this.editField['index']][this.editField['key'][1]]
          [this.editField['key'][0]] = this.editField['value']
      }
      this.editField = Array()
    },

    show(index, indexItem = '') {
      this.prompt = true

      if (indexItem == '') {
        this.editField['value'] = Object.values(this.operations[index]).toString();
        this.editField['key'] = Object.keys(this.operations[index])
        this.editField['index'] = index
      } else {
        this.editField['value'] = Object.values(this.operations[index])[0][indexItem[0]]
        this.editField['key'] = indexItem
        this.editField['index'] = index
      }
    },

    cancelAdd () {
      this.$swal({
        title: 'Cancelar cadastro ?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Voltar',
        confirmButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.resetForm();
          this.$channelEvents.$emit(this.$constantsEvents.SHOW_CREATE_TEST, false);
        }
      })
    },

    resetForm () {
      defaultItem.title = '';
      defaultItem.project = '';
      defaultItem.description = '';
      defaultItem.url = '';
      defaultItem.operations = [];
      this.operations = []
    },

    hide(){
      this.prompt = false
    }
  }
}
</script>
