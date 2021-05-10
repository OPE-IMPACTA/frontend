<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center bg-quaternary">
        <div id="particles-js"></div>
        <q-card
          class="my-card"
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '35%' }"
        >
          <q-card-section horizontal>
            <q-img
              class="col-4 login-img"
              src="../assets/lamp.png"
              style="height: auto; max-width: 300px"
            />
            <q-card class="login-form col-8">
              <q-card-section>
                <div class="text-center q-pt-xl">
                  <p class="text-h2 login-txt text-secondary">Login</p>
                </div>
              </q-card-section>
              <q-card-section>
                <q-form @submit="onSubmit" class="form" ref="loginForm">
                  <q-input
                    v-model="email"
                    name="email"
                    id="email"
                    type="email"
                    label="Email"
                    class="q-ma-sm"
                    color="secondary"
                    lazy-rules
                    :rules="[
                      val => (val && val.length > 0) || 'Digite o seu Email'
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="mail" />
                    </template>
                  </q-input>
                  <q-input
                    v-model="password"
                    name="password"
                    id="password"
                    label="Senha"
                    type="password"
                    class="q-ma-sm"
                    color="secondary"
                    lazy-rules
                    :rules="[
                      val => (val && val.length > 0) || 'Digite sua senha'
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="vpn_key" />
                    </template>
                  </q-input>
                  <div class="q-pa-md q-gutter-md">
                    <div class="row justify-end">
                      <q-btn
                        rounded
                        type="submit"
                        color="primary"
                        label="Entrar"
                        size="17px"
                        style="width: 150px"
                      />
                    </div>
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      email: this.email,
      password: this.password
    };
  },
  methods: {
    loginNotify() {
      login;
      this.$q.notify({
        message: "Login Successful"
      });
    },
    onSubmit() {
      this.getLogin();
    },

    onReset() {
      this.email = null;
      this.password = null;
      this.$refs.loginForm.resetValidation();
    },

    getLogin() {
      let email = this.email;
      let password = this.password;

      this.$axios
        .post("auth/login", {
          email: email,
          password: password
        })
        .then(response => {
          let userJson = JSON.stringify(response.data);

          this.$axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.headers.authorization}`;

          localStorage.setItem("token", response.headers.authorization);
          localStorage.setItem("user", userJson);

          this.$router.push({ path: "/home" });
        })
        .catch(e => {
          this.$q.notify({
            message: e.response.data.erro,
            position: "top",
            color: "negative",
            icon: "warning"
          });
          this.onReset();
          return false;
        });
    }
  },
  mounted: function() {
    if (
      typeof this.$axios.defaults.headers.common["Authorization"] !==
        "undefined" &&
      this.$axios.defaults.headers.common["Authorization"] !== ""
    ) {
      this.$router.push({ path: "/home" });
    }

    particlesJS("particles-js", {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: "#ffffff"
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000"
          },
          polygon: {
            nb_sides: 5
          },
          image: {
            src: "img/github.svg",
            width: 100,
            height: 100
          }
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#053ea8",
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 4,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab"
          },
          onclick: {
            enable: true,
            mode: "push"
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 1
            }
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3
          },
          repulse: {
            distance: 200,
            duration: 0.4
          },
          push: {
            particles_nb: 4
          },
          remove: {
            particles_nb: 2
          }
        }
      },
      retina_detect: true
    });
  }
};
</script>

<style lang="scss">
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
}
.normal_gradient {
  background: linear-gradient(145deg, #ffffff);
}
.dark_gradient {
  background: linear-gradient(145deg, #000000);
}

.login-txt {
  color: $indigo-10;
  font-family: "Helvica";
}
</style>
