<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-md-12">
      <q-form @submit="onSubmit" class="form" ref="testsForm">
        <TestManagement :editItem="editItem"></TestManagement>
        <div class="" align="right">
          <q-btn @click="backToList" class="q-ma-md" label="Cancelar"></q-btn>
          <q-btn label="Salvar" type="submit" class="q-ma-md" color="primary"/>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import TestManagement from "../../components/TestScreen/TestManagement";

export default {
  name: "TestUpdate",
  components: { TestManagement },
  props: {
    editItem: {},
    show_dialog: Boolean
  },

  data() {
    return {
      step: 1,
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
  created() {
    this.operations = []
  },

  methods: {
    backToList() {
      this.$swal({
        title: 'Atenção!!',
        text: "Cancelar a edição ?",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Voltar',
        confirmButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          let itemUpdate = {
            editItem: {},
            hide: false
          }
          this.$channelEvents.$emit(this.$constantsEvents.SHOW_UPDATE_TEST, itemUpdate);
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
              title: 'Concluído',
              text: "Edição efetuada com sucesso !",
              icon: 'success',
              confirmButtonColor: '#4ed630',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.isConfirmed) {
                let itemUpdate = {
                  editItem: this.editedItem,
                  hide: false
                }
                this.$channelEvents.$emit(this.$constantsEvents.SHOW_UPDATE_TEST, itemUpdate);
              }
            })
            // this.$router.push({ path: '/home' })
          }).catch((e) => {

            if(e.response.status === 400) {
              this.$swal({
                title: 'Atenção !',
                html: e.response.data.errors[0].msg || 'Erro na tentativa de atualização',
                icon: 'warning',
                showConfirmButton: true
              });
            } else {
              this.$swal({
                title: 'Erro',
                html: 'Erro na tentativa de atualização',
                icon: 'error',
                showConfirmButton: true
              });
            }

            return false
          })
        }
      })
    }
  }
}
</script>
