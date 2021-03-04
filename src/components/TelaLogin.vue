<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}">
          <q-card-section>
            <q-avatar square size="80px" style="background-color: transparent" class="absolute-center">
              <img src="../assets/logoE2E.png">
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                Login
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form @submit="onSubmit" class="form" ref="loginForm">
              <q-input  v-model="email" name="email" id="email" type="email" label="Email" class="q-ma-sm" lazy-rules
                       :rules="[ val => val && val.length > 0 || 'Digite o seu Email']">
                <template v-slot:prepend>
                  <q-icon name="mail" />
                </template>
              </q-input>
              <q-input v-model="password" name="password" id="password" label="Senha" type="password" class="q-ma-sm" lazy-rules
                       :rules="[ val => val && val.length > 0 || 'Digite sua senha']">
                <template v-slot:prepend>
                  <q-icon name="vpn_key" />
                </template>
              </q-input>
              <div class="q-pa-md q-gutter-md">
                <div class="row justify-center">
                  <q-btn label="Entrar" type="submit" color="primary"/>
                </div>
                <div class="row justify-center">
                  <q-btn @click="recuperarSenha()" type="a" flat label="Esqueci a Senha"/>
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import {
  Loading,
  QSpinnerPie
} from 'quasar'

export default {
  data () {
    return {
      email: this.email,
      password: this.password
    }
  },

  methods: {
    onSubmit () {
      let email = this.email
      let password = this.password

      this.$axios.post('auth/login',
          {
            email: email,
            password: password
          }
      ).then((response) => {
        let userJson = JSON.stringify(response.data)
        Loading.hide()
        this.$axios.defaults.headers.common['Authorization'] = `Bearer ${response.headers.authorization}`
        localStorage.setItem('token', response.headers.authorization)
        localStorage.setItem('user', userJson)
        this.$router.push({ path: '/home' })
      }).catch((e) => {
        this.$q.notify({
          message: 'Login Inválido',
          position: 'top',
          color: 'negative',
          icon: 'warning'
        })
        this.onReset()
        return false
      });
    },

    onReset () {
      this.email = null
      this.password = null
      this.$refs.loginForm.resetValidation()
    },

    recuperarSenha () {
      this.$swal({
        title: 'Recuperar Senha',
        html: "Vamos enviar um email para recuperar sua senha!",
        input: 'email',
        validationMessage: 'Digite um email válido',
        inputLabel: "Digite o email cadastrado",
        inputPlaceholder: "Digite seu email",
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
          return fetch(`//api.github.com/users/${login}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(response.statusText)
              }
              return response.json()
            })
            .catch(error => {
              this.$swal.showValidationMessage(
                `Digite um email válido`
              )
            })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          this.$swal({
            title:'Email enviado com sucesso',
            icon: 'success'
            // title: `${result.value.login}'s avatar`,
            // imageUrl: result.value.avatar_url
          })
        }
      })
    }
  },
  mounted: function () {
    if (typeof this.$axios.defaults.headers.common['Authorization'] !== 'undefined' && this.$axios.defaults.headers.common['Authorization'] !== '') {
      this.$router.push({ path: '/home' })
    }
  }
}
</script>

<style>

.bg-image {
  background-image: linear-gradient(135deg, #3f3f3f 0%, #4b803e 100%);
}
</style>
