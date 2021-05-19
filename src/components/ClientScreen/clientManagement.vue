<template>
  <div>
    <q-item>
      <q-item-section>
        <q-input
          outlined
          v-model="editItem.name"
          type="text"
          label="Nome completo"
          lazy-rules=""
          :rules="[v => !!v || 'Nome obrigatório']"
        />
      </q-item-section>
    </q-item>
    <q-item items-center>
      <q-item-section>
        <q-input
          outlined
          v-model="editItem.email"
          label="Email"
          type="email"
          lazy-rules=""
          :rules="emailRules"
        />
      </q-item-section>
    </q-item>
    <q-item items-center>
      <q-item-section>
        <q-input
          outlined
          v-model="editItem.cnpj"
          label="Cnpj"
          type="text"
          lazy-rules=""
          :rules="cnpjRules"
          :mask="'##.###.###/####-##'"
        />
      </q-item-section>
    </q-item>
    <q-item items-center>
      <q-item-section>
        <q-input
          outlined
          v-model="editItem.company"
          label="Empresa"
          type="text"
          lazy-rules=""
          :rules="companyRules"
        />
      </q-item-section>
    </q-item>
    <q-item items-center>
      <q-item-section>
        <q-input
          outlined
          v-model="editItem.department"
          label="Departamento"
          type="text"
          lazy-rules=""
          :rules="departmentRules"
        />
      </q-item-section>
    </q-item>
    <q-item items-center>
      <q-item-section>
        <q-input
          outlined
          v-model="editItem.phone"
          label="Telefone"
          type="text"
          lazy-rules=""
          :rules="phoneRules"
          :mask="'(##) #####-####'"
        />
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import { VueMaskDirective } from 'v-mask'
import { defineComponent } from '@vue/composition-api'

const defaultItem = {
  name: '',
  email: '',
  cnpj: '',
  company: '',
  department: '',
  phone: ''
}

export default defineComponent({
  props: {
    editItem: {}
  },
  directives: {
    mask: VueMaskDirective
  },
  name: 'clientManagement',
  data () {
    return {
      emailRules: [
        v => !!v || 'Email é obrigatório',
        v =>
          /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || 'Email Inválido'
      ],
      cnpjRules: [
        v => !!v || 'Cnpj é obrigatório',
        v => v.length >= 18 || 'Valor incorreto'
      ],
      companyRules: [v => !!v || 'Empresa é obrigatório'],
      departmentRules: [v => !!v || 'Departamento é obrigatório'],
      phoneRules: [
        v => !!v || 'Telefone é obrigatório',
        v => v.length >= 15 || 'Valor incorreto'
      ]
    }
  },
  mounted () {
    if (
      typeof this.$axios.defaults.headers.common.Authorization ===
        'undefined' ||
      this.$axios.defaults.headers.common.Authorization === ''
    ) {
      void this.$router.push({ path: '/' })
    }
  },
  methods: {
    close () {
      setTimeout(() => {
        this.editItem = Object.assign({}, this.defaultItem)
        this.resetForm()
        this.editedIndex = -1
        this.$emit('hide_create_client', { show: false, reset: false })
      }, 300)
    },

    resetForm () {
      defaultItem.name = ''
      defaultItem.email = ''
      defaultItem.cnpj = ''
      defaultItem.company = ''
      defaultItem.department = ''
      defaultItem.phone = ''
    }
  }
})
</script>
