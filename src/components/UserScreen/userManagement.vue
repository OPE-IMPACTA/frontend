<template>
  <div>
    <q-item>
      <q-item-section>
        <q-input outlined v-model="editItem.name" type="text" label="Nome completo" lazy-rules :rules="[ v => !!v || 'Nome obrigatório']"/>
      </q-item-section>
    </q-item>
    <q-item items-center>
      <q-item-section>
        <q-input outlined v-model="editItem.email" label="Email" type="email" lazy-rules
                 :rules="emailRules" />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select outlined  v-model="editItem.group" :options="groups" label="Grupo" />
      </q-item-section>
    </q-item>
    <q-item class="col-md-12 justify-center">
      <div class="col-md-5">
        <q-input bottom-slots v-model="editItem.password" name="password" id="password" :type="visibilityPass" label="Senha" class="q-ma-sm" lazy-rules
                 :rules="passwordRules">
          <template v-slot:prepend>
            <q-icon name="vpn_key" />
          </template>
          <template v-slot:after>
            <!-- shows and hides the password -->
            <q-btn flat @click="showPassword()" v-if="visibilityPass == 'password'" color="black" icon="fas fa-eye" />
            <q-btn flat @click="hidePassword()" v-if="visibilityPass == 'text'" color="black" icon="fas fa-eye-slash" />
          </template>
        </q-input>
      </div>
      <div class="col-md-5">
        <q-input v-model="editItem.confirmPassword" name="confirmPassword" id="confirmPassword" :type="visibilityConfirmPass" label="Confirmar Senha" class="q-ma-sm" lazy-rules
                 :rules="confirmPasswordRules">
          <template v-slot:prepend>
            <q-icon name="vpn_key" />
          </template>
          <template v-slot:after>
            <!-- shows and hides the password -->
            <q-btn flat @click="showConfirmPassword()" v-if="visibilityConfirmPass == 'password'" color="black" icon="fas fa-eye" />
            <q-btn flat @click="hideConfirmPassword()" v-if="visibilityConfirmPass == 'text'" color="black" icon="fas fa-eye-slash" />
          </template>
        </q-input>
      </div>
    </q-item>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
const defaultItem = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  group_id: ''
}

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

export default defineComponent({
  props: {
    show_form: Boolean,
    editItem: {},
    passwordRules: null,
    confirmPasswordRules: null
  },
  name: 'userManagement',
  data () {
    return {
      emailRules: [
        v => !!v || 'Email é obrigatório',
        v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Email Inválido'
      ],
      password: '',
      confirmPassword: '',
      visibilityPass: 'password',
      visibilityConfirmPass: 'password',
      groups: [],
      group: ''
    }
  },
  mounted () {
    this.confirmPasswordRules.push(v => v === this.editItem.password || 'A senha é diferente, repita a senha')
    if (typeof this.$axios.defaults.headers.common.Authorization === 'undefined' || this.$axios.defaults.headers.common.Authorization === '') {
      this.$router.push({ path: '/' })
    }

    this.$axios.get('/group').then((response) => {
      response.data.forEach((item) => {
        this.groups.push({value: item._id, label: item.group})
      })
    }).catch(() => {
      this.$swal({
        title: 'Erro ao buscar grupos!',
        text: 'Entre em contato com o suporte',
        icon: 'error',
        showConfirmButton: true
      })
    })
  },
  methods: {

    showPassword() {
      this.visibilityPass = 'text';
    },
    hidePassword() {
      this.visibilityPass = 'password';
    },

    showConfirmPassword() {
      this.visibilityConfirmPass = 'text';
    },
    hideConfirmPassword() {
      this.visibilityConfirmPass = 'password';
    },

    close (){
      setTimeout(() => {
        this.editItem = Object.assign({}, this.defaultItem)
        this.resetForm();
        this.editedIndex = -1
        this.$emit('hide_create_user', { show: false, reset: false });
      }, 300)
    },

    resetForm () {
      defaultItem.name = '';
      defaultItem.email = '';
      defaultItem.password = '';
      defaultItem.confirmPassword = '';
      defaultItem.group_id.value = '';
    }
  }
});
</script>
