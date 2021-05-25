<template>
  <div>
    <q-item items-center>
      <q-item-section>
        <q-select
          outlined
          label="Projetos"
          color="orange"
          v-model="newEditItem.project"
          :options="projects"
          :rules="emptyField('Projeto obrigatório')"
        />
      </q-item-section>
    </q-item>
    <q-item items-center>
      <q-item-section>
        <q-select
          outlined
          label="Usuários"
          color="orange"
          v-model="newEditItem.user"
          :options="users"
          :rules="emptyField('Usuário obrigatório')"
        />
      </q-item-section>
    </q-item>
    <q-item items-center>
      <q-item-section>
        <div style="max-width: 250px">
          <q-input
            filled
            placeholder="Data início"
            v-model="newEditItem.startDate"
            color="orange"
            mask="date"
            :rules="emptyField('Data de início obrigatória')"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="newEditItem.startDate">
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Close"
                        color="orange"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </q-item-section>
      <q-item-section>
        <div style="max-width: 250px">
          <q-input
            filled
            placeholder="Data Final"
            v-model="newEditItem.endDate"
            color="orange"
            mask="date"
            :rules="emptyField('Data final obrigatória')"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="newEditItem.endDate">
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Close"
                        color="orange"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </q-item-section>
    </q-item>
    <q-item items-center>
      <q-item-section>
        <q-item-section>
          <q-input
            outlined
            color="orange"
            v-model="newEditItem.hours"
            type="number"
            label="Horas"
            :rules="emptyField('Horas obrigatória')"
          />
        </q-item-section>
      </q-item-section>
    </q-item>
    <q-item items-center>
      <q-item-section>
        <q-input
          outlined
          v-model="newEditItem.description"
          color="orange"
          type="textarea"
          label="Descrição"
          :rules="emptyField('Horas obrigatória')"
        />
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import { emptyField } from 'src/utils/rules-fields'
import { date } from 'quasar'
import services from 'src/services'
import { clearLocalStorage } from 'src/utils/local-storage'

export default {
  name: 'TaskManagement',
  props: {
    editItem: {}
  },
  data () {
    return {
      emptyField,
      newEditItem: this.editItem,
      users: [],
      projects: [],
      startDate: date.formatDate(Date.now(), 'YYYY/MM/DD'),
      endDate: date.formatDate(Date.now(), 'YYYY/MM/DD')
    }
  },
  mounted () {
    this.getClients()
    this.getUsers()
  },
  methods: {
    async getClients () {
      try {
        const {
          data,
          errors
        } = await services.project.getProjects()

        if (errors && errors.status === 401) {
          clearLocalStorage()
          this.$toast.error('Token inválido', {
            timeout: 2000
          })
          await this.$router.push({ name: 'Login' })
        }

        data.data.forEach(({
          _id: id,
          name
        }) => {
          this.projects.push({
            value: id,
            label: name
          })
        })
      } catch (error) {
        this.$toast.error('Ocorreu um erro ao buscar os clientes', {
          timeout: 2000
        })
      }
    },
    async getUsers () {
      try {
        const {
          data,
          errors
        } = await services.user.getUsers()

        if (errors && errors.status === 401) {
          clearLocalStorage()
          this.$toast.error('Token inválido', {
            timeout: 2000
          })
          await this.$router.push({ name: 'Login' })
        }

        data.data.forEach(({
          _id: id,
          name
        }) => {
          this.users.push({
            value: id,
            label: name
          })
        })
      } catch (error) {
        this.$toast.error('Ocorreu um erro ao buscar os clientes', {
          timeout: 2000
        })
      }
    }
  }
}
</script>
