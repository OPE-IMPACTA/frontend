<template>
  <q-card
    class="row card-login"
    style="border-radius: 2%">
    <q-card-section
      horizontal
      class="row col-12"
    >
      <div class="col-4 container-logo">
        <q-img
          src="../../assets/logo-bullest.png"
          class="q-mt-xl"
        />
      </div>
      <q-card class="col-8">
        <q-card-section>
          <div class="text-center q-pt-xl">
            <p class="text-h2 text-primary">Login</p>
          </div>
        </q-card-section>
        <q-card-section>
          <q-form @submit="handleSubmit" ref="loginForm">
            <q-input
              v-model="email"
              name="email"
              id="email"
              type="email"
              label="Email"
              class="q-ma-sm"
              color="orange"
              :rules="emptyField('E-mail é obrigatório')"
            >
              <template v-slot:prepend>
                <q-icon name="mail"/>
              </template>
            </q-input>
            <q-input
              v-model="password"
              name="password"
              id="password"
              label="Senha"
              type="password"
              class="q-ma-sm"
              color="orange"
              :rules="emptyField('Senha é obrigatório')"
            >
              <template v-slot:prepend>
                <q-icon name="vpn_key"/>
              </template>
            </q-input>
            <div class="q-pa-md">
              <div class="row justify-center">
                <q-btn
                  rounded
                  align="around"
                  class="btn-fixed-width"
                  color="orange"
                  label="Entrar"
                  icon="login"
                  type="submit"
                  :disable="isLoading"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-card-section>
  </q-card>
</template>

<script>
import services from 'src/services'
import sleep from 'src/utils/sleep'
import { clearLocalStorage } from 'src/utils/local-storage'
import { emptyField } from 'src/utils/rules-fields'

export default {
  data () {
    return {
      email: '',
      password: '',
      isLoading: false,
      emptyField
    }
  },
  methods: {
    async handleSubmit () {
      try {
        this.isLoading = true

        const {
          data,
          headers,
          errors
        } = await services.user.login({
          email: this.email,
          password: this.password
        })

        if (!errors) {
          this.isLoading = false
          window.localStorage.setItem('token', headers.authorization)
          window.localStorage.setItem('user', JSON.stringify(data.data))
          await this.$router.push({ name: 'Home' })
          return
        }

        if (errors.status === 401) {
          clearLocalStorage()
          this.$toast.error('E-mail/Senha inválidos!', {
            timeout: 2000
          })
        }
        await sleep(2000)
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        this.$toast.error('Ocorreu um erro ao realizar o login', {
          timeout: 2000
        })
      }
    }
  }
}
</script>

<style scoped>
.card-login {
  width: 40%;
  height: 450px;
}

.container-logo {
  background: rgb(0,150,199);
  background: linear-gradient(180deg, rgba(0,150,199,1) 23%, rgba(72,202,228,1) 51%);
}
@media screen and (max-width: 1000px) {
  .card-login {
    width: 50%;
    height: 450px;
  }
}

@media screen and (max-width: 700px) {
  .card-login {
    width: 80%;
    height: 450px;
  }
}
</style>
