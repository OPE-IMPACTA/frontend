<template>
  <div class="col-lg-12 col-sm-12 col-md-9">
      <h5 align="center">Preencha os dados</h5>
      <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6" align="center">Dados Básicos</div>
              <hr>
            </q-card-section>
            <q-card-section>
              <q-input v-model="editItem.title" name="tag" id="title" type="text" label="Titulo" class="q-ma-sm"
                       lazy-rules
                       :rules="[ val => val && val.length > 0 || 'Titulo do teste']">
                <template v-slot:prepend>
                  <q-icon name="tag"/>
                </template>
              </q-input>
              <q-input v-model="editItem.project" name="project" id="project" type="text" label="Projeto"
                       class="q-ma-sm"
                       lazy-rules
                       :rules="[ val => val && val.length > 0 || 'Titulo do teste']">
                <template v-slot:prepend>
                  <q-icon name="work"/>
                </template>
              </q-input>
              <q-input v-model="editItem.description" name="description" id="description" type="text" label="Descrição"
                       class="q-ma-sm" lazy-rules
                       :rules="[ val => val && val.length > 0 || 'Digite a descrição do teste']">
                <template v-slot:prepend>
                  <q-icon name="description"/>
                </template>
              </q-input>
              <q-input v-model="editItem.url" name="url" id="url" type="text" label="Endereço" class="q-ma-sm"
                       lazy-rules
                       :rules="[ val => val && val.length > 0 || 'Qual é o endereço do teste?']">
                <template v-slot:prepend>
                  <q-icon name="double_arrow"/>
                </template>
              </q-input>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6" align="center">Ações do Teste</div>
              <hr>
            </q-card-section>
            <q-card-section>
              <ActionsTest :operations="operations"></ActionsTest>
            </q-card-section>
          </q-card>
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

      <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-card flat bordered class>
            <q-card-section>
              <div class="text-h6" align="center">Código gerado:</div>
              <hr>
            </q-card-section>
              <q-card-section>
                <q-scroll-area
                  :thumb-style="thumbStyle"
                  :content-style="contentStyle"
                  :content-active-style="contentActiveStyle"
                  style="height: 500px; max-width: 500px;"
                >
                <pre>{{ editItem.operations }}</pre>
                <hr>
                </q-scroll-area>
              </q-card-section>
          </q-card>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-card flat bordered class align="center">
            <q-card-section>
              <div class="text-h6" align="center">Elementos de teste:</div>
              <hr>
            </q-card-section>
            <q-card-section>
              <q-scroll-area
                :thumb-style="thumbStyle"
                :content-style="contentStyle"
                :content-active-style="contentActiveStyle"
                style="height: 500px; max-width: 600px;"
              >
                <q-list bordered>
                  <div v-for="(item, index) in editItem.operations" :key="index" class="div-content">
                    <div v-for="(values, name) in item">
                        <div v-if="typeof values !== 'string'" class="row">
                          <q-item v-ripple>
                          <span class="label">{{ name }}:</span>
                            <q-separator spaced />
                          <div v-for="(value, key) in values" class="item">
                            <span class="sub-label">{{ key }}:</span>
                            <span class="content">{{ value }}</span>
                            <q-separator spaced />
                            <q-btn @click="show(index, [key, name])" type="button" size="sm" color="primary" icon="edit"
                                   label=""/>
                          </div>
                          </q-item>
                        </div>
                        <div v-else>
                          <q-item v-ripple>
                            <span class="label">{{ name }}:</span>
                            <q-separator spaced inset="item" />
                            <span class="content">{{ values }}</span>
                            <q-item-section>
                              <q-separator spaced inset="item" />
                            </q-item-section>
                            <q-item-section avatar>
                              <q-btn @click="show(index)" type="button" size="sm" color="primary" icon="edit"/>
                            </q-item-section>
                          </q-item>
                        </div>
                      <q-item v-ripple>
                        <q-item-section>
                          <q-btn @click="deleteItemArray(index)" type="button" size="sm" color="grey" icon="delete"
                                 label="Apagar Operação"/>
                        </q-item-section>
                      </q-item>
                      <q-separator/>
                    </div>
                  </div>
                </q-list>
              </q-scroll-area>
            </q-card-section>
          </q-card>
        </div>
      </div>
  </div>
</template>
<script>

import ActionsTest from "components/Actions/ActionsTest";

export default {
  name: "TestManager",
  components: {
    ActionsTest
  },
  props: {
    editItem: []
  },

  data() {
    return {
      contentStyle: {
        backgroundColor: 'rgba(0,0,0,0.02)',
        color: '#555'
      },

      contentActiveStyle: {
        backgroundColor: '#eee',
        color: 'black'
      },

      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      },
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
    this.$channelEvents.$on(this.$constantsEvents.ADD_OPERATION_QUEUE, (value) => {
      this.editItem.operations.push(value);
    });
  },

  methods: {
    deleteItemArray: function (index) {
      this.$swal({
        title: 'Deletar esse teste ?',
        text: "Se salvar não seŕa possível reverter a operação",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Deletar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.editItem.operations.splice(index, 1);
        }
      }).catch((e) => {
        this.$swal({
          icon: 'error',
          title: 'Ops.. algo deu errado!',
          text: 'tente novamente, se persistir entre em contato com o suporte!',
          showConfirmButton: true,
        })
      })
    },

    editItemArray: function() {

      if (this.editField['key'].length == 1) {
        this.editItem.operations[this.editField['index']]
          [Object.keys(this.editItem.operations[this.editField['index']])] = this.editField['value']

      } else {
        this.editItem.operations[this.editField['index']][this.editField['key'][1]]
          [this.editField['key'][0]] = this.editField['value']
      }
      this.editField = Array()
    },

    show(index, indexItem = '') {
      this.prompt = true

      if (indexItem == '') {
        this.editField['value'] = Object.values(this.editItem.operations[index]).toString();
        this.editField['key'] = Object.keys(this.editItem.operations[index])
        this.editField['index'] = index
      } else {
        this.editField['value'] = Object.values(this.editItem.operations[index])[0][indexItem[0]]
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
