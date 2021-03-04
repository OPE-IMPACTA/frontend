<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <div
          id="particles-js"
          :class="$q.dark.isActive ? 'dark_gradient' : 'normal_gradient'"
        ></div>
        <q-btn
          color="#9c9c9c"
          class="absolute-top-right"
          flat
          round
          @click="$q.dark.toggle()"
          :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"
        />
        <q-card class="login-form" v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}">
          <q-card-section>
            <q-avatar square size="100px" style="background-color: transparent; width: 150px" class="absolute-center">
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

<script type="text/javascript"></script>
<script>


import {Loading, QSpinnerPie} from "quasar";

export default {
  data() {
    return {
      email: this.email,
      password: this.password
    }
  },
  methods: {
    loginNotify() {
      this.$q.notify({
        message: 'Login Successful',
      })
    },
    onSubmit() {
      Loading.show({
        spinner: QSpinnerPie,
        spinnerColor: 'yellow',
        message: 'Aguarde, conectando ...',
        delay: 400
        // other props
      })

      this.timer = setTimeout(() => {
        this.getLogin()
        this.timer = void 0
      }, 3000)
    },

    onReset() {
      this.email = null
      this.password = null
      this.$refs.loginForm.resetValidation()
    },

    getLogin() {
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
        this.$router.push({path: '/home'})
      }).catch((e) => {
        this.$q.notify({
          message: 'Login Inválido',
          position: 'top',
          color: 'negative',
          icon: 'warning'
        })
        this.onReset()
        return false
      })
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
        preConfirm: (email) => {
          this.$axios.post('auth/forgot_password',
            {
              email: email
            }
          ).then(response => {
              if (response.status !== 200) {
                throw new Error(response.statusText)
              }
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
            title:'Pronto, tudo certo!',
            text: 'Um email foi enviado para redefinição de senha.',
            icon: 'success'
          })
        }
      })
    }
  },
  mounted: function () {
    if (typeof this.$axios.defaults.headers.common['Authorization'] !== 'undefined' && this.$axios.defaults.headers.common['Authorization'] !== '') {
      this.$router.push({ path: '/home' })
    }

    particlesJS("particles-js", {
      "particles": {
        "number": {
          "value": 80,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#ffffff"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          },
          "image": {
            "src": "img/github.svg",
            "width": 100,
            "height": 100
          }
        },
        "opacity": {
          "value": 0.5,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#9c9c9c",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 6,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "grab"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 140,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });
  }
}
</script>

<style>
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
}
.normal_gradient {
  background: linear-gradient(145deg, #FFFFFF);
}
.dark_gradient {
  background: linear-gradient(145deg, #000000);
}
/*.login-form {*/
/*  position: absolute;*/
/*  background-color: transparent;*/
/*  box-shadow: none !important;*/
/*}*/
</style>
