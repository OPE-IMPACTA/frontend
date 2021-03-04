<template>
  <q-form @submit="onSubmit" class="form" ref="testsForm">
    <div class="row">
      <h3>Cadastro de testes</h3>
    </div>
    <div class="row">
      <div class="col-lg-12 col-sm-12 col-md-9">
        <h5>Preencha os dados</h5>
        <q-input v-model="title" name="tag" id="title" type="text" label="Titulo" class="q-ma-sm" lazy-rules
                 :rules="[ val => val && val.length > 0 || 'Titulo do teste']">
          <template v-slot:prepend>
            <q-icon name="tag" />
          </template>
        </q-input>
        <q-input v-model="project" name="project" id="project" type="text" label="Projeto" class="q-ma-sm" lazy-rules
                 :rules="[ val => val && val.length > 0 || 'Titulo do teste']">
          <template v-slot:prepend>
            <q-icon name="work" />
          </template>
        </q-input>
        <q-input v-model="description" name="description" id="description" type="text" label="Descrição" class="q-ma-sm" lazy-rules
                 :rules="[ val => val && val.length > 0 || 'Digite a descrição do teste']">
          <template v-slot:prepend>
            <q-icon name="description" />
          </template>
        </q-input>
        <q-input v-model="url" name="url" id="url" type="text" label="Endereço" class="q-ma-sm" lazy-rules
                 :rules="[ val => val && val.length > 0 || 'Qual é o endereço do teste?']">
          <template v-slot:prepend>
            <q-icon name="double_arrow" />
          </template>
        </q-input>

        <ActionsTest></ActionsTest>
      </div>
    </div>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Insira o novo valor</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input v-model="editField['value']" autofocus @keyup.enter="prompt = false" />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Fechar" @click="hide" v-close-popup />
          <q-btn flat label="Ok" @click="editItemArray" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="row">
      <div class="col-lg-12 col-sm-12 col-md-5">
        <h5>Código gerado:</h5>
        <pre>{{$data.operations}}</pre>
        <hr>
      </div>
      <div class="col-lg-12 col-sm-12 col-md-5">
        <h5>Elementos de teste:</h5>
        <div v-for="(item, index) in operations" :key="index" class="div-content">
          <div v-for="(values, name) in item">
            <div v-if="typeof values !== 'string'" class="row">
              <span class="label">{{name}}:</span>  <br/>
              <div v-for="(value, key) in values" class="item">
                <span class="sub-label">{{key}}</span><span class="content">{{value}}</span>
                <q-btn round @click="show(index, [key, name])" type="button" size="sm" color="primary" icon="edit"/><br/>
              </div>
              <div class="btn-rnd">
                <q-btn @click="deleteItemArray(index)" type="button" size="sm" color="primary" icon="delete" label="Apagar Operação" />
              </div>
            </div>
            <div v-else>
              <div>
                <span class="label">{{name}}:</span> <span class="content">{{values}}</span>
                <q-btn round @click="show(index)" type="button" size="sm" color="primary" icon="edit"/>
              </div>
              <div class="btn-rnd">
                <q-btn @click="deleteItemArray(index)" type="button" size="sm" color="primary" icon="delete" label="Apagar Operação" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-btn label="Salvar" type="submit" class="q-ma-sm" color="primary"/>
  </q-form>
</template>
<script>
import {
  Loading,
  QSpinnerPie
} from 'quasar'

import ActionsTest from "components/Actions/ActionsTest";

export default {
  name: "ComponentTestRegister",
  components: {
    ActionsTest
  },

  data() {
    return {
      title: '',
      project: '',
      description: '',
      url: '',
      editField:[],
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
      this.$axios.post('/tests', {
        title: this.title,
        project: this.project,
        description: this.description,
        url: this.url,
        operations: this.operations
      }).then((response) => {
        this.$router.push({ path: '/home' })
      }).catch((e) => {
        alert('Teste não cadastrado')
        return false
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

    hide(){
      this.prompt = false
    }
  }
}
</script>
