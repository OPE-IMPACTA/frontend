<template>
  <div class="fullscreen bg-resetPassword text-black text-center q-pa-md flex flex-center">
    <q-card name="resetPassword" style="border-radius: 12px" v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}">
      <q-card-section>
        <q-icon name="lock" class="text-yellow-7" style="font-size: 5rem;" />
        <q-card-title>
          <div class="text-h6 text-center ">
            Resetar Senha
          </div>
        </q-card-title>
      </q-card-section>
      <q-card-section class="q-pa-md">
        <template>
          <q-form @submit="onSubmit" @reset="onReset" class="form" ref="passForm">
            <div class="q-pa-md q-gutter-md">
              <q-input bottom-slots v-model="password" name="password" id="password" :type="visibilityPass" label="Nova Senha" class="q-ma-sm" lazy-rules
                       :rules="[ val => val && val.length > 0 || 'Digite a nova senha']">
                <template v-slot:prepend>
                  <q-icon name="vpn_key" />
                </template>
                <template v-slot:after>
                  <!-- shows and hides the password -->
                  <q-btn flat @click="showPassword()" v-if="visibilityPass == 'password'" color="black" icon="fas fa-eye" />
                  <q-btn flat @click="hidePassword()" v-if="visibilityPass == 'text'" color="black" icon="fas fa-eye-slash" />
                </template>
              </q-input>

              <q-input v-model="confirmPassword" name="confirmPassword" id="confirmPassword" :type="visibilityConfirmPass" label="Confirmar Senha" class="q-ma-sm" lazy-rules
                       :rules="[ val => val && val.length > 0 && val === this.password || 'Repita a nova senha']">
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
            <div class="q-pa-md q-gutter-md">
              <q-btn label="Confirmar" type="submit" class="q-ma-md" color="primary"/>
              <q-btn label="Limpar" type="reset" color="primary" flat class="q-ma-md"/>
            </div>
            <div class="q-pa-md q-gutter-md">
              <q-btn label="Voltar para o Login" to="/" color="grey" flat/>
            </div>
          </q-form>
        </template>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import {Loading, QSpinnerPie} from "quasar";
export default defineComponent({
  name: 'ResetPassword',
  token: '',

  data() {
    return {
      password: '',
      confirmPassword: '',
      visibilityPass: 'password',
      visibilityConfirmPass: 'password',
    }
  },
  mounted: function () {
    this.token = this.$router.currentRoute.query.token ? this.$router.currentRoute.query.token : '';

    if (typeof this.token == 'undefined' || this.token === '') {
      this.$router.push({ path: '/' })
    }
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

    onSubmit () {
      Loading.show({
        spinner: QSpinnerPie,
        spinnerColor: 'yellow',
        message: 'Aguarde, conectando ...',
        delay: 400
        // other props
      })

      this.timer = setTimeout(() => {
        this.resetPassword()
        this.timer = void 0
      }, 3000)
    },

    resetPassword () {
      this.$axios.post('auth/reset_password/'+this.token,
        {
            password: this.password,
            confirmPassword: this.confirmPassword
          }
        ).then((response) => {
          let emailUser = response.data.email;
          this.$router.push({ name: 'login', params: { email: emailUser, password: this.password} })
          this.$swal({
            title:'Pronto!',
            text: 'Senha resetada com sucesso.',
            icon: 'success'
          })
        }).catch((e) => {
          Loading.hide();
          this.$q.notify({
            message: 'Erro ao resetar senha',
            position: 'top',
            color: 'negative',
            icon: 'warning'
          })
        })
      Loading.hide()
  },

    onReset () {
      this.confirmPassword = null
      this.password = null
      this.$refs.passForm.resetValidation()
    },
  }
})
</script>

<style>

.bg-resetPassword {
  background-image: linear-gradient(135deg, #55a846 5%, #7bbf8b 100%);
}
</style>
