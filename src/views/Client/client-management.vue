<template>
  <div>
    <q-item items-center>
      <q-item-section>
        <q-input
          outlined
          v-model="newEditItem.name"
          label="Nome completo"
          type="text"
          color="orange"
          :rules="emptyField('Nome obrigatório')"/>
      </q-item-section>
    </q-item>
    <q-item items-center>
      <q-item-section>
        <q-input
          outlined
          v-model="newEditItem.email"
          label="Email"
          type="email"
          color="orange"
          :rules="email()"/>
      </q-item-section>
    </q-item>
    <q-item items-center>
      <q-item-section>
        <q-input
          outlined
          v-model="newEditItem.cnpj"
          label="Cnpj"
          type="text"
          color="orange"
          :rules="emptyFieldAndLength('CNPJ inválido', 17)"
          :mask="'##.###.###/####-##'"
        />
      </q-item-section>
    </q-item>
    <q-item items-center>
      <q-item-section>
        <q-input
          outlined
          v-model="newEditItem.company"
          label="Empresa"
          type="text"
          color="orange"
          :rules="emptyField('Empresa obrigatório')"
        />
      </q-item-section>
    </q-item>
    <q-item items-center>
      <q-item-section>
        <q-input
          outlined
          v-model="newEditItem.department"
          label="Departamento"
          type="text"
          color="orange"
          :rules="emptyField('Departamento obrigatório')"
        />
      </q-item-section>
    </q-item>
    <q-item items-center>
      <q-item-section>
        <q-input
          outlined
          v-model="newEditItem.phone"
          label="Telefone"
          type="text"
          color="orange"
          :rules="emptyFieldAndLength('Telefone inválido', 15)"
          :mask="'(##) #####-####'"
        />
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import { emptyField, email, emptyFieldAndLength } from 'src/utils/rules-fields'

export default {
  name: 'ClientManagement',
  props: {
    editItem: {}
  },
  data () {
    return {
      newEditItem: this.editItem,
      emptyField,
      email,
      emptyFieldAndLength
    }
  }
}
</script>
