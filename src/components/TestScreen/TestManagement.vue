<template>
  <div class="col-lg-12 col-sm-12 col-md-9">
    <h5 align="center">Preencha os dados</h5>
    <div class="q-pa-md">
      <q-stepper
        flat
        bordered
        v-model="step"
        ref="stepper"
        :color="$q.dark.isActive ? 'white' : 'primary'"
        animated
      >
        <q-step
          :name="1"
          title="Preencha os dados básicos"
          :error="validForm"
          :error-color="'red'"
          :color="$q.dark.isActive ? 'white' : 'primary'"
          :done="step > 1"
        >

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-card flat bordered ref="step1">
              <q-card-section>
                <div class="text-h6" align="center">Dados Básicos</div>
                <hr>
              </q-card-section>
              <q-card-section class="row">
                <div class="col-md-6 col-sm-6">
                  <q-input v-model="editItem.title" ref="title" name="tag" id="title" type="text" label="Titulo" class="q-ma-sm"
                           lazy-rules
                           :rules="[ val => val && val.length > 0 ||  'Titulo do teste']">
                    <template v-slot:prepend>
                      <q-icon name="tag"/>
                    </template>
                  </q-input>
                </div>
                <div class="col-md-6 col-sm-6">
                  <q-input v-model="editItem.project" ref="project" name="project" id="project" type="text" label="Projeto"
                           class="q-ma-sm"
                           lazy-rules
                           :rules="[ val => val && val.length > 0 || 'Qual o projeto ?']">
                    <template v-slot:prepend>
                      <q-icon name="work"/>
                    </template>
                  </q-input>
                </div>
              </q-card-section>
              <q-card-section class="row">
                <div class="col-md-6 col-sm-6">
                  <q-input v-model="editItem.description" ref="description" v-on:keyup="countdown" maxlength="100" name="description" id="description" type="text" label="Descrição"
                           class="q-ma-sm"
                           lazy-rules
                           :rules="[ val => val && val.length > 0 ||  'Descrição']">
                    <template v-slot:prepend>
                      <q-icon name="description"/>
                    </template>
                    <template v-slot:after>
                      <span v-bind:class="{'text-red': getLimitDesc }" style="font-size: 12px"> {{remainingCount}} / 100</span>
                    </template>
                  </q-input>
                </div>
                <div class="col-md-6">
                  <q-input v-model="editItem.url" name="url" ref="url" id="url" type="url" label="Endereço" class="q-ma-sm"
                           lazy-rules
                           :rules="[ val => val && val.length > 0 || 'Qual é o endereço do teste?']">
                    <template v-slot:prepend>
                      <q-icon name="double_arrow"/>
                    </template>
                  </q-input>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-step>

        <q-step
          :name="2"
          title="Adicionar ações de teste"
          caption="Elementos"
          icon="fas fa-stream"
          :color="$q.dark.isActive ? 'white' : 'primary'"
          :done="step > 1"
        >
          <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-card bordered>
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
                    :content-style="$q.dark.isActive ? contentStyleDark : contentStyle"
                    :content-active-style="contentActiveStyle"
                    style="height: 400px; max-width: 700px;"
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
                    :content-style="$q.dark.isActive ? contentStyleDark : contentStyle"
                    :content-active-style="contentActiveStyle"
                    style="height: 400px; max-width: 600px;"
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
        </q-step>

        <template v-slot:navigation>
          <q-stepper-navigation align="center">
            <q-btn v-if="step !== 2" @click="form1Validation()" icon="fas fa-angle-right" color="primary" label="Continuar" />
            <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" icon="fas fa-angle-left" label="Voltar" class="q-ml-sm" />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </div>
  </div>
</template>
<script>

import ActionsTest from 'components/Actions/ActionsTest'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'TestManagement',
  components: {
    ActionsTest
  },
  props: {
    editItem: {}
  },

  data () {
    return {
      step: 1,
      validForm: false,
      minCount: 0,
      remainingCount: 100,
      getLimitDesc: false,
      contentStyle: {
        backgroundColor: 'rgba(0,0,0,0.02)',
        color: '#555'
      },

      contentStyleDark: {
        backgroundColor: 'rgb(255,255,255)',
        color: '#000000'
      },

      contentActiveStyle: {
        backgroundColor: '#eee',
        color: 'black'
      },

      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#000000',
        width: '5px',
        opacity: 0.75
      },
      editField: [],
      prompt: false,
      newValue: '',
      operations: []
    }
  },

  created () {
    if(this.editItem.description.length == this.minCount) {
      this.remainingCount = this.minCount;
    }
    this.$channelEvents.$on(this.$constantsEvents.ADD_OPERATION_QUEUE, (value) => {
      this.editItem.operations.push(value)
    })
  },

  methods: {
    countdown: function() {
      this.remainingCount = this.minCount + this.editItem.description.length;
      this.getLimitDesc = this.remainingCount === 100;
    },

    form1Validation () {
      this.$refs.title.validate()
      this.$refs.project.validate()
      this.$refs.url.validate()
      this.$refs.description.validate()

      if (this.$refs.title.hasError || this.$refs.project.hasError || this.$refs.url.hasError || this.$refs.description.hasError) {
        this.validForm = true
      } else {
        this.validForm = false
      }

      if (!this.validForm) {
        this.$refs.stepper.next()
      }
    },

    deleteItemArray: function (index) {
      this.$swal({
        title: 'Deletar esse elemento ?',
        text: 'Se salvar não seŕa possível reverter a operação',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Deletar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.editItem.operations.splice(index, 1)
        }
      }).catch((e) => {
        this.$swal({
          icon: 'error',
          title: 'Ops.. algo deu errado!',
          text: 'tente novamente, se persistir entre em contato com o suporte!',
          showConfirmButton: true
        })
      })
    },

    editItemArray: function () {
      if (this.editField.key.length == 1) {
        this.editItem.operations[this.editField.index]
          [Object.keys(this.editItem.operations[this.editField.index])] = this.editField.value
      } else {
        this.editItem.operations[this.editField.index][this.editField.key[1]]
          [this.editField.key[0]] = this.editField.value
      }
      this.editField = []
    },

    show (index, indexItem = '') {
      this.prompt = true

      if (indexItem == '') {
        this.editField.value = Object.values(this.editItem.operations[index]).toString()
        this.editField.key = Object.keys(this.editItem.operations[index])
        this.editField.index = index
      } else {
        this.editField.value = Object.values(this.editItem.operations[index])[0][indexItem[0]]
        this.editField.key = indexItem
        this.editField.index = index
      }
    },

    hide () {
      this.prompt = false
    }
  }
})
</script>
